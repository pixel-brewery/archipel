/**
 * Describes a loaded package documentation entry.
 */
export interface IPackageDoc {
    /** Directory name (e.g. "platform-core"). */
    readonly name: string;

    /** Human-readable title from frontmatter. */
    readonly title: string;

    /** Short description from frontmatter. */
    readonly description: string;

    /** Tags from frontmatter. */
    readonly tags: readonly string[];

    /** Scoped npm package name (e.g. "@pixel-brewery/archipel-platform-core"). */
    readonly packageScope: string;

    /** Markdown body of the hand-written docs (without frontmatter). */
    readonly content: string;

    /** Concatenated API reference markdown (from api/ subfolder). */
    readonly apiContent: string;
}
