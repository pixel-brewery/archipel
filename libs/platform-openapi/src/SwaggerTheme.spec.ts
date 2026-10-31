import type { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SwaggerTheme } from './SwaggerTheme.js';

describe('SwaggerTheme', () => {
    // #region Fields

    let theme: SwaggerTheme;
    let resourceManagerMock: Partial<ResourceManager>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        resourceManagerMock = {
            loadAsString: vi.fn(),
        };

        theme = new SwaggerTheme(resourceManagerMock as ResourceManager);
    });

    it('should return custom CSS and JS from resource files', () => {
        // arrange
        (resourceManagerMock.loadAsString as ReturnType<typeof vi.fn>).mockImplementation((name: string) => {
            if (name === 'swagger.css') return 'body { color: red; }';
            if (name === 'swagger.js') return 'console.log("loaded");';
            return undefined;
        });

        // act
        const options = theme.getOptions();

        // assert
        expect(options.customCss).toBe('body { color: red; }');
        expect(options.customJsStr).toBe('console.log("loaded");');
    });

    it('should throw when swagger.css is not found', () => {
        // arrange
        (resourceManagerMock.loadAsString as ReturnType<typeof vi.fn>).mockReturnValue(undefined);

        // act & assert
        expect(() => theme.getOptions()).toThrow('Theme file swagger.css not found');
    });

    it('should throw when swagger.js is not found', () => {
        // arrange
        (resourceManagerMock.loadAsString as ReturnType<typeof vi.fn>).mockImplementation((name: string) => {
            if (name === 'swagger.css') return 'body {}';
            return undefined;
        });

        // act & assert
        expect(() => theme.getOptions()).toThrow('Theme file swagger.js not found');
    });

    // #endregion
});
