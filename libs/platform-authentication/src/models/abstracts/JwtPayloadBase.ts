/**
 * Abstract base class for JWT payloads.
 * Products extend this to add their own claims (e.g. `profileId`, `isPro`).
 * Used as both a serialization contract and NestJS injection token.
 *
 * @public
 */
export abstract class JwtPayloadBase {
    // #region Fields

    /**
     * Subject identifier.
     */
    public readonly id: string;

    /**
     * Email address.
     */
    public readonly email: string | null;

    /**
     * Assigned roles.
     */
    public readonly roles: ReadonlyArray<string>;

    /**
     * Issued-at timestamp (set by JWT library).
     */
    public readonly iat?: number;

    /**
     * Expiration timestamp (set by JWT library).
     */
    public readonly exp?: number;

    // #endregion

    // #region Ctor

    protected constructor(id: string, email: string | null, roles: ReadonlyArray<string>) {
        this.id = id;
        this.email = email;
        this.roles = roles;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Creates an instance from a decoded JWT payload object.
     * Subclasses **must** override this static-like factory on a per-product basis.
     *
     * @public
     * @param raw - The raw decoded JWT payload.
     */
    public static fromJSON(raw: Record<string, unknown>): JwtPayloadBase {
        return new DefaultJwtPayload(raw['id'] as string, (raw['email'] as string) ?? null, (raw['roles'] as string[]) ?? []);
    }

    /**
     * Serializes this payload to a plain object suitable for `JwtService.signAsync()`.
     *
     * @public
     */
    public toJSON(): Record<string, unknown> {
        return {
            id: this.id,
            email: this.email,
            roles: [...this.roles],
        };
    }

    // #endregion
}

/**
 * Default (minimal) JWT payload used when no product-specific subclass is registered.
 *
 * @internal
 */
class DefaultJwtPayload extends JwtPayloadBase {
    public constructor(id: string, email: string | null, roles: ReadonlyArray<string>) {
        super(id, email, roles);
    }
}
