const url = process.env.CNB_OPENAPI_URL ?? 'https://api.cnb.cool/swagger.json';

const response = await fetch(url, {
  headers: { Accept: 'application/json' },
  signal: AbortSignal.timeout(15000)
});
if (!response.ok) {
  throw new Error(`CNB OpenAPI request failed: ${response.status} ${response.statusText}`);
}
const spec = await response.json();

function findGetPathByOperationId(operationId) {
  for (const [path, methods] of Object.entries(spec.paths ?? {})) {
    if (methods?.get?.operationId === operationId) return path;
  }
  throw new Error(`Missing GET operationId ${operationId}`);
}

function query(path, name) {
  const operation = spec.paths?.[path]?.get;
  if (!operation) throw new Error(`Missing GET ${path}`);
  const parameter = operation.parameters?.find((item) => item.in === 'query' && item.name === name);
  if (!parameter) throw new Error(`Missing query parameter ${path}#${name}`);
  return parameter;
}

function expectEnum(path, name, values) {
  const actual = query(path, name).enum ?? [];
  for (const value of values) {
    if (!actual.includes(value)) {
      throw new Error(`CNB OpenAPI drift: ${path}#${name} no longer contains ${value}; actual=${actual.join(',')}`);
    }
  }
}

const userRepos = findGetPathByOperationId('GetRepos');
const groupRepos = findGetPathByOperationId('GetGroupSubRepos');
const workspaces = findGetPathByOperationId('ListWorkspaces');

expectEnum(userRepos, 'filter_type', ['private', 'public', 'secret']);
expectEnum(userRepos, 'role', ['Guest', 'Reporter', 'Developer', 'Master', 'Owner']);
expectEnum(userRepos, 'order_by', ['created_at', 'last_updated_at', 'stars', 'slug_path', 'forks']);
expectEnum(userRepos, 'status', ['active', 'archived']);
expectEnum(groupRepos, 'filter_type', ['private', 'public', 'secret']);
expectEnum(groupRepos, 'order_by', ['created_at', 'last_updated_at', 'stars', 'slug_path', 'forks']);
expectEnum(groupRepos, 'status', ['active', 'archived']);
query(workspaces, 'page_size');

console.log('CNB OpenAPI repository/workspace contract is compatible.');
