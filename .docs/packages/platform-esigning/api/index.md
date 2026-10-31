---
title: '@pixel-brewery/archipel-platform-esigning'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-esigning

## Classes

| Class                                                            | Description                                                                                                                                                                                                                            |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AdobeSignEsigningProvider](Class.AdobeSignEsigningProvider)     | Adobe Acrobat Sign e-signing provider. Integrates with the Adobe Sign REST API v6 to manage agreements, signing sessions, and webhook verification.                                                                                    |
| [DocuSignEsigningProvider](Class.DocuSignEsigningProvider)       | DocuSign eSignature provider. Integrates with the DocuSign eSignature REST API v2.1 via the official `docusign-esign` Node.js SDK.                                                                                                     |
| [DropboxSignEsigningProvider](Class.DropboxSignEsigningProvider) | Dropbox Sign (HelloSign) e-signing provider. Integrates with the Dropbox Sign API v3 via the official `@dropbox/sign` Node.js SDK.                                                                                                     |
| [EsigningClientBase](Class.EsigningClientBase)                   | Abstract base for e-signing provider clients. Each provider (DocuSign, Adobe Sign, Dropbox Sign, Internal) must implement this contract so that the consuming application can switch providers without changing business logic.        |
| [EsigningError](Class.EsigningError)                             | Base error for all e-signing related failures.                                                                                                                                                                                         |
| [EsigningHealthIndicator](Class.EsigningHealthIndicator)         | Health indicator for the e-signing infrastructure. Calls [EsigningClientBase.ping](Class.EsigningClientBase#ping) to verify provider connectivity.                                                                                     |
| [EsigningModule](Class.EsigningModule)                           | NestJS module providing generic e-signing infrastructure. Exposes a configurable signing client and optional persistence tracking. The specific e-signing provider is selected via the options.                                        |
| [EsigningPersistenceBase](Class.EsigningPersistenceBase)         | Abstract base for persisting signing request state. Implement this abstract base in the consuming application to track signing requests in a database.                                                                                 |
| [EsigningService](Class.EsigningService)                         | Application-level service for e-signing operations. Delegates to the configured [EsigningClientBase](Class.EsigningClientBase) and optionally invokes the [EsigningPersistenceBase](Class.EsigningPersistenceBase) for state tracking. |
| [InternalEsigningProvider](Class.InternalEsigningProvider)       | Built-in e-signing provider that manages signing requests in-memory. This provider fulfills the same contract as external providers and can be used for development, testing, or simple self-managed signing workflows.                |
| [SigningProviderError](Class.SigningProviderError)               | Thrown when a provider-level operation fails.                                                                                                                                                                                          |
| [SigningRequestNotFoundError](Class.SigningRequestNotFoundError) | Thrown when a signing request cannot be found by the provider.                                                                                                                                                                         |
| [WebhookVerificationError](Class.WebhookVerificationError)       | Thrown when a webhook signature verification fails.                                                                                                                                                                                    |

## Interfaces

| Interface                                                                | Description                                                                 |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| [ICreateSigningRequest](Interface.ICreateSigningRequest)                 | Input for creating a new signing request.                                   |
| [ICreateSigningRequestDocument](Interface.ICreateSigningRequestDocument) | A document to include when creating a signing request.                      |
| [ICreateSigningRequestSigner](Interface.ICreateSigningRequestSigner)     | A signer to include when creating a signing request.                        |
| [ICreateSigningSessionRequest](Interface.ICreateSigningSessionRequest)   | Input for creating a signing session (signing link) for a specific signer.  |
| [IEsigningModuleAsyncOptions](Interface.IEsigningModuleAsyncOptions)     | Async configuration options for the [EsigningModule](Class.EsigningModule). |
| [IEsigningModuleOptions](Interface.IEsigningModuleOptions)               | Configuration options for the [EsigningModule](Class.EsigningModule).       |
| [IEsigningModuleOptionsFactory](Interface.IEsigningModuleOptionsFactory) | Factory interface for creating e-signing module options asynchronously.     |
| [IEsigningWebhookEvent](Interface.IEsigningWebhookEvent)                 | Normalized representation of a webhook event from an e-signing provider.    |
| [ISignedDocument](Interface.ISignedDocument)                             | Normalized representation of a signed (completed) document.                 |
| [ISigner](Interface.ISigner)                                             | Normalized representation of a signer participating in a signing request.   |
| [ISigningDocument](Interface.ISigningDocument)                           | Normalized representation of a document within a signing request.           |
| [ISigningField](Interface.ISigningField)                                 | Normalized representation of a signing field placed on a document.          |
| [ISigningRequest](Interface.ISigningRequest)                             | Normalized representation of a signing request (envelope/agreement).        |
| [ISigningSession](Interface.ISigningSession)                             | Normalized representation of a signing session or signing link.             |

## Type Aliases

| Type Alias                                             | Description                                                                        |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| [SignerRole](TypeAlias.SignerRole)                     | Union type derived from [SignerRoles](Variable.SignerRoles).                       |
| [SignerStatus](TypeAlias.SignerStatus)                 | Union type derived from [SignerStatuses](Variable.SignerStatuses).                 |
| [SigningFieldType](TypeAlias.SigningFieldType)         | Union type derived from [SigningFieldTypes](Variable.SigningFieldTypes).           |
| [SigningRequestStatus](TypeAlias.SigningRequestStatus) | Union type derived from [SigningRequestStatuses](Variable.SigningRequestStatuses). |
| [WebhookEventType](TypeAlias.WebhookEventType)         | Union type derived from [WebhookEventTypes](Variable.WebhookEventTypes).           |

## Variables

| Variable                                                                  | Description                                                             |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [ADOBE\_SIGN\_BASE\_URL](Variable.ADOBE_SIGN_BASE_URL)                    | Adobe Sign base URL.                                                    |
| [ADOBE\_SIGN\_CLIENT\_SECRET](Variable.ADOBE_SIGN_CLIENT_SECRET)          | Adobe Sign client secret.                                               |
| [ADOBE\_SIGN\_CONFIG\_ENTRIES](Variable.ADOBE_SIGN_CONFIG_ENTRIES)        | Configuration entries required by the Adobe Sign e-signing provider.    |
| [ADOBE\_SIGN\_INTEGRATION\_KEY](Variable.ADOBE_SIGN_INTEGRATION_KEY)      | Adobe Sign integration key.                                             |
| [ADOBE\_SIGN\_WEBHOOK\_CLIENT\_ID](Variable.ADOBE_SIGN_WEBHOOK_CLIENT_ID) | Adobe Sign webhook client ID for verification.                          |
| [DOCUSIGN\_ACCOUNT\_ID](Variable.DOCUSIGN_ACCOUNT_ID)                     | DocuSign account ID.                                                    |
| [DOCUSIGN\_BASE\_URL](Variable.DOCUSIGN_BASE_URL)                         | DocuSign base URL (e.g. https://demo.docusign.net for sandbox).         |
| [DOCUSIGN\_CONFIG\_ENTRIES](Variable.DOCUSIGN_CONFIG_ENTRIES)             | Configuration entries required by the DocuSign e-signing provider.      |
| [DOCUSIGN\_INTEGRATION\_KEY](Variable.DOCUSIGN_INTEGRATION_KEY)           | DocuSign integration key (client ID).                                   |
| [DOCUSIGN\_SECRET\_KEY](Variable.DOCUSIGN_SECRET_KEY)                     | DocuSign secret key (client secret).                                    |
| [DOCUSIGN\_WEBHOOK\_HMAC\_KEY](Variable.DOCUSIGN_WEBHOOK_HMAC_KEY)        | DocuSign webhook HMAC key.                                              |
| [DROPBOX\_SIGN\_API\_KEY](Variable.DROPBOX_SIGN_API_KEY)                  | Dropbox Sign API key.                                                   |
| [DROPBOX\_SIGN\_CLIENT\_ID](Variable.DROPBOX_SIGN_CLIENT_ID)              | Dropbox Sign client ID.                                                 |
| [DROPBOX\_SIGN\_CONFIG\_ENTRIES](Variable.DROPBOX_SIGN_CONFIG_ENTRIES)    | Configuration entries required by the Dropbox Sign e-signing provider.  |
| [DROPBOX\_SIGN\_WEBHOOK\_SECRET](Variable.DROPBOX_SIGN_WEBHOOK_SECRET)    | Dropbox Sign webhook secret.                                            |
| [SignerRoles](Variable.SignerRoles)                                       | Represents the role of a signer in a signing request.                   |
| [SignerStatuses](Variable.SignerStatuses)                                 | Represents the status of an individual signer within a signing request. |
| [SigningFieldTypes](Variable.SigningFieldTypes)                           | Represents the type of a signing field placed on a document.            |
| [SigningRequestStatuses](Variable.SigningRequestStatuses)                 | Represents the lifecycle status of a signing request.                   |
| [WebhookEventTypes](Variable.WebhookEventTypes)                           | Represents the type of webhook event emitted by a signing provider.     |
