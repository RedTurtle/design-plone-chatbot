import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getChatbotSettings } from '../../actions/chatbotSettings';
import chatbotConfig from '../../config/chatbotConfig';

const WIDGET_SCRIPT_MARKER = 'data-chatbot-widget';

function loadWidgetScript(url: string) {
  if (!url || document.querySelector(`script[${WIDGET_SCRIPT_MARKER}]`)) {
    return;
  }
  const script = document.createElement('script');
  script.src = url;
  script.async = true;
  script.setAttribute(WIDGET_SCRIPT_MARKER, 'true');
  document.body.appendChild(script);
}

interface ChatbotLoaderProps {
  pathname?: string;
}

/**
 * Registered as a Volto `appExtras` entry (see `config/settings.ts`), so it
 * renders on every route regardless of whether there is a content object
 * behind it (search results, 404, ...). Mounts the `io-chatto` widget only
 * when the site's control panel has it enabled — flipping the flag off
 * means this returns null on the next fetch, with no dependency on a new
 * frontend/backend deploy.
 */
const ChatbotLoader = ({ pathname }: ChatbotLoaderProps) => {
  const dispatch = useDispatch();
  const {
    enabled,
    first_message: welcomeMessage,
    footer_message: footerMessage,
  } = useSelector(
    (state: any) => state.chatbot_settings?.data ?? {},
    shallowEqual,
  );
  const lang = useSelector((state: any) => state.intl?.locale);

  useEffect(() => {
    dispatch(getChatbotSettings());
    // Re-checked on every client-side route change, same as Volto's own
    // Navigation component, so a toggle takes effect within the session
    // rather than only on the next full page load.
  }, [pathname, dispatch]);

  useEffect(() => {
    if (enabled) {
      loadWidgetScript(chatbotConfig.widgetScriptUrl);
    }
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <io-chatto
      api-url={chatbotConfig.apiUrl}
      widget-title={chatbotConfig.widgetTitle}
      contact-email={chatbotConfig.contactEmail}
      lang={lang}
      welcome-message={welcomeMessage}
      ai-disclaimer={footerMessage}
    />
  );
};

export default ChatbotLoader;
