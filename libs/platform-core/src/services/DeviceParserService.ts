// #region Imports

import { Injectable } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';

// #endregion

/**
 * Interface for parsed device information
 *
 * @public
 */
export interface IDeviceInfo {
    userAgent: string;
    deviceType: string;
    deviceName: string;
    browserName: string;
    browserVersion: string | null;
    osName: string;
    osVersion: string | null;
}

/**
 * The `DeviceParserService` class.
 *
 * Service responsible for parsing User-Agent strings and extracting device information.
 *
 * @public
 */
@Injectable()
export class DeviceParserService {
    // #region Fields

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `DeviceParserService` class.
     *
     * @public
     */
    public constructor() {
        // No dependencies
    }

    // #endregion

    // #region Methods

    /**
     * Parse User-Agent string and extract device information
     *
     * @public
     * @param userAgent - The User-Agent header string
     * @returns Parsed device information
     */
    public parse(userAgent: string): IDeviceInfo {
        const parser = new UAParser(userAgent);
        const result = parser.getResult();

        const deviceType = this.getDeviceType(result);
        const deviceName = this.buildDeviceName(result, deviceType);
        const browserName = result.browser.name || 'Unknown Browser';
        const browserVersion = result.browser.version || null;
        const osName = result.os.name || 'Unknown OS';
        const osVersion = result.os.version || null;

        return {
            userAgent,
            deviceType,
            deviceName,
            browserName,
            browserVersion,
            osName,
            osVersion,
        };
    }

    /**
     * Determine device type from parsed UA result
     *
     * @private
     * @param result - Parsed UA result
     * @returns Device type string (desktop, mobile, tablet, or unknown)
     */
    private getDeviceType(result: UAParser.IResult): string {
        if (result.device.type === 'mobile') {
            return 'mobile';
        }

        if (result.device.type === 'tablet') {
            return 'tablet';
        }

        if (result.device.type === 'console' || result.device.type === 'smarttv') {
            return result.device.type;
        }

        // Default to desktop if no specific device type is detected
        return 'desktop';
    }

    /**
     * Build a human-readable device name
     *
     * @private
     * @param result - Parsed UA result
     * @param deviceType - The device type
     * @returns Human-readable device name
     */
    private buildDeviceName(result: UAParser.IResult, deviceType: string): string {
        const parts: Array<string> = [];

        // Add OS name
        if (result.os.name) {
            parts.push(result.os.name);
        }

        // Add browser name
        if (result.browser.name) {
            parts.push(result.browser.name);
        }

        // Add device vendor/model if available (for mobile devices)
        if (deviceType === 'mobile' || deviceType === 'tablet') {
            if (result.device.vendor) {
                parts.push(result.device.vendor);
            }
            if (result.device.model) {
                parts.push(result.device.model);
            }
        }

        // Fallback to device type if no specific info available
        if (parts.length === 0) {
            return deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
        }

        return parts.join(' · ');
    }

    // #endregion
}
