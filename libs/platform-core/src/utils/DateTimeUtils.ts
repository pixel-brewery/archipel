// #region Helpers
const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;
// #endregion

type Literal =
    | 'Years'
    | 'Year'
    | 'Yrs'
    | 'Yr'
    | 'Y'
    | 'Weeks'
    | 'Week'
    | 'W'
    | 'Days'
    | 'Day'
    | 'D'
    | 'Hours'
    | 'Hour'
    | 'Hrs'
    | 'Hr'
    | 'H'
    | 'Minutes'
    | 'Minute'
    | 'Mins'
    | 'Min'
    | 'M'
    | 'Seconds'
    | 'Second'
    | 'Secs'
    | 'Sec'
    | 's'
    | 'Milliseconds'
    | 'Millisecond'
    | 'Msecs'
    | 'Msec'
    | 'Ms';
type UnitAnyCase = Literal | Uppercase<Literal> | Lowercase<Literal>;

export type StringValue = `${number}` | `${number}${UnitAnyCase}` | `${number} ${UnitAnyCase}`;

interface Options {
    /**
     * Set to `true` to use verbose formatting. Defaults to `false`.
     */
    long?: boolean;
}

/**
 * TimeSpan Utility Class.
 * Provides methods to parse and format time span values.
 */

export class DateTimeUtils {
    /**
     * Converts a time span value (string or number) to milliseconds or a formatted string.
     *
     * @param value - The time span value to convert
     * @param options - Options for formatting the output
     * @returns The parsed time in milliseconds or formatted time string
     */
    public static convert(value: StringValue | number, options?: Options): number | string {
        if (typeof value === 'string') {
            return this.parse(value);
        } else if (typeof value === 'number') {
            return this.format(value, options);
        }
        throw new Error('Value provided to TimeSpan.convert() must be a string or number.');
    }

    /**
     * Parses a time span string to milliseconds.
     *
     * @param value - The time span string to parse
     * @returns The time span in milliseconds
     * @throws Error if the string is invalid
     */
    public static parse(value: StringValue): number {
        if (typeof value !== 'string' || value.length === 0 || value.length > 100) {
            throw new Error('Value must be a non-empty string with a length of 1 to 100 characters. You provided: ' + JSON.stringify(value));
        }
        const match =
            /^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
                value,
            );
        const groups = match?.groups as
            | {
                  value: string;
                  type?: string;
              }
            | undefined;

        if (!groups) {
            return NaN;
        }

        const parsedValue = parseFloat(groups.value);
        const type = (groups.type || 'ms').toLowerCase() as Lowercase<Literal>;
        return this.unitToMilliseconds(parsedValue, type);
    }

    /**
     * Formats a number of milliseconds into a string representation.
     *
     * @param ms - The milliseconds to format
     * @param options - Options for formatting the output
     * @returns The formatted time span string
     */
    public static format(ms: number, options?: Options): string {
        if (typeof ms !== 'number' || !isFinite(ms)) {
            throw new Error('Value must be a finite number.');
        }
        return options?.long ? this.formatLong(ms) : this.formatShort(ms);
    }

    /**
     * Converts units to milliseconds.
     *
     * @param n - The numeric value to convert
     * @param type - The unit type
     * @returns The equivalent time in milliseconds
     */

    private static unitToMilliseconds(n: number, type: Lowercase<Literal>): number {
        switch (type) {
            case 'years':
            case 'year':
            case 'yrs':
            case 'yr':
            case 'y':
                return n * y;
            case 'weeks':
            case 'week':
            case 'w':
                return n * w;
            case 'days':
            case 'day':
            case 'd':
                return n * d;
            case 'hours':
            case 'hour':
            case 'hrs':
            case 'hr':
            case 'h':
                return n * h;
            case 'minutes':
            case 'minute':
            case 'mins':
            case 'min':
            case 'm':
                return n * m;
            case 'seconds':
            case 'second':
            case 'secs':
            case 'sec':
            case 's':
                return n * s;
            case 'milliseconds':
            case 'millisecond':
            case 'msecs':
            case 'msec':
            case 'ms':
                return n;
            default:
                throw new Error(`Unsupported time unit: ${type as string}`);
        }
    }

    /**
     * Formats milliseconds as a short time span string.
     *
     * @param ms - The time span in milliseconds
     * @returns The short format string
     */
    private static formatShort(ms: number): StringValue {
        const msAbs = Math.abs(ms);
        if (msAbs >= d) {
            return `${Math.round(ms / d)}d`;
        }
        if (msAbs >= h) {
            return `${Math.round(ms / h)}h`;
        }
        if (msAbs >= m) {
            return `${Math.round(ms / m)}m`;
        }
        if (msAbs >= s) {
            return `${Math.round(ms / s)}s`;
        }
        return `${ms}ms`;
    }

    /**
     * Formats milliseconds as a long time span string.
     *
     * @param ms - The time span in milliseconds
     * @returns The long format string
     */
    private static formatLong(ms: number): StringValue {
        const msAbs = Math.abs(ms);
        if (msAbs >= d) {
            return this.plural(ms, msAbs, d, 'day');
        }
        if (msAbs >= h) {
            return this.plural(ms, msAbs, h, 'hour');
        }
        if (msAbs >= m) {
            return this.plural(ms, msAbs, m, 'minute');
        }
        if (msAbs >= s) {
            return this.plural(ms, msAbs, s, 'second');
        }
        return `${ms} ms`;
    }

    /**
     * Helper for pluralizing time units.
     *
     * @param ms - The total milliseconds
     * @param msAbs - The absolute value of milliseconds
     * @param unitMs - The milliseconds of a single unit
     * @param name - The unit name
     * @returns The formatted pluralized time string
     */
    private static plural(ms: number, msAbs: number, unitMs: number, name: string): StringValue {
        const isPlural = msAbs >= unitMs * 1.5;
        return `${Math.round(ms / unitMs)} ${name}${isPlural ? 's' : ''}` as StringValue;
    }
}
