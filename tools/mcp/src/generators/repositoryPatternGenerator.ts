/**
 * Generates a full repository class, entity interface, query factories, module
 * registration, and service usage example for a given Prisma model.
 */
export function REPOSITORY_PATTERN_WITH_MODEL(modelName: string, fields: string[]): string {
    return `
## Example: Repository for "${modelName}"

Given a Prisma model \`${modelName}\` with fields: ${fields.map((f) => `\`${f}\``).join(', ')}

### Repository Class

\`\`\`typescript
// repositories/${modelName}Repository.ts
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  DatabaseService,
  DelegateArgs,
  DelegateReturnTypes,
  RepositoryBase,
} from '@pixel-brewery/archipel-platform-database';
import { I${modelName}Entity } from '../models/entities/I${modelName}Entity';

@Injectable()
export class ${modelName}Repository extends RepositoryBase<
  Prisma.${modelName}Delegate,
  DelegateArgs<Prisma.${modelName}Delegate>,
  DelegateReturnTypes<Prisma.${modelName}Delegate>,
  I${modelName}Entity
> {

  // #region Ctor

  public constructor(db: DatabaseService) {
    super(db, db.client.${lowerFirst(modelName)});
  }

  // #endregion

}
\`\`\`

### Entity Interface

\`\`\`typescript
// models/entities/I${modelName}Entity.ts
export interface I${modelName}Entity {
${fields.map((f) => `  readonly ${f}: ${inferFieldType(f)};`).join('\n')}
}
\`\`\`

### Query Factories

\`\`\`typescript
// queries/find${modelName}ByIdQuery.ts
import { Prisma } from '@prisma/client';
import { query } from '@pixel-brewery/archipel-platform-database';
import { I${modelName}Entity } from '../models/entities/I${modelName}Entity';

export function find${modelName}ByIdQuery(id: string) {
  return query<Prisma.${modelName}Delegate, I${modelName}Entity | null>(
    'find${modelName}ById',
    (model) => model.findFirst({
      where: { id },
      select: { ${fields.map((f) => `${f}: true`).join(', ')} },
    }),
  );
}

export function findAll${modelName}sQuery(skip = 0, take = 20) {
  return query<Prisma.${modelName}Delegate, I${modelName}Entity[]>(
    'findAll${modelName}s',
    (model) => model.findMany({
      skip,
      take,
      select: { ${fields.map((f) => `${f}: true`).join(', ')} },
      orderBy: { ${fields.includes('createdAt') ? 'createdAt' : fields[0]}: 'desc' },
    }),
  );
}

export function count${modelName}sQuery() {
  return query<Prisma.${modelName}Delegate, number>(
    'count${modelName}s',
    (model) => model.count(),
  );
}
\`\`\`

### Module Registration

\`\`\`typescript
import { DatabaseModule } from '@pixel-brewery/archipel-platform-database';
import { ${modelName}Repository } from './repositories/${modelName}Repository';
import { ${modelName}Service } from './services/${modelName}Service';

@Module({
  imports: [DatabaseModule.register()],
  providers: [${modelName}Repository, ${modelName}Service],
  exports: [${modelName}Service],
})
export class ${modelName}Module {}
\`\`\`

### Service Usage

\`\`\`typescript
@Injectable()
export class ${modelName}Service {

  // #region Fields

  private readonly _${lowerFirst(modelName)}Repository: ${modelName}Repository;

  // #endregion

  // #region Ctor

  public constructor(${lowerFirst(modelName)}Repository: ${modelName}Repository) {
    this._${lowerFirst(modelName)}Repository = ${lowerFirst(modelName)}Repository;
  }

  // #endregion

  // #region Methods

  public async findById(id: string): Promise<I${modelName}Entity | null> {
    return this._${lowerFirst(modelName)}Repository.execute(find${modelName}ByIdQuery(id));
  }

  public async findAll(skip = 0, take = 20): Promise<I${modelName}Entity[]> {
    return this._${lowerFirst(modelName)}Repository.execute(findAll${modelName}sQuery(skip, take));
  }

  public async count(): Promise<number> {
    return this._${lowerFirst(modelName)}Repository.execute(count${modelName}sQuery());
  }

  // #endregion

}
\`\`\`
`;
}

function inferFieldType(fieldName: string): string {
    if (fieldName === 'id') return 'string';
    if (fieldName.endsWith('Id')) return 'string';
    if (fieldName.endsWith('At') || fieldName === 'createdAt' || fieldName === 'updatedAt') return 'Date';
    if (fieldName.startsWith('is') || fieldName.startsWith('has')) return 'boolean';
    if (fieldName === 'count' || fieldName === 'quantity' || fieldName === 'amount' || fieldName === 'price') return 'number';

    return 'string';
}

function lowerFirst(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
