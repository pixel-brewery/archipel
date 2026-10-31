/**
 * Lint-Staged Configuration
 *
 * @description
 * Runs linters and formatters on staged files before commit.
 * Ensures code quality without running checks on the entire codebase.
 *
 * @see https://github.com/lint-staged/lint-staged
 */

/**
 * @type {import('lint-staged').Configuration}
 */
export default {
    '!(.docs)/**/*.{ts,tsx,js,jsx}': (filenames) => {
        return [`eslint ${filenames.join(' ')} --fix`, `prettier --write ${filenames.join(' ')}`];
    },
    '!(.docs)/**/*.{json,yml,yaml}': (filenames) => {
        return `prettier --write ${filenames.join(' ')}`;
    },
    '!(.docs)/**/*.md': (filenames) => {
        return `prettier --write ${filenames.join(' ')}`;
    },
    // '**/schema.prisma': () => {
    //     return [
    //         'yarn nx run api:db:format',
    //         'yarn nx run api:db:validate',
    //     ];
    // },
};
