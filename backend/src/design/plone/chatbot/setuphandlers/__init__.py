try:
    # Plone 6
    from plone.base.interfaces.installable import INonInstallable
except ImportError:
    # Plone 5.2
    from Products.CMFPlone.interfaces import INonInstallable
from zope.interface import implementer


@implementer(INonInstallable)
class HiddenProfiles:
    def getNonInstallableProfiles(self):
        """Hide uninstall profile from site-creation and quickinstaller."""
        return [
            "design.plone.chatbot:uninstall",
        ]

    def getNonInstallableProducts(self):
        """Hide the upgrades package from site-creation and quickinstaller."""
        return [
            "design.plone.chatbot.upgrades",
        ]
