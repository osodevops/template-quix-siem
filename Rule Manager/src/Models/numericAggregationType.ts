/**
 * Telemetry Query API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

/**
 * Aggregation type for data aggregation and down-sampling.
 */
export type NumericAggregationType = 'None' | 'Mean' | 'Max' | 'Min' | 'First' | 'Last' | 'Sum' | 'Count' | 'Median' | 'Spread';

export const NumericAggregationType = {
    None: 'None' as NumericAggregationType,
    Mean: 'Mean' as NumericAggregationType,
    Max: 'Max' as NumericAggregationType,
    Min: 'Min' as NumericAggregationType,
    First: 'First' as NumericAggregationType,
    Last: 'Last' as NumericAggregationType,
    Sum: 'Sum' as NumericAggregationType,
    Count: 'Count' as NumericAggregationType,
    Median: 'Median' as NumericAggregationType,
    Spread: 'Spread' as NumericAggregationType
};