from design.plone.chatbot import logger
from pathlib import Path
from plone import api
from Products.GenericSetup.tool import SetupTool


try:
    # Plone 6.1+
    from plone.exportimport import importers
except ImportError:
    # Plone 5.2 / 6.0
    importers = None


EXAMPLE_CONTENT_FOLDER = Path(__file__).parent / "examplecontent"


def create_example_content(portal_setup: SetupTool):
    """Import content available at the examplecontent folder."""
    if importers is None:
        logger.warning(
            "plone.exportimport is not available: skipping example content creation."
        )
        return
    portal = api.portal.get()
    importer = importers.get_importer(portal)
    for line in importer.import_site(EXAMPLE_CONTENT_FOLDER):
        logger.info(line)
