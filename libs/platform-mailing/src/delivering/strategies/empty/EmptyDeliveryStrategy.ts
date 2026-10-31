// #region Imports

import { Injectable, Logger } from '@nestjs/common';
import { IMailAttachment } from '../../../models/IMailAttachment.js';
import { DeliveryStrategyBase } from '../abstracts/DeliveryStrategyBase.js';

// #endregion

/**
 * The `EmptyDeliveryStrategy` class.
 *
 * @public
 */
@Injectable()
export class EmptyDeliveryStrategy extends DeliveryStrategyBase {
    // #region Fields

    private readonly _logger: Logger = new Logger(EmptyDeliveryStrategy.name);

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `EmptyDeliveryStrategy` class.
     *
     * @public
     */
    public constructor() {
        super();
    }

    // #endregion

    // #region Methods

    public send(from: string, to: string, subject: string, content: string, isHtml: boolean, _attachments?: Array<IMailAttachment>): Promise<void> {
        this._logger.log(
            `${JSON.stringify({
                from: from,
                to: to,
                subject: subject,
                content: content,
                isHtml: isHtml,
            })}`,
        );

        return Promise.resolve();
    }

    // #endregion
}
