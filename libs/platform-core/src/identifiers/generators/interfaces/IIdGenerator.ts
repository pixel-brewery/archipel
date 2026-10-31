/**
 * Interface for ID generators
 */
export interface IIdGenerator {
    // #region Methods

    /**
     * Generates a new ID
     *
     * @public
     * @param prefix Optional prefix to prepend to the ID
     * @param postfix Optional postfix to append to the ID
     */
    generate(prefix?: string, postfix?: string): string;

    /**
     * Validates if the given ID conforms to the expected format
     *
     * @public
     * @param id The ID to validate
     * @returns True if the ID is valid, otherwise false
     */
    isValid(id: string): boolean;

    // #endregion
}
