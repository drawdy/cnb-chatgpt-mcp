function trimTrailingSlash(val: string): string {
  return val.replace(/\/+$/, '');
}

function normaliseLink(link: string, repoSlug: string, branchOrSha?: string): string {
  const endpoint = trimTrailingSlash(process.env.CNB_WEB_ENDPOINT || 'https://cnb.cool');
  const baseURL = `${endpoint}/${repoSlug}`;

  if (!link) return link;

  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(link) || /^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith('#')) {
    return link;
  }

  if (link.startsWith('/-/')) {
    return `${baseURL}${link}`;
  }

  if (!branchOrSha) {
    return link;
  }

  if (link.startsWith('../')) {
    return `${baseURL}/-/git/raw/${branchOrSha}/${link}`;
  }

  if (link.startsWith('./')) {
    return `${baseURL}/-/git/raw/${branchOrSha}${link.substring(1)}`;
  }

  if (link.startsWith('/') && !link.startsWith('//')) {
    return `${baseURL}/-/git/raw/${branchOrSha}${link}`;
  }

  return link;
}

export default function convertLink(text: string, repoSlug: string, branchOrSha?: string): string {
  if (!text || !repoSlug) return text;

  let codeBlockPositions: number[] = [];
  let index = 0;
  while (index !== -1) {
    const nextIndex = text.indexOf('```', index);
    if (nextIndex === -1) break;
    codeBlockPositions.push(nextIndex);
    index = nextIndex + 3;
  }
  if (codeBlockPositions.length % 2 !== 0) {
    codeBlockPositions = codeBlockPositions.slice(0, codeBlockPositions.length - 1);
  }

  let inlineCodeBlockPositions: number[] = [];
  index = 0;
  while (index < text.length) {
    const nextIndex = text.indexOf('`', index);
    if (nextIndex === -1) break;
    if (
      (nextIndex === 0 || text.charAt(nextIndex - 1) !== '`') &&
      (nextIndex === text.length - 1 || text.charAt(nextIndex + 1) !== '`')
    ) {
      inlineCodeBlockPositions.push(nextIndex);
    }
    index = nextIndex + 1;
  }
  if (inlineCodeBlockPositions.length % 2 !== 0) {
    inlineCodeBlockPositions = inlineCodeBlockPositions.slice(0, inlineCodeBlockPositions.length - 1);
  }

  const excludedRanges = [...codeBlockPositions, ...inlineCodeBlockPositions].reduce((result, item, idx) => {
    if (idx % 2 === 0) {
      return result.concat([[item]]);
    }
    result[result.length - 1].push(item);
    return result;
  }, [] as number[][]);

  const isInExcludedRange = (pos: number): boolean => excludedRanges.some(([start, end]) => pos >= start && pos < end);

  const replacements: Array<{ start: number; end: number; newUrl: string }> = [];
  let match: RegExpExecArray | null;

  const markdownLinkRegex = /!?\[([^\]]+)\]\(([^)]+)\)/g;
  while ((match = markdownLinkRegex.exec(text)) !== null) {
    if (isInExcludedRange(match.index)) continue;
    const prefixLength = (match[0].startsWith('!') ? 1 : 0) + 1 + match[1].length + 2;
    const urlStart = match.index + prefixLength;
    const urlEnd = urlStart + match[2].length;
    const newUrl = normaliseLink(match[2], repoSlug, branchOrSha);
    if (newUrl !== match[2]) {
      replacements.push({ start: urlStart, end: urlEnd, newUrl });
    }
  }

  const htmlTagRegex = /\s(src|href)=["']([^"']+)["']/gi;
  while ((match = htmlTagRegex.exec(text)) !== null) {
    if (isInExcludedRange(match.index)) continue;
    const urlStart = match.index + match[0].indexOf(match[2]);
    const urlEnd = urlStart + match[2].length;
    const newUrl = normaliseLink(match[2], repoSlug, branchOrSha);
    if (newUrl !== match[2]) {
      replacements.push({ start: urlStart, end: urlEnd, newUrl });
    }
  }

  replacements.sort((a, b) => b.start - a.start);

  let result = text;
  for (const { start, end, newUrl } of replacements) {
    result = result.substring(0, start) + newUrl + result.substring(end);
  }

  return result;
}
