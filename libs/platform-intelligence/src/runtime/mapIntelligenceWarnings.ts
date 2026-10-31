/**
 * Maps provider warnings to stable human-readable descriptions.
 *
 * @internal
 */
export function mapIntelligenceWarnings(warnings: ReadonlyArray<unknown> | undefined): ReadonlyArray<string> {
    return (warnings ?? []).map((warning) => {
        if (typeof warning === 'string') {
            return warning;
        }
        if (warning && typeof warning === 'object') {
            const record = warning as Readonly<Record<string, unknown>>;
            if (typeof record['message'] === 'string') {
                return record['message'];
            }
            if (typeof record['type'] === 'string') {
                return record['type'];
            }
        }

        return 'Provider warning';
    });
}
