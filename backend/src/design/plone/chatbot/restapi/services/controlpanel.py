from design.plone.chatbot.controlpanels.settings import IChatbotSettings
from design.plone.chatbot.controlpanels.settings import IChatbotSettingsControlpanel
from plone.restapi.controlpanels import RegistryConfigletPanel
from zope.component import adapter
from zope.interface import implementer
from zope.interface import Interface


@adapter(Interface, Interface)
@implementer(IChatbotSettingsControlpanel)
class ChatbotSettings(RegistryConfigletPanel):
    schema = IChatbotSettings
    configlet_id = "ChatbotSettings"
    configlet_category_id = "Products"
    schema_prefix = None
