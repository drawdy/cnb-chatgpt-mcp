export function getRepoPath(url: string) {
  let repoPath = '';
  if (!url) return repoPath;

  try {
    const urlObj = new URL(url);
    // Remove leading /
    repoPath = urlObj.pathname.substring(1);
  } catch {
    // ssh format address or malformed url
    repoPath = url.split(':')[1] ?? '';
  }
  // Remove tailing .git
  repoPath = repoPath.replace(/\.git$/, '');

  return repoPath;
}
