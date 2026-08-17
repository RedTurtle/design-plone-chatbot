class TestChatbotSettingsControlpanel:
    def test_controlpanel_listed(self, manager_request):
        response = manager_request.get("/@controlpanels")

        titles = [x.get("title") for x in response.json()]
        assert "Impostazioni Chatbot" in titles

    def test_controlpanel_exists(self, manager_request):
        response = manager_request.get("/@controlpanels/chatbot-settings")

        assert response.status_code == 200
        assert response.headers.get("Content-Type") == "application/json"

    def test_controlpanel_defaults(self, manager_request):
        response = manager_request.get("/@controlpanels/chatbot-settings")
        data = response.json().get("data", {})

        assert data.get("enabled") is True
        assert data.get("first_message")
        assert data.get("footer_message")

    def test_controlpanel_requires_manager(self, anon_request):
        response = anon_request.get("/@controlpanels/chatbot-settings")

        assert response.status_code == 401

    def test_controlpanel_update(self, manager_request):
        response = manager_request.patch(
            "/@controlpanels/chatbot-settings",
            json={"enabled": False},
        )
        assert response.status_code == 204

        response = manager_request.get("/@controlpanels/chatbot-settings")
        assert response.json()["data"]["enabled"] is False
