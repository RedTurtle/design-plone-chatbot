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
    from urllib.parse import urljoin
    from urllib.parse import urlparse

    import requests

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

    @pytest.fixture
    def functional_portal(functional):
        return functional["portal"]

    class _RelativeSession(requests.Session):
        """Minimal standalone equivalent of plone.restapi.testing.RelativeSession."""

        def __init__(self, base_url):
            super().__init__()
            if not base_url.endswith("/"):
                base_url += "/"
            self._base_url = base_url

        def request(self, method, url, **kwargs):
            if urlparse(url).scheme not in ("http", "https"):
                url = urljoin(self._base_url, url.lstrip("/"))
            return super().request(method, url, **kwargs)

    @pytest.fixture
    def request_factory(functional_portal, request):
        def factory(*, role="Anonymous", basic_auth=None, api=True):
            from plone.app.testing import SITE_OWNER_NAME
            from plone.app.testing import SITE_OWNER_PASSWORD

            base_url = functional_portal.absolute_url()
            if api:
                base_url = f"{base_url}/++api++"
            session = _RelativeSession(base_url)
            session.headers.update({"Accept": "application/json"})
            if basic_auth is not None:
                session.auth = basic_auth
            elif role == "Manager":
                session.auth = (SITE_OWNER_NAME, SITE_OWNER_PASSWORD)
            elif role != "Anonymous":
                raise ValueError(f"Unknown role {role!r}")
            request.addfinalizer(session.close)
            return session

        return factory

    @pytest.fixture
    def manager_request(request_factory):
        return request_factory(role="Manager")

    @pytest.fixture
    def anon_request(request_factory):
        return request_factory(role="Anonymous")
