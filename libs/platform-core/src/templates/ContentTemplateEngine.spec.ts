// #region Imports

import { describe, it, expect, beforeEach } from 'vitest';
import { ContentTemplateEngine } from './ContentTemplateEngine.js';

// #endregion

describe('ContentTemplateEngine', () => {
    // #region Fields

    let service: ContentTemplateEngine;

    // #endregion

    // #region Setup

    beforeEach(() => {
        service = new ContentTemplateEngine();
    });

    // #endregion

    // #region compileTemplate() Tests

    describe('compileTemplate()', () => {
        it('should compile simple variable template', () => {
            // Arrange
            const template = 'Hello, {{name}}!';
            const params = { name: 'John' };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Hello, John!');
        });

        it('should compile template with multiple variables', () => {
            // Arrange
            const template = 'Hello, {{firstName}} {{lastName}}! You are {{age}} years old.';
            const params = {
                firstName: 'John',
                lastName: 'Doe',
                age: 30,
            };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Hello, John Doe! You are 30 years old.');
        });

        it('should handle empty template', () => {
            // Arrange
            const template = '';
            const params = {};

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('');
        });

        it('should handle template with no variables', () => {
            // Arrange
            const template = 'This is a static template';
            const params = {};

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('This is a static template');
        });

        it('should throw error for unfilled variables', () => {
            // Arrange
            const template = 'Hello, {{name}}!';
            const params = {};

            // Act & Assert
            expect(() => service.compileTemplate(template, params)).toThrow('Missing placeholders: {{name}}');
        });
    });

    // #endregion

    // #region Simple Variables Tests

    describe('Simple Variables', () => {
        it('should replace string variables', () => {
            // Arrange
            const template = 'Hello, {{name}}!';
            const params = { name: 'World' };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Hello, World!');
        });

        it('should replace number variables', () => {
            // Arrange
            const template = 'Count: {{count}}';
            const params = { count: 42 };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Count: 42');
        });

        it('should replace boolean variables', () => {
            // Arrange
            const template = 'Active: {{isActive}}';
            const params = { isActive: true };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Active: true');
        });

        it('should handle null variables as empty string', () => {
            // Arrange
            const template = 'Value: {{value}}end';
            const params = { value: null };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Value: end');
        });

        it('should handle undefined variables as empty string', () => {
            // Arrange
            const template = 'Value: {{value}}end';
            const params = { value: undefined };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Value: end');
        });

        it('should handle nested property access', () => {
            // Arrange
            const template = 'User: {{user.name}} ({{user.email}})';
            const params = {
                user: {
                    name: 'John Doe',
                    email: 'john@example.com',
                },
            };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('User: John Doe (john@example.com)');
        });

        it('should handle deep nested property access', () => {
            // Arrange
            const template = 'Address: {{user.address.street}}, {{user.address.city}}';
            const params = {
                user: {
                    address: {
                        street: '123 Main St',
                        city: 'New York',
                    },
                },
            };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Address: 123 Main St, New York');
        });

        it('should handle missing nested properties gracefully', () => {
            // Arrange
            const template = 'Phone: {{user.phone}}end';
            const params = { user: { name: 'John' } };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Phone: end');
        });
    });

    // #endregion

    // #region {{#each}} Loop Tests

    describe('{{#each}} Loops', () => {
        it('should process simple each loop', () => {
            // Arrange
            const template = '{{#each items}}<li>{{name}}</li>{{/each}}';
            const params = {
                items: [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }],
            };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('<li>Item 1</li><li>Item 2</li><li>Item 3</li>');
        });

        it('should provide loop context variables (@index, @first, @last, @length)', () => {
            // Arrange
            const template = '{{#each items}}{{@index}}: {{name}} ({{@first}}/{{@last}}) [{{@length}}]{{/each}}';
            const params = {
                items: [{ name: 'A' }, { name: 'B' }],
            };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('0: A (true/false) [2]1: B (false/true) [2]');
        });

        it('should handle empty array', () => {
            // Arrange
            const template = 'Items: {{#each items}}<item>{{name}}</item>{{/each}}end';
            const params = { items: [] };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Items: end');
        });

        it('should handle non-array variable gracefully', () => {
            // Arrange
            const template = '{{#each items}}<item>{{name}}</item>{{/each}}';
            const params = { items: 'not an array' };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('');
        });

        it('should handle missing array variable', () => {
            // Arrange
            const template = '{{#each items}}<item>{{name}}</item>{{/each}}';
            const params = {};

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('');
        });

        it('should access parent context within loop', () => {
            // Arrange
            const template = '{{#each items}}{{title}}: {{name}}{{/each}}';
            const params = {
                title: 'Product',
                items: [{ name: 'Apple' }, { name: 'Banana' }],
            };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Product: AppleProduct: Banana');
        });

        it('should handle if inside each loop', () => {
            // Arrange
            const template = '{{#each items}}{{name}}: {{#if active}}Yes{{else}}No{{/if}} {{/each}}';
            const params = {
                items: [
                    {
                        name: 'A',
                        active: true,
                    },
                    {
                        name: 'B',
                        active: false,
                    },
                ],
            };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('A: Yes B: No ');
        });

        it('should handle nested loops', () => {
            // Arrange
            const template = '{{#each categories}}{{name}}: {{#each items}}{{name}} {{/each}}{{/each}}';
            const params = {
                categories: [
                    {
                        name: 'Fruits',
                        items: [{ name: 'Apple' }, { name: 'Banana' }],
                    },
                    {
                        name: 'Vegetables',
                        items: [{ name: 'Carrot' }],
                    },
                ],
            };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Fruits: Apple Banana Vegetables: Carrot ');
        });
    });

    // #endregion

    // #region {{#if}} Conditional Tests

    describe('{{#if}} Conditionals', () => {
        it('should show content when condition is true', () => {
            // Arrange
            const template = '{{#if showMessage}}Hello World{{/if}}';
            const params = { showMessage: true };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Hello World');
        });

        it('should hide content when condition is false', () => {
            // Arrange
            const template = '{{#if showMessage}}Hello World{{/if}}';
            const params = { showMessage: false };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('');
        });

        it('should handle if/else blocks', () => {
            // Arrange
            const template = '{{#if isLoggedIn}}Welcome back!{{else}}Please log in{{/if}}';

            // Act
            const resultLoggedIn = service.compileTemplate(template, { isLoggedIn: true });
            const resultNotLoggedIn = service.compileTemplate(template, { isLoggedIn: false });

            // Assert
            expect(resultLoggedIn).toBe('Welcome back!');
            expect(resultNotLoggedIn).toBe('Please log in');
        });

        it('should treat truthy values as true', () => {
            // Arrange
            const template = '{{#if value}}Truthy{{/if}}';

            // Act & Assert
            expect(service.compileTemplate(template, { value: 'non-empty string' })).toBe('Truthy');
            expect(service.compileTemplate(template, { value: 42 })).toBe('Truthy');
            expect(service.compileTemplate(template, { value: [1, 2, 3] })).toBe('Truthy');
            expect(service.compileTemplate(template, { value: { key: 'value' } })).toBe('Truthy');
        });

        it('should treat falsy values as false', () => {
            // Arrange
            const template = '{{#if value}}Truthy{{else}}Falsy{{/if}}';

            // Act & Assert
            expect(service.compileTemplate(template, { value: false })).toBe('Falsy');
            expect(service.compileTemplate(template, { value: 0 })).toBe('Falsy');
            expect(service.compileTemplate(template, { value: '' })).toBe('Falsy');
            expect(service.compileTemplate(template, { value: null })).toBe('Falsy');
            expect(service.compileTemplate(template, { value: undefined })).toBe('Falsy');
            expect(service.compileTemplate(template, { value: [] })).toBe('Falsy');
            expect(service.compileTemplate(template, { value: {} })).toBe('Falsy');
        });

        it('should handle nested if statements', () => {
            // Arrange
            const template = '{{#if outer}}Outer {{#if inner}}Inner{{/if}} End{{/if}}';

            // Act & Assert
            expect(
                service.compileTemplate(template, {
                    outer: true,
                    inner: true,
                }),
            ).toBe('Outer Inner End');
            expect(
                service.compileTemplate(template, {
                    outer: true,
                    inner: false,
                }),
            ).toBe('Outer  End');
            expect(
                service.compileTemplate(template, {
                    outer: false,
                    inner: true,
                }),
            ).toBe('');
        });
    });

    // #endregion

    // #region {{#unless}} Conditional Tests

    describe('{{#unless}} Conditionals', () => {
        it('should show content when condition is false', () => {
            // Arrange
            const template = '{{#unless hideMessage}}Hello World{{/unless}}';
            const params = { hideMessage: false };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Hello World');
        });

        it('should hide content when condition is true', () => {
            // Arrange
            const template = '{{#unless hideMessage}}Hello World{{/unless}}';
            const params = { hideMessage: true };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('');
        });

        it('should handle unless/else blocks', () => {
            // Arrange
            const template = '{{#unless isError}}Success{{else}}Error occurred{{/unless}}';

            // Act
            const resultNoError = service.compileTemplate(template, { isError: false });
            const resultWithError = service.compileTemplate(template, { isError: true });

            // Assert
            expect(resultNoError).toBe('Success');
            expect(resultWithError).toBe('Error occurred');
        });

        it('should be opposite of if condition', () => {
            // Arrange
            const ifTemplate = '{{#if condition}}Show{{else}}Hide{{/if}}';
            const unlessTemplate = '{{#unless condition}}Show{{else}}Hide{{/unless}}';

            // Act
            const ifTrue = service.compileTemplate(ifTemplate, { condition: true });
            const unlessTrue = service.compileTemplate(unlessTemplate, { condition: true });
            const ifFalse = service.compileTemplate(ifTemplate, { condition: false });
            const unlessFalse = service.compileTemplate(unlessTemplate, { condition: false });

            // Assert - Should be opposites
            expect(ifTrue).toBe('Show');
            expect(unlessTrue).toBe('Hide');
            expect(ifFalse).toBe('Hide');
            expect(unlessFalse).toBe('Show');
        });
    });

    // #endregion

    // #region {{#with}} Context Tests

    describe('{{#with}} Context Switching', () => {
        it('should switch context to object', () => {
            // Arrange
            const template = '{{#with user}}Name: {{name}}, Email: {{email}}{{/with}}';
            const params = {
                user: {
                    name: 'John Doe',
                    email: 'john@example.com',
                },
            };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Name: John Doe, Email: john@example.com');
        });

        it('should handle missing context object', () => {
            // Arrange
            const template = '{{#with user}}Name: {{name}}{{/with}}';
            const params = {};

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('');
        });

        it('should handle non-object context', () => {
            // Arrange
            const template = '{{#with user}}Name: {{name}}{{/with}}';
            const params = { user: 'not an object' };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('');
        });

        it('should maintain access to parent context', () => {
            // Arrange
            const template = '{{#with user}}{{title}}: {{name}}{{/with}}';
            const params = {
                title: 'User',
                user: { name: 'John Doe' },
            };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('User: John Doe');
        });

        it('should handle if inside with block', () => {
            // Arrange
            const template = '{{#with contact}}{{#if email}}Email: {{email}}{{/if}}{{/with}}';
            const params = {
                contact: {
                    email: 'test@example.com',
                },
            };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Email: test@example.com');
        });

        it('should handle nested with blocks', () => {
            // Arrange
            const template = '{{#with company}}{{name}} - {{#with address}}{{street}}, {{city}}{{/with}}{{/with}}';
            const params = {
                company: {
                    name: 'ACME Corp',
                    address: {
                        street: '123 Main St',
                        city: 'New York',
                    },
                },
            };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('ACME Corp - 123 Main St, New York');
        });
    });

    // #endregion

    // #region Complex Integration Tests

    describe('Complex Integration Tests', () => {
        it('should handle combination of all template features', () => {
            // Arrange
            const template = `
{{#if hasUsers}}
Users:
{{#each users}}
  {{@index}}. {{#with profile}}{{firstName}} {{lastName}}{{/with}}
  {{#if isActive}}(Active){{else}}(Inactive){{/if}}
  {{#unless isVerified}}[Unverified]{{/unless}}
{{/each}}
{{else}}
No users found
{{/if}}
            `.trim();

            const params = {
                hasUsers: true,
                users: [
                    {
                        profile: {
                            firstName: 'John',
                            lastName: 'Doe',
                        },
                        isActive: true,
                        isVerified: true,
                    },
                    {
                        profile: {
                            firstName: 'Jane',
                            lastName: 'Smith',
                        },
                        isActive: false,
                        isVerified: false,
                    },
                ],
            };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toContain('Users:');
            expect(result).toContain('0. John Doe');
            expect(result).toContain('(Active)');
            expect(result).toContain('1. Jane Smith');
            expect(result).toContain('(Inactive)');
            expect(result).toContain('[Unverified]');
        });

        it('should handle HTML template with dynamic content', () => {
            // Arrange
            const template = `
<div class="user-card">
  <h2>{{user.name}}</h2>
  {{#if user.avatar}}
    <img src="{{user.avatar}}" alt="Avatar">
  {{else}}
    <div class="no-avatar">No Image</div>
  {{/if}}

  {{#with user.contact}}
    <ul>
      {{#if email}}<li>Email: {{email}}</li>{{/if}}
      {{#if phone}}<li>Phone: {{phone}}</li>{{/if}}
    </ul>
  {{/with}}

  {{#unless user.isPublic}}
    <p class="private">Private Profile</p>
  {{/unless}}

  {{#each user.tags}}
    <span class="tag">{{this}}</span>
  {{/each}}
</div>
            `.trim();

            const params = {
                user: {
                    name: 'John Doe',
                    avatar: null,
                    contact: {
                        email: 'john@example.com',
                        phone: null,
                    },
                    isPublic: false,
                    tags: ['developer', 'javascript', 'node.js'],
                },
            };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toContain('<h2>John Doe</h2>');
            expect(result).toContain('<div class="no-avatar">No Image</div>');
            expect(result).toContain('<li>Email: john@example.com</li>');
            expect(result).not.toContain('Phone:');
            expect(result).toContain('<p class="private">Private Profile</p>');
            expect(result).toContain('<span class="tag">developer</span>');
        });
    });

    // #endregion

    // #region Validation Tests

    describe('Template Validation', () => {
        it('should throw error for unmatched each blocks', () => {
            // Arrange
            const template = '{{#each items}}<li>{{name}}</li>'; // Missing {{/each}}
            const params = { items: [] };

            // Act & Assert
            expect(() => service.compileTemplate(template, params)).toThrow('Unmatched {{#each}} blocks');
        });

        it('should throw error for unmatched if blocks', () => {
            // Arrange
            const template = '{{#if condition}}Show content'; // Missing {{/if}}
            const params = { condition: true };

            // Act & Assert
            expect(() => service.compileTemplate(template, params)).toThrow('Unmatched {{#if}} blocks');
        });

        it('should throw error for unmatched unless blocks', () => {
            // Arrange
            const template = '{{#unless condition}}Show content'; // Missing {{/unless}}
            const params = { condition: false };

            // Act & Assert
            expect(() => service.compileTemplate(template, params)).toThrow('Unmatched {{#unless}} blocks');
        });

        it('should throw error for unmatched with blocks', () => {
            // Arrange
            const template = '{{#with user}}{{name}}'; // Missing {{/with}}
            const params = { user: { name: 'John' } };

            // Act & Assert
            expect(() => service.compileTemplate(template, params)).toThrow('Unmatched {{#with}} blocks');
        });

        it('should throw error for missing simple variables', () => {
            // Arrange
            const template = 'Hello {{name}} and {{age}}!';
            const params = { name: 'John' }; // Missing 'age'

            // Act & Assert
            expect(() => service.compileTemplate(template, params)).toThrow('Missing placeholders');
        });

        it('should not throw error for special @ variables', () => {
            // Arrange
            const template = '{{#each items}}{{@index}}: {{name}}{{/each}}';
            const params = { items: [{ name: 'Test' }] };

            // Act & Assert
            expect(() => service.compileTemplate(template, params)).not.toThrow();
        });

        it('should validate nested template structures', () => {
            // Arrange
            const template = '{{#if outer}}{{#each items}}{{#with item}}{{name}}{{/with}}{{/each}}{{/if}}';
            const params = {
                outer: true,
                items: [{ item: { name: 'Test' } }],
            };

            // Act & Assert
            expect(() => service.compileTemplate(template, params)).not.toThrow();
        });
    });

    // #endregion

    // #region Edge Cases

    describe('Edge Cases', () => {
        it('should handle whitespace in template syntax', () => {
            // Arrange
            const template = '{{ #if  condition }}Content{{  /if  }}';
            const params = { condition: true };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Content');
        });

        it('should handle multiline templates', () => {
            // Arrange
            const template = `{{#each items}}
<div>
  {{name}}
</div>
{{/each}}`;
            const params = { items: [{ name: 'Test' }] };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toContain('<div>');
            expect(result).toContain('Test');
            expect(result).toContain('</div>');
        });

        it('should handle special characters in content', () => {
            // Arrange
            const template = 'Special: {{content}}';
            const params = { content: '<>&"\'äöüß🚀' };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('Special: <>&"\'äöüß🚀');
        });

        it('should handle very large templates efficiently', () => {
            // Arrange
            const items = Array.from({ length: 1000 }, (_, i) => ({ name: `Item ${i}` }));
            const template = '{{#each items}}<li>{{name}}</li>{{/each}}';
            const params = { items };

            // Act
            const start = Date.now();
            const result = service.compileTemplate(template, params);
            const end = Date.now();

            // Assert
            expect(result).toContain('<li>Item 0</li>');
            expect(result).toContain('<li>Item 999</li>');
            expect(end - start).toBeLessThan(1000); // Should complete within 1 second
        });

        it('should handle empty object contexts', () => {
            // Arrange
            const template = '{{#with emptyObj}}{{someProperty}}{{/with}}';
            const params = { emptyObj: {} };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('');
        });

        it('should handle array of primitives in each loops', () => {
            // Arrange
            const template = '{{#each numbers}}{{this}}{{/each}}';
            const params = { numbers: [1, 2, 3] };

            // Act
            const result = service.compileTemplate(template, params);

            // Assert
            expect(result).toBe('123');
        });
    });

    // #endregion

    // #region Constructor Tests

    describe('Constructor', () => {
        it('should create instance without parameters', () => {
            // Act
            const newService = new ContentTemplateEngine();

            // Assert
            expect(newService).toBeDefined();
            expect(newService).toBeInstanceOf(ContentTemplateEngine);
        });

        it('should create multiple independent instances', () => {
            // Act
            const service1 = new ContentTemplateEngine();
            const service2 = new ContentTemplateEngine();

            // Assert
            expect(service1).toBeDefined();
            expect(service2).toBeDefined();
            expect(service1).not.toBe(service2);

            // Both should work independently
            const template = 'Hello {{name}}!';
            const params = { name: 'World' };

            const result1 = service1.compileTemplate(template, params);
            const result2 = service2.compileTemplate(template, params);

            expect(result1).toBe('Hello World!');
            expect(result2).toBe('Hello World!');
        });
    });

    // #endregion
});
