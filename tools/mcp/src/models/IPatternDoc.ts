/**
 * Describes a loaded pattern documentation entry.
 */
export interface IPatternDoc {
    /** File name without extension (e.g. "config-pattern"). */
    readonly name: string;

    /** Human-readable title from frontmatter. */
    readonly title: string;

    /** Short description from frontmatter. */
    readonly description: string;

    /** Sort order from frontmatter. */
    readonly order: number;

    /** Markdown body (without frontmatter). */
    readonly content: string;
}
