// #region Imports

// #endregion

/**
 * Enumerates the supported field data types for reporting datasets.
 *
 * @public
 */
export const ReportingFieldTypes = {
    Boolean: 'boolean',
    DateTime: 'datetime',
    Json: 'json',
    Number: 'number',
    String: 'string',
} as const;

export type ReportingFieldType = (typeof ReportingFieldTypes)[keyof typeof ReportingFieldTypes];

/**
 * Describes a single field inside a reporting dataset.
 *
 * @public
 */
export interface IReportingDatasetField {
    /**
     * Unique identifier of the field within the dataset.
     */
    readonly fieldId: string;

    /**
     * Human readable name of the field.
     */
    readonly label: string;

    /**
     * Field type exposed to consumers.
     */
    readonly type: ReportingFieldType;

    /**
     * Indicates whether the field can contain null values.
     */
    readonly isNullable: boolean;

    /**
     * Optional documentation describing the semantic meaning of the field.
     */
    readonly description?: string;
}

// #endregion
