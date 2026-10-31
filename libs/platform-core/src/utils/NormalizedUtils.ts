/**
 * Utility functions for normalizing data.
 *
 * @public
 */
export class NormalizedUtils {
    /**
     * Normalize a search query by trimming whitespace and converting to lowercase.
     *
     * @param value The search query to normalize.
     * @returns The normalized search query.
     */
    public static normalizeString(value?: string): string | undefined {
        return value?.trim().toLowerCase();
    }

    /**
     * Normalize an array by removing duplicates.
     *
     * @param values The array to normalize.
     * @returns The normalized array.
     */
    public static normalizeArray<T>(values?: T[]): T[] | undefined {
        if (!values) {
            return undefined;
        }

        const normalizedSet = new Set<T>();
        values.forEach((v) => normalizedSet.add(v));
        return Array.from(normalizedSet);
    }

    /**
     * Normalize a number by ensuring it is non-negative.
     *
     * @param value The number to normalize.
     * @returns The normalized number.
     */
    public static normalizeNumber(value?: number): number | undefined {
        if (value === undefined || value === null) {
            return undefined;
        }

        return Math.max(0, value);
    }

    /**
     * Normalize a date by ensuring it is a valid date object.
     *
     * @param value The date to normalize.
     * @returns The normalized date.
     */
    public static normalizeDate(value?: Date): Date | undefined {
        if (!value) {
            return undefined;
        }

        return new Date(value);
    }

    /**
     * Normalize a boolean value.
     *
     * @param value The boolean value to normalize.
     * @returns The normalized boolean value.
     */
    public static normalizeBoolean(value?: boolean): boolean | undefined {
        if (value === undefined || value === null) {
            return undefined;
        }

        return Boolean(value);
    }
}
