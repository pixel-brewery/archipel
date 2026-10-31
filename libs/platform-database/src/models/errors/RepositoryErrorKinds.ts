/**
 * Classifies why a repository operation failed, independent of the database driver.
 *
 * @public
 */
export const RepositoryErrorKinds = {
    /** A write violated a unique constraint (Prisma `P2002`). */
    UniqueConstraintViolation: 'unique-constraint-violation',
    /**
     * An operation required a record that does not exist or no longer matches
     * its filter (Prisma `P2025`), for example a revision-bound update of a
     * record that changed after it was read.
     */
    RecordNotFound: 'record-not-found',
    /** Any other failure reported by the database client. */
    Unclassified: 'unclassified',
} as const;
