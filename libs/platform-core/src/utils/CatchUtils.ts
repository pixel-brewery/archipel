export class CatchUtils {
    // #region Methods

    public static catch<T extends Error>(input: unknown, handler: (error: T) => Error): void {
        if (CatchUtils.isError(input)) {
            handler(input as T);
        }
    }

    public static async catchError<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
        return promise.then((data) => [undefined, data] as [undefined, T]).catch((error: unknown) => [error as Error]);
    }

    public static isError(value: unknown): value is Error {
        return typeof value === 'object' && value !== null && 'message' in value;
    }

    // #endregion
}
