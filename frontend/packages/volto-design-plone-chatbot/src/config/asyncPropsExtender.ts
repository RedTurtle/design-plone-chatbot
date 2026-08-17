import { GET_CHATBOT_SETTINGS } from '../constants/ActionTypes';
import { getChatbotSettings } from '../actions/chatbotSettings';

/**
 * Registers the chatbot settings fetch as a route-independent SSR async prop,
 * the same mechanism Volto core uses for `@site` (see
 * `@plone/volto/helpers/Site`). This guarantees the enabled flag and the two
 * editorial messages are already in the Redux store by the time the app
 * renders — on every route, including ones with no content object behind
 * them (search results, 404, login, ...) — instead of being tied to the
 * per-content `@components` expanders.
 */
const chatbotSettingsAsyncPropExtender = {
  path: '/',
  extend: (dispatchActions: Array<{ key?: string }>) => {
    if (
      dispatchActions.filter(
        (asyncAction) => asyncAction.key === GET_CHATBOT_SETTINGS,
      ).length === 0
    ) {
      dispatchActions.push({
        key: GET_CHATBOT_SETTINGS,
        promise: ({ store: { dispatch } }: any) =>
          // @ts-expect-error -- __SERVER__ is a Volto/Razzle build-time global
          __SERVER__ && dispatch(getChatbotSettings()),
      } as any);
    }
    return dispatchActions;
  },
};

export { chatbotSettingsAsyncPropExtender };
