from app.utils.sanitization import clean_assistant_response


def test_assistant_response_removes_markdown_structure_but_keeps_bold_markers() -> None:
    result = clean_assistant_response(
        "## Solar options\n\n- **Open access** is available.\n> Check local eligibility."
    )

    assert result == (
        "Solar options\n\n• **Open access** is available.\nCheck local eligibility."
    )


def test_assistant_response_removes_control_characters() -> None:
    assert clean_assistant_response("Solar\x00 power") == "Solar power"
