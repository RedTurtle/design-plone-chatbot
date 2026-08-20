from design.plone.chatbot import _
from plone.app.registry.browser.controlpanel import ControlPanelFormWrapper
from plone.app.registry.browser.controlpanel import RegistryEditForm
from plone.restapi.controlpanels.interfaces import IControlpanel
from zope.interface import Interface
from zope.schema import Bool
from zope.schema import Text


class IChatbotSettingsControlpanel(IControlpanel):
    """ """


class IChatbotSettings(Interface):
    enabled = Bool(
        title=_("enabled_label", default="Abilita il chatbot"),
        description=_(
            "enabled_help",
            default="Se deselezionato, il chatbot non verrà mostrato sul "
            "sito. Utile per disabilitarlo rapidamente in caso di "
            "emergenza, senza bisogno di un nuovo deploy.",
        ),
        default=True,
        required=False,
    )

    first_message = Text(
        title=_("first_message_label", default="Primo messaggio"),
        description=_(
            "first_message_help",
            default="Testo mostrato come primo messaggio del chatbot, "
            "prima che l'utente inizi a interagire con l'assistente.",
        ),
        default=(
            "Ciao! Sono un assistente virtuale basato su intelligenza "
            "artificiale e rispondo usando solo le informazioni pubblicate "
            "su questo sito. Non posso accedere a pratiche o dati "
            "personali: per richieste specifiche scrivi a [email@ente.it]."
        ),
        required=False,
    )

    footer_message = Text(
        title=_("footer_message_label", default="Messaggio informativo (footer)"),
        description=_(
            "footer_message_help",
            default="Testo mostrato in calce alla chat per informare "
            "l'utente che sta interagendo con un assistente basato su "
            "intelligenza artificiale.",
        ),
        default=(
            "Stai interagendo con un assistente virtuale basato su "
            "intelligenza artificiale, che risponde sulla base delle "
            "informazioni pubblicate su questo sito. Per richieste "
            "relative a pratiche personali o casi specifici, ti invitiamo "
            "a scrivere a [email@ente.it]."
        ),
        required=False,
    )


class ChatbotControlPanelForm(RegistryEditForm):
    schema = IChatbotSettings
    id = "chatbot-control-panel"
    label = _("chatbot_settings_label", default="Impostazioni Chatbot")


class ChatbotControlPanelView(ControlPanelFormWrapper):
    """ """

    form = ChatbotControlPanelForm
