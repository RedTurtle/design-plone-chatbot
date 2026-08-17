import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import chatbotSettingsReducer from '../../reducers/chatbotSettings';
import ChatbotLoader from './ChatbotLoader';

vi.mock('../../config/chatbotConfig', () => ({
  default: {
    widgetScriptUrl: 'https://chatbot.example.org/widget.js',
    apiUrl: 'https://chatbot.example.org',
    widgetTitle: 'Assistente virtuale',
    contactEmail: 'urp@ente.it',
  },
}));

function makeStore(chatbotSettingsData: Record<string, unknown>) {
  return createStore(
    combineReducers({
      chatbot_settings: (
        state = chatbotSettingsReducer(undefined, { type: '' }),
      ) => ({ ...state, data: chatbotSettingsData }),
      intl: (state = { locale: 'it' }) => state,
    }),
  );
}

afterEach(() => {
  cleanup();
  document
    .querySelectorAll('script[data-chatbot-widget]')
    .forEach((el) => el.remove());
});

describe('ChatbotLoader', () => {
  it('renders nothing and injects no script when the chatbot is disabled', () => {
    const store = makeStore({ enabled: false });
    const { container } = render(
      <Provider store={store}>
        <ChatbotLoader pathname="/" />
      </Provider>,
    );

    expect(container).toBeEmptyDOMElement();
    expect(document.querySelector('script[data-chatbot-widget]')).toBeNull();
  });

  it('mounts io-chatto with the editorial messages and injects the widget script when enabled', () => {
    const store = makeStore({
      enabled: true,
      welcome_message: 'Ciao! Sono un assistente virtuale.',
      footer_message: 'Stai parlando con un bot.',
    });
    render(
      <Provider store={store}>
        <ChatbotLoader pathname="/" />
      </Provider>,
    );

    const widget = document.querySelector('io-chatto');
    expect(widget).not.toBeNull();
    expect(widget?.getAttribute('welcome-message')).toBe(
      'Ciao! Sono un assistente virtuale.',
    );
    expect(widget?.getAttribute('ai-disclaimer')).toBe(
      'Stai parlando con un bot.',
    );
    expect(widget?.getAttribute('api-url')).toBe('https://chatbot.example.org');
    expect(widget?.getAttribute('lang')).toBe('it');

    const script = document.querySelector('script[data-chatbot-widget]');
    expect(script?.getAttribute('src')).toBe(
      'https://chatbot.example.org/widget.js',
    );
  });

  it('does not inject the widget script twice on re-render', () => {
    const store = makeStore({ enabled: true });
    const { rerender } = render(
      <Provider store={store}>
        <ChatbotLoader pathname="/" />
      </Provider>,
    );
    rerender(
      <Provider store={store}>
        <ChatbotLoader pathname="/some-other-page" />
      </Provider>,
    );

    expect(
      document.querySelectorAll('script[data-chatbot-widget]').length,
    ).toBe(1);
  });
});
