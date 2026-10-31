/**
 * Generates the canonical NestJS module composition for explicitly named abstract bases.
 *
 * @param moduleName - Name of the module being composed.
 * @param bases - Abstract class names ending in Base.
 * @returns A complete example with abstract classes, options and consumer registration.
 */
export function MODULE_PATTERN_WITH_CONTEXT(moduleName: string, bases: string[]): string {
    return `
## Example: Dynamic Module "${moduleName}"

Abstract bases: ${bases.map((base) => `\`${base}\``).join(', ')}

### Abstract Base Definitions

${bases
    .map(
        (base) => `\`\`\`typescript
// abstracts/${base}.ts

/** Defines the implementation contract for this capability. */
export abstract class ${base} {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /** Executes the capability supplied by an injectable adapter. */
    public abstract execute(): Promise<void>;

    // #endregion
}
\`\`\``,
    )
    .join('\n\n')}

### Options Interface

\`\`\`typescript
// interfaces/I${moduleName}Options.ts
import type { Type } from '@nestjs/common';
import type { IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
${bases.map((base) => `import type { ${base} } from '../abstracts/${base}.js';`).join('\n')}

/** Configures the module's implementation classes and typed configuration. */
export interface I${moduleName}Options {
${bases.map((base) => `    /** Injectable implementation of ${base}. */\n    readonly ${optionName(base)}: Type<${base}>;`).join('\n')}
    /** Additional typed configuration entries registered by the module. */
    readonly configEntries?: IConfigRegistryEntry[];
    /** Whether the configured module is global. */
    readonly isGlobal?: boolean;
}
\`\`\`

### Module Class

\`\`\`typescript
// ${moduleName}.ts
import { ConfigModule } from '@pixel-brewery/archipel-platform-configuration';
import { type DynamicModule, Module, type Provider } from '@nestjs/common';
import type { I${moduleName}Options } from './interfaces/I${moduleName}Options.js';
${bases.map((base) => `import { ${base} } from './abstracts/${base}.js';`).join('\n')}

/** Composes injectable adapters through their abstract base class tokens. */
@Module({})
export class ${moduleName} {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Registers the implementation classes and configuration entries.
     * @param options - Implementation classes and module configuration.
     * @returns The configured NestJS module.
     */
    public static register(options: I${moduleName}Options): DynamicModule {
        const adapterProviders: Provider[] = [
${bases.map((base) => `            { provide: ${base}, useClass: options.${optionName(base)} },`).join('\n')}
        ];
        return {
            global: options.isGlobal ?? false,
            module: ${moduleName},
            imports: [ConfigModule.register('${toKebabCase(moduleName)}', options.configEntries ?? [])],
            providers: adapterProviders,
            exports: [${bases.join(', ')}],
        };
    }

    // #endregion
}
\`\`\`

### Consumer Usage

\`\`\`typescript
@Module({
    imports: [
        ${moduleName}.register({
${bases.map((base) => `            ${optionName(base)}: My${base.replace(/Base$/, '')}Adapter,`).join('\n')}
        }),
    ],
})
export class AppModule {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
\`\`\`
`;
}

function optionName(base: string): string {
    const name = base.replace(/Base$/, '');
    return name.charAt(0).toLowerCase() + name.slice(1);
}

function toKebabCase(name: string): string {
    return name
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase()
        .replace(/-?module$/, '');
}
