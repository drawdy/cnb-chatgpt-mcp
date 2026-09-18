import { chmod, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

export interface ApplyPatchOptions {
  repo: string;
  branch: string;
  patch: string;
  commitMessage: string;
  token: string;
  baseRef?: string;
  authorName?: string;
  authorEmail?: string;
  force?: boolean;
}

export interface ApplyPatchResult {
  branch: string;
  commit: string;
  changedFiles: string[];
}

function validateRepo(repo: string) {
  if (!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)+$/.test(repo)) {
    throw new Error('Invalid repository path');
  }
}

function validateRef(ref: string) {
  if (!ref || ref.startsWith('-') || /[\s~^:?*\\[\]]/.test(ref) || ref.includes('..') || ref.includes('@{')) {
    throw new Error(`Invalid git ref: ${ref}`);
  }
}

async function run(
  command: string,
  args: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv; input?: string } = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (data: string) => {
      stdout += data;
    });
    child.stderr.on('data', (data: string) => {
      stderr += data;
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}: ${stderr.trim()}`));
    });

    if (options.input !== undefined) {
      child.stdin.write(options.input);
    }
    child.stdin.end();
  });
}

async function createAskPass(directory: string) {
  if (process.platform === 'win32') {
    const path = join(directory, 'cnb-askpass.cmd');
    await writeFile(
      path,
      '@echo off\r\necho %CNB_MCP_GIT_ASKPASS_VALUE%\r\n',
      'utf8'
    );
    return path;
  }

  const path = join(directory, 'cnb-askpass.sh');
  await writeFile(path, '#!/bin/sh\nprintf "%s\\n" "$CNB_MCP_GIT_ASKPASS_VALUE"\n', 'utf8');
  await chmod(path, 0o700);
  return path;
}

async function withAskPass(
  askPass: string,
  token: string,
  value: 'username' | 'password',
  fn: (env: NodeJS.ProcessEnv) => Promise<string>
) {
  const env = {
    ...process.env,
    GIT_TERMINAL_PROMPT: '0',
    GIT_ASKPASS: askPass,
    CNB_MCP_GIT_ASKPASS_VALUE: value === 'username' ? 'cnb' : token
  };
  return fn(env);
}

async function runAuthenticatedGit(
  askPass: string,
  token: string,
  args: string[],
  cwd?: string
) {
  const wrapper = join(cwd ?? tmpdir(), process.platform === 'win32' ? 'git-auth.cmd' : 'git-auth.sh');
  const isWindows = process.platform === 'win32';
  const script = isWindows
    ? '@echo off\r\nset prompt=%1\r\nif not "%prompt:Username=%"=="%prompt%" (echo cnb) else (echo %CNB_MCP_GIT_TOKEN%)\r\n'
    : '#!/bin/sh\ncase "$1" in *Username*) printf "%s\\n" cnb ;; *) printf "%s\\n" "$CNB_MCP_GIT_TOKEN" ;; esac\n';

  await writeFile(wrapper, script, 'utf8');
  if (!isWindows) await chmod(wrapper, 0o700);

  return run('git', args, {
    cwd,
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: '0',
      GIT_ASKPASS: wrapper,
      CNB_MCP_GIT_TOKEN: token
    }
  });
}

export async function applyPatchAndPush(options: ApplyPatchOptions): Promise<ApplyPatchResult> {
  validateRepo(options.repo);
  validateRef(options.branch);
  if (options.baseRef) validateRef(options.baseRef);
  if (!options.token) throw new Error('CNB access token is required for Git writes');
  if (!options.patch.trim()) throw new Error('Patch must not be empty');

  const root = await mkdtemp(join(tmpdir(), 'cnb-mcp-'));
  const worktree = join(root, 'repo');

  try {
    const repositoryUrl = `https://cnb.cool/${options.repo}`;
    await runAuthenticatedGit(root, options.token, ['clone', '--filter=blob:none', '--no-checkout', repositoryUrl, worktree]);

    const remoteBranch = `origin/${options.branch}`;
    let branchExists = true;
    try {
      await run('git', ['rev-parse', '--verify', remoteBranch], { cwd: worktree });
    } catch {
      branchExists = false;
    }

    if (branchExists) {
      await run('git', ['checkout', '-B', options.branch, remoteBranch], { cwd: worktree });
    } else {
      const startPoint = options.baseRef ? `origin/${options.baseRef}` : 'origin/HEAD';
      await run('git', ['checkout', '-b', options.branch, startPoint], { cwd: worktree });
    }

    await run('git', ['apply', '--check', '--whitespace=nowarn', '-'], { cwd: worktree, input: options.patch });
    await run('git', ['apply', '--whitespace=nowarn', '-'], { cwd: worktree, input: options.patch });

    const status = await run('git', ['status', '--porcelain'], { cwd: worktree });
    if (!status) throw new Error('Patch produced no changes');

    await run('git', ['add', '-A'], { cwd: worktree });
    await run('git', ['config', 'user.name', options.authorName ?? 'CNB MCP'], { cwd: worktree });
    await run('git', ['config', 'user.email', options.authorEmail ?? 'cnb-mcp@localhost'], { cwd: worktree });
    await run('git', ['commit', '-m', options.commitMessage], { cwd: worktree });

    const commit = await run('git', ['rev-parse', 'HEAD'], { cwd: worktree });
    const changedFiles = (await run('git', ['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'], { cwd: worktree }))
      .split('\n')
      .filter(Boolean);

    const pushArgs = ['push'];
    if (options.force) pushArgs.push('--force-with-lease');
    pushArgs.push('origin', `HEAD:refs/heads/${options.branch}`);
    await runAuthenticatedGit(root, options.token, pushArgs, worktree);

    return {
      branch: options.branch,
      commit,
      changedFiles
    };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
