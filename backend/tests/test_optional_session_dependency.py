from app.main import app


def test_optional_session_cookie_is_not_exposed_as_query_parameters() -> None:
    schema = app.openapi()

    for path in ("/api/v1/contact", "/api/v1/leads"):
        parameters = schema["paths"][path]["post"].get("parameters", [])
        parameter_names = {parameter["name"] for parameter in parameters}

        assert "args" not in parameter_names
        assert "kwargs" not in parameter_names
        assert "we_chat_session" in parameter_names
