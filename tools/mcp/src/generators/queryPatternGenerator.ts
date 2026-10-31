/**
 * Generates model-specific query factory examples based on a Prisma model name and its fields.
 */
export function QUERY_PATTERN_WITH_MODEL(modelName: string, fields: string[]): string {
    return `
## Example: Queries for "${modelName}"

Given a Prisma model \`${modelName}\` with fields: ${fields.map((f) => `\`${f}\``).join(', ')}

### findFirst query
\`\`\`typescript
import { Prisma } from '@prisma/client';
import { query } from '@pixel-brewery/archipel-platform-database';

export function find${modelName}ByIdQuery(id: string) {
  return query<Prisma.${modelName}Delegate, { ${fields.map((f) => `${f}: ${inferFieldType(f)}`).join('; ')} } | null>(
    'find${modelName}ById',
    (model) =>
      model.findFirst({
        where: { id },
        select: { ${fields.map((f) => `${f}: true`).join(', ')} },
      }),
  );
}
\`\`\`

### findMany query
\`\`\`typescript
export function findAll${modelName}sQuery(skip = 0, take = 20) {
  return query<Prisma.${modelName}Delegate, Array<{ ${fields.map((f) => `${f}: ${inferFieldType(f)}`).join('; ')} }>>(
    'findAll${modelName}s',
    (model) =>
      model.findMany({
        skip,
        take,
        select: { ${fields.map((f) => `${f}: true`).join(', ')} },
        orderBy: { ${fields.includes('createdAt') ? 'createdAt' : fields[0]}: 'desc' },
      }),
  );
}
\`\`\`

### count query
\`\`\`typescript
export function count${modelName}sQuery() {
  return query<Prisma.${modelName}Delegate, number>(
    'count${modelName}s',
    (model) => model.count(),
  );
}
\`\`\`

### Service usage
\`\`\`typescript
// In a service method:
const item = await this._${lowerFirst(modelName)}Repository.execute(find${modelName}ByIdQuery(id));
const items = await this._${lowerFirst(modelName)}Repository.execute(findAll${modelName}sQuery(0, 50));
const total = await this._${lowerFirst(modelName)}Repository.execute(count${modelName}sQuery());
\`\`\`
`;
}

function inferFieldType(fieldName: string): string {
    if (fieldName === 'id') return 'string';
    if (fieldName.endsWith('Id')) return 'string';
    if (fieldName.endsWith('At') || fieldName === 'createdAt' || fieldName === 'updatedAt') return 'Date';
    if (fieldName.startsWith('is') || fieldName.startsWith('has')) return 'boolean';
    if (fieldName === 'count' || fieldName === 'quantity' || fieldName === 'amount' || fieldName === 'order') return 'number';
    if (fieldName === 'email' || fieldName === 'name' || fieldName === 'title' || fieldName === 'description') return 'string';

    return 'unknown';
}

function lowerFirst(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
