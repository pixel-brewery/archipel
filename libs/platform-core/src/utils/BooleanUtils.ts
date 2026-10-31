type Literal = 'true' | 'false' | 'yes' | 'no' | '1' | '0' | 'y' | 'n';
type BooleanAnyCase = Literal | Uppercase<Literal>;

/**
 * Options for boolean parsing
 */
interface BooleanOptions {
    /**
     * Strict parsing mode: Only recognizes "true" and "false" as valid boolean strings
     */
    strict?: boolean;
}

/**
 * Boolean Utility Class.
 * This class provides static methods to parse and format boolean values.
 *
 * @public
 */

export class BooleanUtils {
    /**
     * Parses a given value into a boolean.
     * Accepts flexible strings like "yes", "no", "y", "n", "1", "0", "true", "false".
     *
     * @param value - The value to parse into a boolean
     * @param options - Options for strict parsing mode
     * @returns The parsed boolean value
     * @throws Error if the value is not a valid boolean representation
     */
    public static parseBoolean(value: string | boolean, options?: BooleanOptions): boolean {
        if (typeof value === 'boolean') {
            return value;
        }

        const normalizedValue = value.toLowerCase().trim() as BooleanAnyCase;
        const isStrict = options?.strict ?? false;

        if (isStrict) {
            if (normalizedValue === 'true') {
                return true;
            }
            if (normalizedValue === 'false') {
                return false;
            }
            throw new Error(`Strict mode: Invalid boolean string '${value}'`);
        }

        switch (normalizedValue) {
            case 'true':
            case 'yes':
            case '1':
            case 'y':
                return true;
            case 'false':
            case 'no':
            case '0':
            case 'n':
                return false;
            default:
                throw new Error(`Invalid boolean string '${value}'`);
        }
    }

    /**
     * Formats a boolean into a specific string representation.
     *
     * @param bool - The boolean to format
     * @param trueFormat - The string to return for `true` values (defaults to "true")
     * @param falseFormat - The string to return for `false` values (defaults to "false")
     * @returns The formatted string representation of the boolean
     */
    public static formatBoolean(bool: boolean, trueFormat = 'true', falseFormat = 'false'): string {
        return bool ? trueFormat : falseFormat;
    }
}
