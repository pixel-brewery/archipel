/**
 * Marker function for environment strings.
 *
 * It behaves like a normal template literal but allows you to
 * later search/grep all `env` usages in the codebase.
 */
export function env(strings: TemplateStringsArray, ...values: unknown[]): string {
    return strings.reduce((out, part, i) => out + part + (i < values.length ? values[i] : ''), '');
}
