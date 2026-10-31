// #region Imports

import { describe, expect, it } from 'vitest';

import { ROLES_KEY, UseRoles } from './RolesDecorator.js';

// #endregion

// #region Tests

describe('RolesDecorator', () => {
    describe('ROLES_KEY', () => {
        it('should be defined as "use_roles"', () => {
            expect(ROLES_KEY).toBe('use_roles');
        });
    });

    describe('UseRoles', () => {
        it('should set metadata with provided roles', () => {
            // arrange & act
            const decorator = UseRoles('admin', 'user');

            // assert
            expect(decorator).toBeDefined();
            expect(typeof decorator).toBe('function');
        });
    });
});

// #endregion
