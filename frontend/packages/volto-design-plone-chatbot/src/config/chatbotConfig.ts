export interface ChatbotConfig {
  widgetScriptUrl: string;
  apiUrl: string;
  widgetTitle: string;
  contactEmail: string;
}

interface WindowWithEnv extends Window {
  env?: Record<string, string | undefined>;
}

const windowEnv: Record<string, string | undefined> =
  (typeof window !== 'undefined' && (window as WindowWithEnv).env) || {};

/**
 * Static, per-deployment configuration for the chatbot widget (the RAG
 * backend/frontend at https://github.com/RedTurtle/poc-rag-website-kb). This
 * is deliberately NOT part of the Plone control panel: the panel only lets
 * editors flip the enabled flag and edit the two disclaimer texts, while the
 * widget location/API endpoint is deploy-time config, set once per site.
 *
 * process.env.RAZZLE_* must be referenced literally (not destructured/looped)
 * so Razzle's DefinePlugin can inline the values at build time — but that
 * only captures whatever was set when the frontend image was built. Since
 * these vars are actually set per-container (see docker-compose.yml /
 * Makefile, same as RAZZLE_API_PATH), the browser must prefer `window.env`,
 * which Volto's server re-serializes from the live process.env on every
 * request (see @plone/volto's runtime_config.js and Html.jsx).
 */
const chatbotConfig: ChatbotConfig = {
  widgetScriptUrl:
    windowEnv.RAZZLE_CHATBOT_WIDGET_URL ||
    process.env.RAZZLE_CHATBOT_WIDGET_URL ||
    '',
  apiUrl:
    windowEnv.RAZZLE_CHATBOT_API_URL ||
    process.env.RAZZLE_CHATBOT_API_URL ||
    '',
  widgetTitle:
    windowEnv.RAZZLE_CHATBOT_WIDGET_TITLE ||
    process.env.RAZZLE_CHATBOT_WIDGET_TITLE ||
    '',
  contactEmail:
    windowEnv.RAZZLE_CHATBOT_CONTACT_EMAIL ||
    process.env.RAZZLE_CHATBOT_CONTACT_EMAIL ||
    '',
};

export default chatbotConfig;
