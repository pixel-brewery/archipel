// #region Imports

import { Observable } from 'rxjs';
import { ISseEventData } from './ISseEventData.js';

// #endregion

/**
 * Represents a server-sent event service.
 *
 * @public
 */
export interface ISseHub {
    // #region Methods

    emitEvent(id: string, data: ISseEventData): void;

    clearEvent(id: string): void;

    isEventActive(id: string): boolean;

    getObservable(id: string): Observable<ISseEventData>;

    // #endregion
}
