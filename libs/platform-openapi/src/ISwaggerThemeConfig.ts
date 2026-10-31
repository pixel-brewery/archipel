// #region Imports

// #endregion

/**
 * Configuration interface for Swagger theme styling.
 * Allows customization of primary and secondary branding colors.
 *
 * @public
 */
export interface ISwaggerThemeConfig {
    /**
     * Primary branding color (hex format, e.g., '#e6492a')
     */
    readonly primary: string;

    /**
     * Secondary branding color (hex format, e.g., '#c7206a')
     */
    readonly secondary: string;

    /**
     * Optional custom logo URL
     */
    readonly logoUrl?: string;

    /**
     * Optional custom favicon URL
     */
    readonly faviconUrl?: string;
}
