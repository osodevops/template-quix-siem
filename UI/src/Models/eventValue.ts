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
 * Value details of an event at a given timestamp
 */
export interface EventValue { 
    /**
     * Time in nanoseconds since UNIX epoch (01/01/1970)
     */
    timestamp?: number;
    /**
     * Value of the event at this timestamp
     */
    value?: string;
    /**
     * Tags of the event at this timestamp
     */
    tagValues?: { [key: string]: string; };
}