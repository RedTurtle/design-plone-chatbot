import { GET_CHATBOT_SETTINGS } from '../constants/ActionTypes';
import chatbot_settings from './chatbotSettings';

describe('Chatbot settings reducer', () => {
  it('should return the initial state', () => {
    expect(chatbot_settings(undefined, { type: '' })).toEqual({
      error: null,
      data: {},
      loaded: false,
      loading: false,
    });
  });

  it('should handle GET_CHATBOT_SETTINGS_PENDING', () => {
    expect(
      chatbot_settings(undefined, {
        type: `${GET_CHATBOT_SETTINGS}_PENDING`,
      }),
    ).toEqual({
      error: null,
      data: {},
      loaded: false,
      loading: true,
    });
  });

  it('should handle GET_CHATBOT_SETTINGS_SUCCESS', () => {
    expect(
      chatbot_settings(undefined, {
        type: `${GET_CHATBOT_SETTINGS}_SUCCESS`,
        result: {
          enabled: true,
          welcome_message: 'Ciao!',
          footer_message: 'Stai parlando con un bot.',
        },
      }),
    ).toEqual({
      error: null,
      data: {
        enabled: true,
        welcome_message: 'Ciao!',
        footer_message: 'Stai parlando con un bot.',
      },
      loaded: true,
      loading: false,
    });
  });

  it('should handle GET_CHATBOT_SETTINGS_FAIL', () => {
    expect(
      chatbot_settings(undefined, {
        type: `${GET_CHATBOT_SETTINGS}_FAIL`,
        result: 'failed',
      }),
    ).toEqual({
      error: 'failed',
      data: {},
      loaded: false,
      loading: false,
    });
  });
});
