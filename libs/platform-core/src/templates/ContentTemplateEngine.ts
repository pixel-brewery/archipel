// #region Imports

import { Injectable } from '@nestjs/common';
import { CatchUtils } from '../utils/CatchUtils.js';
import { GeneralTemplateValidationError } from './errors/GeneralTemplateValidationError.js';
import { MissingPlaceholderError } from './errors/MissingPlaceholderError.js';
import { UnmatchedBlockError } from './errors/UnmatchedBlockError.js';

// #endregion

/**
 * The `ContentTemplateEngine` class.
 *
 * @public
 */
@Injectable()
export class ContentTemplateEngine {
    // #region Ctor

    /**
     * Constructs a new instance of the `ContentTemplateEngine` class.
     *
     * @public
     */
    public constructor() {
        //
    }

    // #endregion

    // #region Methods

    /**
     * Compiles a template by replacing placeholders with the provided parameters.
     *
     * @public
     * @param content The content of the template to compile.
     * @param params The parameters to insert into the template.
     * @throws GeneralTemplateValidationError if the template validation fails.
     * @throws UnmatchedBlockError if template blocks are unmatched.
     * @throws MissingPlaceholderError if placeholders are missing.
     * @returns The compiled template as a string.
     */
    public compileTemplate(content: string, params: Record<string, unknown>): string {
        try {
            // First validate the template structure
            this.validateStructure(content);

            // Then interpolate the template
            const interpolatedTemplate = this.interpolate(content, params);

            // Finally validate that all placeholders were filled
            this.validatePlaceholders(interpolatedTemplate);

            return interpolatedTemplate;
        } catch (error: unknown) {
            if (error instanceof UnmatchedBlockError || error instanceof MissingPlaceholderError) {
                throw error;
            }

            if (CatchUtils.isError(error)) {
                throw new GeneralTemplateValidationError(`Template validation failed. ${error.message}`, error);
            }

            throw error;
        }
    }

    /**
     * Interpolates a string template by replacing placeholders with actual values.
     * Supports various template features like loops, conditionals, and simple variables.
     *
     * @private
     * @param template The raw template string.
     * @param params The values to insert into the template.
     * @returns The compiled string.
     *
     * @example
     * ```typescript
     * // Simple variable
     * interpolate('Hello, {{name}}!', { name: 'John' });
     * // Output: 'Hello, John!'
     *
     * // Loop
     * interpolate('{{#each items}}<li>{{name}}</li>{{/each}}', { items: [{name: 'A'}, {name: 'B'}] });
     * // Output: '<li>A</li><li>B</li>'
     *
     * // Conditional
     * interpolate('{{#if show}}Visible{{/if}}', { show: true });
     * // Output: 'Visible'
     * ```
     */
    private interpolate(template: string, params: Record<string, unknown>): string {
        let result = template;

        // Process {{#each}} loops
        result = this.processEachBlocks(result, params);
        // Process {{#with}} context switching (after each, so nested with blocks work)
        result = this.processWithBlocks(result, params);
        // Process {{#if}} conditionals
        result = this.processIfBlocks(result, params);
        // Process {{#unless}} conditionals (negative)
        result = this.processUnlessBlocks(result, params);
        // Process simple variable replacements
        result = this.processSimpleVariables(result, params);

        return result;
    }

    /**
     * Processes {{#each}} blocks for array iteration.
     *
     * @private
     * @param template The template string.
     * @param params The template parameters.
     * @returns The processed template.
     */
    private processEachBlocks(template: string, params: Record<string, unknown>): string {
        return this.processBlock(template, 'each', (arrayName, blockContent) => {
            // Handle dot notation (e.g., user.tags)
            const array = arrayName.includes('.') ? this.getNestedProperty(params, arrayName) : params[arrayName];

            if (!Array.isArray(array)) {
                return '';
            }

            return array
                .map((item, index) => {
                    // Handle primitive values in arrays
                    const itemData = typeof item === 'object' && item !== null ? item : { value: item };

                    const itemContext = {
                        ...params,
                        ...itemData,
                        '@index': index,
                        '@first': index === 0,
                        '@last': index === array.length - 1,
                        '@length': array.length,
                    };

                    // Recursively process nested blocks
                    return this.interpolate(blockContent, itemContext);
                })
                .join('');
        });
    }

