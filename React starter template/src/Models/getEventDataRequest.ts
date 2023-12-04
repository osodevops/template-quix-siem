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
import { EventDataAggregation } from './eventDataAggregation';
import { TagFilter } from './tagFilter';

/**
 * Defines configuration of a data request for events.
 */
export interface GetEventDataRequest { 
    /**
     * The ids of the events to query
     */
    eventIds?: Array<string>;
    aggregation?: EventDataAggregation;
    /**
     * Collection of tags to group by.
     */
    groupBy?: Array<string>;
    /**
     * Set to filter data by time.
     */
    from?: number;
    /**
     * Set to filter data by time.
     */
    to?: number;
    /**
     * Set to filter data by stream ID.
     */
    streamIds?: Array<string>;
    /**
     * The tag filters to apply
     */
    tagFilters?: Array<TagFilter>;
}