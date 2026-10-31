// #region Types

interface IDatabaseFailure extends Readonly<Record<string, string>> {
    readonly 'failure.kind': string;
    readonly 'error.code': string;
    readonly 'cause.code': string;
}

// #endregion

// #region Functions

/**
 * Classifies provider failures without exporting messages, SQL, parameters or credentials.
 *
 * @remarks
 * Prisma's P2028 code describes transaction failures across lifecycle phases, so it is
 * classified as `transaction` without inferring whether the transaction started or closed.
 *
 * @param error - The original failure, including wrapped Prisma driver causes.
 * @returns Bounded diagnostic attributes.
 * @public
 */
export function describeDatabaseFailure(error: unknown): IDatabaseFailure {
    const pending: unknown[] = [error];
    const seen = new Set<object>();
    const codes: string[] = [];
    let poolTimeout = false;

    while (pending.length > 0 && seen.size < 12) {
        const candidate = pending.shift();
        if (!candidate || typeof candidate !== 'object' || seen.has(candidate)) {
            continue;
        }
        seen.add(candidate);

        // Diagnostics must also survive exotic thrown objects and accessor failures.
        try {
            for (const key of ['code', 'originalCode'] as const) {
                const code = Reflect.get(candidate, key);
                if (
                    typeof code === 'string' &&
                    /^(P\d{4}|08[A-Z0-9]{3}|40[A-Z0-9]{3}|53[A-Z0-9]{3}|57[A-Z0-9]{3}|ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN)$/.test(code)
                ) {
                    codes.push(code);
                }
            }
            const message = Reflect.get(candidate, 'message');
            poolTimeout ||=
                typeof message === 'string' &&
                /timeout exceeded when trying to connect|connection timeout|timeout exceeded when waiting for connection/i.test(message);
            for (const key of ['cause', 'meta', 'driverAdapterError']) {
                pending.push(Reflect.get(candidate, key));
            }
        } catch {
            // Never let telemetry replace the original application failure.
        }
    }

    const code = codes[0] ?? (poolTimeout ? 'POOL_ACQUIRE_TIMEOUT' : 'UNKNOWN');
    const causeCode = codes.at(-1) ?? code;
    const kind = poolTimeout
        ? 'pool_timeout'
        : codes.includes('P2028')
          ? 'transaction'
          : codes.includes('P2024')
            ? 'pool_timeout'
            : codes.includes('P0001')
              ? 'database_rule'
              : codes.some((value) => /^(08|ECONN|ETIMEDOUT|ENOTFOUND|EAI_AGAIN)/.test(value))
                ? 'connection'
                : codes.some((value) => value.startsWith('40'))
                  ? 'transaction_conflict'
                  : codes.some((value) => /^(53|57)/.test(value))
                    ? 'database_unavailable'
                    : codes.some((value) => /^P\d{4}$/.test(value))
                      ? 'prisma'
                      : 'unknown';

    return { 'failure.kind': kind, 'error.code': code, 'cause.code': causeCode };
}

// #endregion
