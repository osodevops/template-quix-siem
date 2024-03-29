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
import { StreamStatus } from './streamStatus';

/**
 * Describes filters for stream deletion
 */
export interface PatchStreamRequest { 
    /**
     * The new display name of the stream. Optional
     */
    name?: string;
    status?: StreamStatus;
    /**
     * The new location of the stream. Optional
     */
    location?: string;
    /**
     * New Metadata (extra context) for the stream. Optional
     */
    metadata?: { [key: string]: string; };
}