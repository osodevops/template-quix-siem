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
 * Represents stream location tree object.
 */
export interface StreamLocation { 
    /**
     * Name of the location.
     */
    name?: string;
    /**
     * Full tree path including Quix.TelemetryQuery.Contract.StreamLocation.Name.
     */
    fullPath?: string;
    /**
     * Child locations.
     */
    children?: { [key: string]: StreamLocation; };
}