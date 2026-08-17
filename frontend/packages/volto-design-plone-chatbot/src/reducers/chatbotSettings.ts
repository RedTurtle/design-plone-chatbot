import { GET_CHATBOT_SETTINGS } from '../constants/ActionTypes';
import type { ChatbotSettingsData } from '../actions/chatbotSettings';

export interface ChatbotSettingsState {
  error: unknown;
  loaded: boolean;
  loading: boolean;
  data: Partial<ChatbotSettingsData>;
}

const initialState: ChatbotSettingsState = {
  error: null,
  loaded: false,
  loading: false,
  data: {},
};

interface ChatbotSettingsAction {
  type: string;
  // On _SUCCESS this is the ChatbotSettingsData payload; on _FAIL it is
  // whatever error the API middleware attaches, so it can't share that type.
  result?: unknown;
}

/**
 * Chatbot settings reducer.
 * @function chatbot_settings
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function chatbot_settings(
  state: ChatbotSettingsState = initialState,
  action: ChatbotSettingsAction = { type: '' },
): ChatbotSettingsState {
  switch (action.type) {
    case `${GET_CHATBOT_SETTINGS}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
        data: {},
      };
    case `${GET_CHATBOT_SETTINGS}_SUCCESS`:
      return {
        ...state,
        error: null,
        loaded: true,
        loading: false,
        data: (action.result as ChatbotSettingsData) ?? {},
      };
    case `${GET_CHATBOT_SETTINGS}_FAIL`:
      return {
        ...state,
        error: action.result,
        loaded: false,
        loading: false,
        data: {},
      };
    default:
      return state;
  }
}
