import type { ConfigType } from '@plone/registry';
import chatbotSettingsReducer from '../reducers/chatbotSettings';
import { chatbotSettingsAsyncPropExtender } from './asyncPropsExtender';
import ChatbotLoader from '../components/ChatbotLoader/ChatbotLoader';

export default function install(config: ConfigType) {
  config.addonReducers.chatbot_settings = chatbotSettingsReducer;

  config.settings.asyncPropsExtenders = [
    ...(config.settings.asyncPropsExtenders || []),
    chatbotSettingsAsyncPropExtender,
  ];

  config.settings.appExtras = [
    ...(config.settings.appExtras || []),
    {
      // Empty path matches every route, including ones with no content
      // object behind them (search, 404, ...) — see AppExtras.test.jsx in
      // @plone/volto core for the same catch-all convention.
      match: '',
      component: ChatbotLoader,
      props: {},
    },
  ];

  return config;
}
