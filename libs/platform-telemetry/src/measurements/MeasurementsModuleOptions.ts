import type { ModuleMetadata, Provider, Type } from '@nestjs/common';
import type { MeasurementSinkBase } from './abstracts/MeasurementSinkBase.js';
import type { IDiagnosticsOptions } from './DiagnosticsOptions.js';

/** Configuration for one direct numeric measurement sink. */
export interface IMeasurementsModuleOptions {
    sink: Type<MeasurementSinkBase>;
    isGlobal?: boolean;
    httpInterceptor?: boolean;
    /** Express/Node response lifecycle measurement. Use manual to install the exported middleware before host middleware. */
    httpLifecycle?: boolean | 'manual';
    /** Optional sink dependencies, including provider-specific configuration tokens. */
    providers?: Provider[];
    imports?: ModuleMetadata['imports'];
    /** Enables sanitized operational failure reporting, including HTTP server errors. */
    diagnostics?: IDiagnosticsOptions;
}
