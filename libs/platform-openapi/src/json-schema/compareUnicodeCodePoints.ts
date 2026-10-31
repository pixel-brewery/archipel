// #region Methods

/**
 * Compares strings lexicographically by Unicode code point without locale-dependent collation.
 *
 * @param left - Left comparison value.
 * @param right - Right comparison value.
 * @returns A negative value, zero, or a positive value according to code-point order.
 * @internal
 */
export function compareUnicodeCodePoints(left: string, right: string): number {
    let leftOffset = 0;
    let rightOffset = 0;

    while (leftOffset < left.length && rightOffset < right.length) {
        const leftCodePoint = left.codePointAt(leftOffset) ?? -1;
        const rightCodePoint = right.codePointAt(rightOffset) ?? -1;

        if (leftCodePoint !== rightCodePoint) {
            return leftCodePoint < rightCodePoint ? -1 : 1;
        }

        leftOffset += leftCodePoint > 0xffff ? 2 : 1;
        rightOffset += rightCodePoint > 0xffff ? 2 : 1;
    }

    return leftOffset < left.length ? 1 : rightOffset < right.length ? -1 : 0;
}

// #endregion
