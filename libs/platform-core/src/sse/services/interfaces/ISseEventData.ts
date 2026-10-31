/**
 * Represents the data of a Server-Sent Event.
 *
 * @public
 */
export interface ISseEventData<out TData = unknown> {
    // #region Properties

    readonly action: `${string}:${string}`;

    readonly payload: TData;

    // #endregion
}

/**
 * Represents the data of a Server-Sent Event.
 *
 * @public
 */
export namespace ISseEventData {
    /**
     * Checks if the action id is valid.
     *
     * @public
     * @param key - The key to check.
     * @param action - The action to check.
     * @returns - Returns true if the action id is valid, false otherwise.
     */
    export function isActionId(key: string, action: string): boolean {
        return action.split(':')[0] === key;
    }
}
