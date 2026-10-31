// #region Imports

import { IMappingBuilder, MappingProfileBase, createMappingKey } from '@pixel-brewery/archipel-platform-mapping';
import { Injectable } from '@nestjs/common';
import type { ISessionRecord } from '../contracts/ISessionRecord.js';
import { SessionResponse } from '../models/responses/SessionResponse.js';

// #endregion

interface ISessionMappingInput {
    session: ISessionRecord;
    isCurrent: boolean;
}

/**
 * Type-safe mapping key for Session entity to response transformation.
 *
 * @public
 */
export const SESSION_MAPPING_KEY = createMappingKey<ISessionMappingInput, SessionResponse>('session.entity-to-response');

/**
 * Type-safe mapping key for Session entity list to response list transformation.
 *
 * @public
 */
export const SESSION_LIST_MAPPING_KEY = createMappingKey<Array<ISessionMappingInput>, Array<SessionResponse>>('session.entity-list-to-response');

/**
 * Mapping profile for Session entity to response transformations.
 *
 * @public
 */
@Injectable()
export class SessionMappingProfile extends MappingProfileBase {
    // #region Methods

    /**
     * Configure mappings for Session entity.
     *
     * @public
     * @param builder - The mapping builder
     */
    public configure(builder: IMappingBuilder): void {
        builder
            .createKeyedMap(SESSION_MAPPING_KEY, (entity) => this.mapEntityToResponse(entity))
            .createKeyedMap(SESSION_LIST_MAPPING_KEY, (entities) => entities.map((e) => this.mapEntityToResponse(e)));
    }

    /**
     * Map a single Session entity to response.
     *
     * @private
     * @param entity - The entity to map
     * @returns The mapped response
     */
    private mapEntityToResponse(input: ISessionMappingInput): SessionResponse {
        const response = new SessionResponse();
        response.id = input.session.id;
        response.deviceType = input.session.deviceType ?? null;
        response.deviceName = input.session.deviceName ?? null;
        response.browserName = input.session.browserName ?? null;
        response.browserVersion = input.session.browserVersion ?? null;
        response.osName = input.session.osName ?? null;
        response.osVersion = input.session.osVersion ?? null;
        response.location = input.session.location ?? null;
        response.ipAddress = input.session.ipAddress;
        response.lastActive = input.session.lastActive;
        response.createdAt = input.session.createdAt;
        response.isCurrent = input.isCurrent;
        response.clientName = input.session.clientName ?? null;
        return response;
    }

    // #endregion
}
