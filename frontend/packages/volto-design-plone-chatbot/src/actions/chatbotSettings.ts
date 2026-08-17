import { GET_CHATBOT_SETTINGS } from '../constants/ActionTypes';

/**
 * Shape returned by the backend's `@chatbot-settings` REST service
 * (design.plone.chatbot). Anonymous-readable, site-wide, not tied to any
 * content object — so it is also available on contentless routes such as
 * search results or the 404 page.
 */
export interface ChatbotSettingsData {
  enabled: boolean;
  welcome_message: string;
  footer_message: string;
}

/**
 * Get the chatbot settings (enabled flag and editorial messages) from the
 * Plone control panel registry.
 * @function getChatbotSettings
 * @returns {Object} chatbot settings action
 */
export function getChatbotSettings() {
  return {
    type: GET_CHATBOT_SETTINGS,
    request: {
      op: 'get',
      path: '/@chatbot-settings',
    },
  };
}
