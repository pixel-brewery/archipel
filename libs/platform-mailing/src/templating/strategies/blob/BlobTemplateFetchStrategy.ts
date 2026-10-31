// #region Imports

import { BlobDownloadResponseTypes, BlobService } from '@pixel-brewery/archipel-platform-blob-storage';
import { Injectable, Logger } from '@nestjs/common';
import { basename, extname } from 'node:path';
import type { IMailTemplateVariants } from '../../../models/IMailTemplateVariants.js';
import { TemplateFetchStrategyBase } from '../abstracts/TemplateFetchStrategyBase.js';

// #endregion

/**
 * The `BlobTemplateFetchStrategy` class.
 *
 * @public
 */
@Injectable()
export class BlobTemplateFetchStrategy extends TemplateFetchStrategyBase {
    // #region Fields

    private readonly _blobService: BlobService;
    private readonly _logger: Logger = new Logger(BlobTemplateFetchStrategy.name);

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `BlobTemplateFetchStrategy` class.
     *
     * @public
     */
    public constructor(blobService: BlobService) {
        super();

        this._blobService = blobService;
    }

    // #endregion

    // #region Methods

    public async load(): Promise<Record<string, IMailTemplateVariants>> {
        const templates: Record<string, IMailTemplateVariants> = {};
        const fileList = (await this._blobService.downloadFile<Array<string>>('templates/templates.json', BlobDownloadResponseTypes.Json)).data;

        for (const file of fileList) {
            const extension = extname(file).replace('.', '').toLowerCase();
            const templateName = basename(file, extname(file));

            const templateContentResponse = await this._blobService.downloadFile<string>(file, BlobDownloadResponseTypes.Text);
            const templateContent = templateContentResponse.data;

            if (!templates[templateName]) {
                templates[templateName] = {} as IMailTemplateVariants;
            }

            if (extension === 'html') {
                templates[templateName].html = templateContent;
            } else if (extension === 'txt') {
                templates[templateName].txt = templateContent;
            } else {
                this._logger.warn(`Unknown template extension '${extension}' for '${file}'`);
            }
        }

        this._logger.log('Templates loaded from blob storage');
        return templates;
    }

    // #endregion
}
