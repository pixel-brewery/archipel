/**
 * Generates a full mapping example (input interface, key, profile, module registration,
 * controller usage) for a given entity and its target response class.
 */
export function MAPPING_PATTERN_WITH_CONTEXT(entityName: string, fields: string[], responseName: string): string {
    return `
## Example: Mapping for "${entityName}" → "${responseName}"

Given an entity \`${entityName}\` with fields: ${fields.map((f) => `\`${f}\``).join(', ')}

### 1. Input Interface

\`\`\`typescript
// models/mapping-inputs/I${entityName}MappingInput.ts

export interface I${entityName}MappingInput {
${fields.map((f) => `  readonly ${f}: ${inferMappingFieldType(f)};`).join('\n')}
}
\`\`\`

### 2. Mapping Key

\`\`\`typescript
// constants/MappingKeys.ts
import { createMappingKey } from '@pixel-brewery/archipel-platform-mapping';
import { I${entityName}MappingInput } from '../models/mapping-inputs/I${entityName}MappingInput';
import { ${responseName} } from '../dtos/${responseName}';

export const ${toConstantCase(entityName)}_MAPPING_KEY = createMappingKey<I${entityName}MappingInput, ${responseName}>('${toDotNotation(entityName)}');
\`\`\`

### 3. Mapping Profile

\`\`\`typescript
// mappers/${entityName}MappingProfile.ts
import { MappingProfileBase, IMappingBuilder } from '@pixel-brewery/archipel-platform-mapping';
import { ${toConstantCase(entityName)}_MAPPING_KEY } from '../constants/MappingKeys';
import { I${entityName}MappingInput } from '../models/mapping-inputs/I${entityName}MappingInput';
import { ${responseName} } from '../dtos/${responseName}';

export class ${entityName}MappingProfile extends MappingProfileBase {

  // #region Methods

  public configure(builder: IMappingBuilder): void {
    builder.createKeyedMap(${toConstantCase(entityName)}_MAPPING_KEY, (input: I${entityName}MappingInput) => {
      const response = new ${responseName}();
${fields.map((f) => `      response.${f} = input.${f};`).join('\n')}

      return response;
    });
  }

  // #endregion

}
\`\`\`

### 4. Module Registration

\`\`\`typescript
import { MappingModule } from '@pixel-brewery/archipel-platform-mapping';
import { ${entityName}MappingProfile } from './mappers/${entityName}MappingProfile';

@Module({
  imports: [
    MappingModule.withProfiles([${entityName}MappingProfile]),
  ],
})
export class ${entityName}Module {}
\`\`\`

### 5. Controller Usage

\`\`\`typescript
// In a controller method:
const entity = await this._${lowerFirst(entityName)}Service.findById(id);
const response = this._mappingService.map(${toConstantCase(entityName)}_MAPPING_KEY, entity);
\`\`\`
`;
}

function inferMappingFieldType(fieldName: string): string {
    if (fieldName === 'id') return 'string';
    if (fieldName.endsWith('Id')) return 'string';
    if (fieldName.endsWith('At') || fieldName === 'createdAt' || fieldName === 'updatedAt') return 'Date';
    if (fieldName.startsWith('is') || fieldName.startsWith('has')) return 'boolean';
    if (fieldName === 'count' || fieldName === 'quantity' || fieldName === 'amount' || fieldName === 'price') return 'number';

    return 'string';
}

function toConstantCase(name: string): string {
    return name.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}

function toDotNotation(name: string): string {
    return name.replace(/([a-z])([A-Z])/g, '$1.$2').toLowerCase();
}

function lowerFirst(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
