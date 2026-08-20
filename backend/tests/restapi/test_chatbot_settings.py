class TestChatbotSettingsEndpoint:
    def test_anonymous_can_read(self, anon_request):
        response = anon_request.get("/@chatbot-settings")

        assert response.status_code == 200
        data = response.json()
        assert data.get("enabled") is True
        assert data.get("first_message")
        assert data.get("footer_message")

    def test_reflects_registry_changes(self, manager_request, anon_request):
        response = manager_request.patch(
            "/@controlpanels/chatbot-settings",
            json={"enabled": False, "first_message": "Ciao"},
        )
        assert response.status_code == 204

        response = anon_request.get("/@chatbot-settings")
        data = response.json()
        assert data["enabled"] is False
        assert data["first_message"] == "Ciao"
