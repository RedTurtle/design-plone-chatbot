import sys

import pytest


if sys.version_info < (3, 9):
    # On Plone 5.2 (Python 3.8), several dotted-name packages (z3c.autoinclude,
    # repoze.xmliter, ...) ship no PyPI wheel, so uv/pip build one on the fly
    # and, per PEP 503, normalize the dot in their dist-info folder name to a
    # dash. pkg_resources.Requirement.parse(...).key does not normalize dots,
    # so Products.CMFPlone's own `pkg_resources.require(...)` at import time
    # can no longer find them even though they are installed and importable.
    # Re-derive each distribution's name from its own metadata to fix this.
    import pkg_resources

    for _dist in list(pkg_resources.working_set):
        try:
            raw = _dist.get_metadata(
                "METADATA" if _dist.has_metadata("METADATA") else "PKG-INFO"
            )
        except (OSError, LookupError):
            continue
        for _line in raw.splitlines():
            if _line.startswith("Name:"):
                _real_name = _line.split(":", 1)[1].strip()
                break
        else:
            continue
        if _real_name != _dist.project_name:
            _dist.project_name = _real_name
            _dist._key = _real_name.lower()
            pkg_resources.working_set.by_key[_dist._key] = _dist


from design.plone.chatbot.testing import ACCEPTANCE_TESTING
from design.plone.chatbot.testing import FUNCTIONAL_TESTING
from design.plone.chatbot.testing import INTEGRATION_TESTING
from pytest_plone import fixtures_factory


pytest_plugins = ["pytest_plone"]

if sys.version_info < (3, 9):
    # Loading pytest_plone's setuptools entry point through pytest's own
    # autoload (before conftest.py, and thus the metadata fix above, has run)
    # hits the same pkg_resources bug, so it must be disabled for Plone 5.2
    # (see Makefile: PYTEST_DISABLE_PLUGIN_AUTOLOAD=1). That also skips
    # gocept.pytestlayer's own entry point, so register it explicitly here.
    pytest_plugins.append("gocept.pytestlayer.plugin")


globals().update(
    fixtures_factory((
        (ACCEPTANCE_TESTING, "acceptance"),
        (FUNCTIONAL_TESTING, "functional"),
        (INTEGRATION_TESTING, "integration"),
    ))
)


if sys.version_info < (3, 9):
    # pytest-plone<0.3 (needed on Plone 5.2, see pyproject.toml) has its own
    # bug: fixtures/addons.py imports plone.base (Plone 6.1+ only), which
    # aborts loading the whole fixtures package, so none of its convenience
    # fixtures (portal, installer, browser_layers, profile_last_version, ...)
    # end up registered. Provide the ones our tests need ourselves.

    @pytest.fixture
    def portal(integration):
        return integration["portal"]

    @pytest.fixture
    def installer(portal):
        try:
            from Products.CMFPlone.utils import get_installer  # Plone 5.2
        except ImportError:
            from plone.base.utils import get_installer  # Plone 6.x

        return get_installer(portal)

    @pytest.fixture
    def browser_layers(portal):
        from plone.browserlayer import utils

        return utils.registered_layers()

    @pytest.fixture
    def profile_last_version(portal):
        from plone import api

        setup_tool = api.portal.get_tool("portal_setup")

        def _profile_last_version(name: str) -> str:
            version = setup_tool.getLastVersionForProfile(name)
            return version[0] if version else ""

        return _profile_last_version
