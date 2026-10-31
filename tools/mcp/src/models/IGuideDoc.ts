/**
 * Describes a loaded guide documentation entry.
 */
export interface IGuideDoc {
    /** File name without extension (e.g. "getting-started"). */
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
