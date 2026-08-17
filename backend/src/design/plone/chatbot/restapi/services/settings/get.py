from design.plone.chatbot.controlpanels.settings import IChatbotSettings
from plone import api
from plone.restapi.services import Service


class ChatbotSettingsGet(Service):
    """Public, read-only view of the chatbot settings.

    Unlike ``@controlpanels/chatbot-settings`` (which requires the
    ``plone.app.controlpanel.Overview`` permission, i.e. a Manager), this
    endpoint is world-readable so that the frontend widget can fetch it for
    anonymous visitors too.
    """

    def reply(self):
        return {
            "enabled": api.portal.get_registry_record(
                "enabled", interface=IChatbotSettings, default=False
            ),
            "first_message": api.portal.get_registry_record(
                "first_message", interface=IChatbotSettings, default=""
            ),
            "footer_message": api.portal.get_registry_record(
                "footer_message", interface=IChatbotSettings, default=""
            ),
        }
