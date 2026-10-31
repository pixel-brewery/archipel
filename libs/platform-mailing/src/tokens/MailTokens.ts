// #region Documentation
/**
 * Central definition of injection tokens used by the mail module.
 * Using constants instead of raw string literals prevents accidental typos
 * and enables refactors with compile time safety.
 */
// #endregion

export const MAIL_TEMPLATE_FETCH_STRATEGY_TOKEN = Symbol('MailTemplateFetchStrategy');

export const MAIL_DELIVERY_STRATEGY_TOKEN = Symbol('MailDeliveryStrategy');

export const MAIL_TEMPLATE_REPOSITORY_TOKEN = Symbol('MailTemplateRepository');

export const MAIL_TEMPLATE_NAMES_TOKEN = Symbol('MailTemplateNames');