    /**
     * Processes {{#if}} conditional blocks.
     *
     * @private
     * @param template The template string.
     * @param params The template parameters.
     * @returns The processed template.
     */
    private processIfBlocks(template: string, params: Record<string, unknown>): string {
        return this.processBlock(template, 'if', (varName, ifContent, elseContent) => {
            // Handle dot notation (e.g., user.isActive)
            const value = varName.includes('.') ? this.getNestedProperty(params, varName) : params[varName];
            const isTruthy = this.isTruthy(value);

            if (isTruthy) {
                // Recursively process nested blocks in the if content
                return this.interpolate(ifContent, params);
            } else if (elseContent) {
                // Recursively process nested blocks in the else content
                return this.interpolate(elseContent, params);
            } else {
                return '';
            }
        });
    }

    /**
     * Processes {{#unless}} conditional blocks (negative conditionals).
     *
     * @private
     * @param template The template string.
     * @param params The template parameters.
     * @returns The processed template.
     */
    private processUnlessBlocks(template: string, params: Record<string, unknown>): string {
        return this.processBlock(template, 'unless', (varName, unlessContent, elseContent) => {
            // Handle dot notation (e.g., user.isPublic)
            const value = varName.includes('.') ? this.getNestedProperty(params, varName) : params[varName];
            const isTruthy = this.isTruthy(value);

            if (!isTruthy) {
                // Recursively process nested blocks in the unless content
                return this.interpolate(unlessContent, params);
            } else if (elseContent) {
                // Recursively process nested blocks in the else content
                return this.interpolate(elseContent, params);
            } else {
                return '';
            }
        });
    }

    /**
     * Processes {{#with}} context switching blocks.
     *
     * @private
     * @param template The template string.
     * @param params The template parameters.
     * @returns The processed template.
     */
    private processWithBlocks(template: string, params: Record<string, unknown>): string {
        return this.processBlock(template, 'with', (varName, blockContent) => {
            // Handle dot notation (e.g., user.contact)
            const contextValue = varName.includes('.') ? this.getNestedProperty(params, varName) : params[varName];

            if (!contextValue || typeof contextValue !== 'object') {
                return '';
            }

            // If the context object is empty, return empty string (no content to process)
            const contextObj = contextValue as Record<string, unknown>;
            if (Object.keys(contextObj).length === 0) {
                return '';
            }

            const newContext = {
                ...params,
                ...contextObj,
            };

            // Recursively process nested blocks with the new context
            return this.interpolate(blockContent, newContext);
        });
    }

