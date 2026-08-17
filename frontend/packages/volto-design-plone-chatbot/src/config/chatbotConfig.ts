export interface ChatbotConfig {
  widgetScriptUrl: string;
  apiUrl: string;
  widgetTitle: string;
  contactEmail: string;
}

/**
 * Static, per-deployment configuration for the chatbot widget (the RAG
 * backend/frontend at https://github.com/RedTurtle/poc-rag-website-kb). This
 * is deliberately NOT part of the Plone control panel: the panel only lets
 * editors flip the enabled flag and edit the two disclaimer texts, while the
 * widget location/API endpoint is deploy-time config, set once per site.
 *
 * process.env.RAZZLE_* must be referenced literally (not destructured/looped)
 * so Razzle's DefinePlugin can inline the values at build time.
 */
const chatbotConfig: ChatbotConfig = {
  widgetScriptUrl: process.env.RAZZLE_CHATBOT_WIDGET_URL || '',
  apiUrl: process.env.RAZZLE_CHATBOT_API_URL || '',
  widgetTitle: process.env.RAZZLE_CHATBOT_WIDGET_TITLE || '',
  contactEmail: process.env.RAZZLE_CHATBOT_CONTACT_EMAIL || '',
};

export default chatbotConfig;
