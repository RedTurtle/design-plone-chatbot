import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import chatbotSettingsReducer from '../../reducers/chatbotSettings';
import ChatbotLoader from './ChatbotLoader';

/**
 * Visual sanity check for ChatbotLoader without a Plone backend: wraps it in
 * a plain Redux store pre-populated as if `@chatbot-settings` had already
 * answered. To actually see the floating widget (not just the empty
 * `io-chatto` tag), start Storybook with RAZZLE_CHATBOT_WIDGET_URL pointing
 * at a locally served build of https://github.com/RedTurtle/poc-rag-website-kb
 * frontend's `dist-widget/widget.js` — see frontend/README.md.
 */
function makeStore(data: Record<string, unknown>) {
  return createStore(
    combineReducers({
      chatbot_settings: (
        state = chatbotSettingsReducer(undefined, { type: '' }),
      ) => ({ ...state, data }),
      intl: (state = { locale: 'it' }) => state,
    }),
  );
}

export default {
  title: 'Chatbot/ChatbotLoader',
  component: ChatbotLoader,
};

export const Enabled = {
  render: () => (
    <Provider
      store={makeStore({
        enabled: true,
        welcome_message:
          'Ciao! Sono un assistente virtuale basato su intelligenza artificiale e rispondo usando solo le informazioni pubblicate su questo sito. Non posso accedere a pratiche o dati personali: per richieste specifiche scrivi a urp@ente.it.',
        footer_message:
          'Stai interagendo con un assistente virtuale basato su intelligenza artificiale, che risponde sulla base delle informazioni pubblicate su questo sito. Per richieste relative a pratiche personali o casi specifici, ti invitiamo a scrivere a urp@ente.it.',
      })}
    >
      <ChatbotLoader pathname="/" />
    </Provider>
  ),
};

export const Disabled = {
  render: () => (
    <Provider store={makeStore({ enabled: false })}>
      <ChatbotLoader pathname="/" />
    </Provider>
  ),
};