    /**
     * Processes simple variable replacements {{variable}}.
     *
     * @private
     * @param template The template string.
     * @param params The template parameters.
     * @returns The processed template.
     */
    private processSimpleVariables(template: string, params: Record<string, unknown>): string {
        return template.replace(/\{\{(?!#|\/)(.*?)\}\}/g, (_match, key) => {
            const trimmedKey = key.trim();

            // Handle {{this}} for primitive values in arrays
            if (trimmedKey === 'this') {
                const value = params['value'];
                if (value !== undefined && value !== null) {
                    return typeof value === 'string' ? value : String(value);
                }
                return '';
            }

            // Handle special variables like @index, @first, etc.
            if (trimmedKey.startsWith('@')) {
                const value = params[trimmedKey];
                return value !== undefined ? String(value) : '';
            }

            // Handle nested properties like user.name
            if (trimmedKey.includes('.')) {
                const value = this.getNestedProperty(params, trimmedKey);
                return value !== undefined && value !== null ? String(value) : '';
            }

            // Handle simple variables
            const value = params[trimmedKey];
            // If value is not in params object, keep the placeholder for validation
            if (!(trimmedKey in params)) {
                return `{{${trimmedKey}}}`;
            }
            // If value is null or undefined but in params, replace with empty string
            if (value === undefined || value === null) {
                return '';
            }
            return typeof value === 'string' ? value : String(value);
        });
    }

    /**
     * Gets a nested property value from an object using dot notation.
     *
     * @private
     * @param obj The object to search in.
     * @param path The dot-separated path to the property.
     * @returns The property value or undefined.
     */
    private getNestedProperty(obj: Record<string, unknown>, path: string): unknown {
        return path.split('.').reduce((current: unknown, key: string) => {
            return current && typeof current === 'object' && key in current ? (current as Record<string, unknown>)[key] : undefined;
        }, obj as unknown);
    }

    /**
     * Determines if a value is truthy for template conditionals.
     *
     * @private
     * @param value The value to check.
     * @returns True if the value is truthy.
     */
    private isTruthy(value: unknown): boolean {
        if (value === null || value === undefined) {
            return false;
        }
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'number') {
            return value !== 0;
        }
        if (typeof value === 'string') {
            return value.length > 0;
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        if (typeof value === 'object') {
            return Object.keys(value).length > 0;
        }
        return Boolean(value);
    }

    /**
     * Validates the structure of a template by checking if all blocks are matched.
     *
     * @private
     * @param template The template to validate.
     * @throws UnmatchedBlockError if template blocks are unmatched.
     */
    private validateStructure(template: string): void {
        // Check for unmatched template blocks (allowing whitespace and dot notation)
        const eachBlocks = template.match(/\{\{\s*#each\s+[\w.]+\s*\}\}/g);
        const eachEndBlocks = template.match(/\{\{\s*\/each\s*\}\}/g);
        if ((eachBlocks?.length || 0) !== (eachEndBlocks?.length || 0)) {
            throw new UnmatchedBlockError('each');
        }

        const ifBlocks = template.match(/\{\{\s*#if\s+[\w.]+\s*\}\}/g);
        const ifEndBlocks = template.match(/\{\{\s*\/if\s*\}\}/g);
        if ((ifBlocks?.length || 0) !== (ifEndBlocks?.length || 0)) {
            throw new UnmatchedBlockError('if');
        }

        const unlessBlocks = template.match(/\{\{\s*#unless\s+[\w.]+\s*\}\}/g);
        const unlessEndBlocks = template.match(/\{\{\s*\/unless\s*\}\}/g);
        if ((unlessBlocks?.length || 0) !== (unlessEndBlocks?.length || 0)) {
            throw new UnmatchedBlockError('unless');
        }

        const withBlocks = template.match(/\{\{\s*#with\s+[\w.]+\s*\}\}/g);
        const withEndBlocks = template.match(/\{\{\s*\/with\s*\}\}/g);
        if ((withBlocks?.length || 0) !== (withEndBlocks?.length || 0)) {
            throw new UnmatchedBlockError('with');
        }
    }

    /**
     * Validates that all placeholders in the template have been filled.
     *
     * @private
     * @param template The interpolated template to validate.
     * @throws MissingPlaceholderError if any placeholders are still present.
     */
    private validatePlaceholders(template: string): void {
        // Check for unfilled simple variables (but ignore template directives, @ variables, and else tags)
        const simpleVariables = template.match(/\{\{(?!#|\/)(.*?)\}\}/g);
        if (simpleVariables && simpleVariables.length > 0) {
            const unfilled = simpleVariables.filter((match) => {
                const content = match.replace(/\{\{|\}\}/g, '').trim();
                // Ignore @ variables and 'else' keyword
                return !content.startsWith('@') && content !== 'else';
            });
            if (unfilled.length > 0) {
                throw new MissingPlaceholderError(unfilled);
            }
        }
    }

    /**
     * Processes a block type (each, if, unless, with) by finding matching pairs and processing content.
     * Handles nested blocks correctly by counting depth.
     *
     * @private
     * @param template The template string.
     * @param blockType The type of block to process ('each', 'if', 'unless', 'with').
     * @param processor The function to process the block content.
     * @returns The processed template.
     */
    private processBlock(template: string, blockType: string, processor: (varName: string, content: string, elseContent?: string) => string): string {
        let result = template;

        // Keep processing until no more blocks of this type are found at the current nesting level
        for (;;) {
            // Allow whitespace after {{ and before }}, and dot notation in variable names
            const startPattern = new RegExp(`\\{\\{\\s*#${blockType}\\s+([\\w.]+)\\s*\\}\\}`, 'g');
            const matches = Array.from(result.matchAll(startPattern));

            if (matches.length === 0) {
                break;
            }

            // Process the first match (outermost block at this level)
            const match = matches[0];
            if (match.index === undefined) {
                break;
            }
            const startIndex = match.index;
            const varName = match[1];
            const startTag = match[0];

            // Find the matching end tag by counting depth (allowing whitespace)
            const elseTagPattern = /^\{\{\s*else\s*\}\}/;
            let depth = 1;
            let currentIndex = startIndex + startTag.length;
            let blockEndIndex = -1;
            let elseIndex = -1;
            let elseTagLength = 0;
            let endTagLength = 0;

            // Track depth for ALL block types, not just the current one
            let anyBlockDepth = 1; // depth for any {{#...}} blocks

            while (currentIndex < result.length && depth > 0) {
                const remaining = result.substring(currentIndex);

                if (currentIndex > startIndex + 5000) {
                    break; // Prevent infinite loop
                }

                // Check for ANY nested start tag (any block type)
                const anyStartPattern = /^\{\{\s*#(\w+)\s+[\w.]+\s*\}\}/;
                const anyStartMatch = remaining.match(anyStartPattern);
                if (anyStartMatch) {
                    const matchedBlockType = anyStartMatch[1];
                    anyBlockDepth++;

                    // If it's the same block type as we're processing, increment our depth too
                    if (matchedBlockType === blockType) {
                        depth++;
                    }
                    currentIndex += anyStartMatch[0].length;
                    continue;
                }

                // Check for else tag - only accept at anyBlockDepth === 1 (no nested blocks of any type)
                const elseMatch = remaining.match(elseTagPattern);
                if (anyBlockDepth === 1 && elseIndex === -1 && elseMatch) {
                    elseIndex = currentIndex;
                    elseTagLength = elseMatch[0].length;
                    currentIndex += elseMatch[0].length;
                    continue;
                }

                // Check for ANY end tag
                const anyEndPattern = /^\{\{\s*\/(\w+)\s*\}\}/;
                const anyEndMatch = remaining.match(anyEndPattern);
                if (anyEndMatch) {
                    const matchedBlockType = anyEndMatch[1];
                    anyBlockDepth--;

                    // If it's our block type, decrement our depth
                    if (matchedBlockType === blockType) {
                        depth--;
                        if (depth === 0) {
                            blockEndIndex = currentIndex;
                            endTagLength = anyEndMatch[0].length;
                            break;
                        }
                    }
                    currentIndex += anyEndMatch[0].length;
                    continue;
                }

                currentIndex++;
            }

            if (blockEndIndex === -1) {
                break; // No matching end tag found
            }

            // Extract block content
            const contentStart = startIndex + startTag.length;
            let content: string;
            let elseContent: string | undefined;

            if (elseIndex !== -1) {
                content = result.substring(contentStart, elseIndex);
                elseContent = result.substring(elseIndex + elseTagLength, blockEndIndex);
            } else {
                content = result.substring(contentStart, blockEndIndex);
            }

            // Process the block
            const processed = processor(varName, content, elseContent);

            // Replace the block with the processed content
            result = result.substring(0, startIndex) + processed + result.substring(blockEndIndex + endTagLength);
        }

        return result;
    }

    // #endregion
}
