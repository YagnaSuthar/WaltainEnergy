from types import SimpleNamespace

import pytest
from google.genai import errors

from app.agents import llm_provider
from app.agents.orchestrator import _llm_failure_reply


def _llm_settings(**overrides):
    values = {
        "llm_provider": "groq",
        "llm_api_key": "test-key",
        "llm_model": "openai/gpt-oss-120b",
        "llm_temperature": 0.2,
        "llm_max_output_tokens": 100,
        "llm_timeout_seconds": 5,
        "llm_max_retries": 0,
    }
    values.update(overrides)
    return SimpleNamespace(**values)


@pytest.mark.asyncio
async def test_groq_sends_openai_compatible_chat_request(monkeypatch) -> None:
    captured = {}

    class FakeResponse:
        is_error = False
        status_code = 200

        def json(self):
            return {"choices": [{"message": {"content": "Grounded Groq response"}}]}

    class FakeClient:
        def __init__(self, timeout):
            captured["timeout"] = timeout

        async def __aenter__(self):
            return self

        async def __aexit__(self, *args):
            return None

        async def post(self, url, headers, json):
            captured.update(url=url, headers=headers, payload=json)
            return FakeResponse()

    monkeypatch.setattr(llm_provider.httpx, "AsyncClient", FakeClient)

    result = await llm_provider.generate_llm_response(
        [{"role": "user", "content": "What services do you provide?"}],
        _llm_settings(),
    )

    assert result == "Grounded Groq response"
    assert captured["url"] == "https://api.groq.com/openai/v1/chat/completions"
    assert captured["headers"]["Authorization"] == "Bearer test-key"
    assert captured["payload"]["model"] == "openai/gpt-oss-120b"
    assert captured["payload"]["messages"] == [
        {"role": "user", "content": "What services do you provide?"}
    ]
    assert captured["payload"]["max_completion_tokens"] == 100


@pytest.mark.asyncio
async def test_groq_retries_server_errors_but_not_rate_limits(monkeypatch) -> None:
    async def no_wait(_):
        return None

    monkeypatch.setattr(llm_provider.asyncio, "sleep", no_wait)
    calls = 0
    status_codes = [503, 200]

    class FakeResponse:
        def __init__(self, status_code):
            self.status_code = status_code
            self.is_error = status_code >= 400

        def json(self):
            return {"choices": [{"message": {"content": "Recovered response"}}]}

    class FakeClient:
        def __init__(self, timeout):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, *args):
            return None

        async def post(self, *args, **kwargs):
            nonlocal calls
            status_code = status_codes[min(calls, len(status_codes) - 1)]
            calls += 1
            return FakeResponse(status_code)

    monkeypatch.setattr(llm_provider.httpx, "AsyncClient", FakeClient)
    result = await llm_provider.generate_groq_response(
        [{"role": "user", "content": "Question"}],
        _llm_settings(llm_max_retries=1),
    )

    assert result == "Recovered response"
    assert calls == 2

    calls = 0
    status_codes[:] = [429, 200]
    with pytest.raises(llm_provider.ProviderResponseError) as error:
        await llm_provider.generate_groq_response(
            [{"role": "user", "content": "Question"}],
            _llm_settings(llm_max_retries=1),
        )

    assert error.value.code == 429
    assert calls == 1


@pytest.mark.asyncio
async def test_gemini_retries_transient_server_error(monkeypatch) -> None:
    calls = 0

    class FakeModels:
        async def generate_content(self, **kwargs):
            nonlocal calls
            calls += 1
            if calls == 1:
                raise errors.ServerError(500, response_json={"message": "temporary provider error"})
            return SimpleNamespace(text="Grounded response")

    class FakeClient:
        def __init__(self, **kwargs):
            self.aio = SimpleNamespace(models=FakeModels())

    monkeypatch.setattr("google.genai.Client", FakeClient)
    monkeypatch.setattr(llm_provider.asyncio, "sleep", lambda _: _resolved_sleep())

    result = await llm_provider.generate_gemini_response(
        [{"role": "user", "content": "Question"}],
        SimpleNamespace(
            llm_api_key="test-key",
            llm_model="test-model",
            llm_temperature=0.2,
            llm_max_output_tokens=100,
            llm_timeout_seconds=5,
            llm_max_retries=1,
        ),
    )

    assert result == "Grounded response"
    assert calls == 2


@pytest.mark.asyncio
async def test_zero_retries_makes_only_one_provider_request(monkeypatch) -> None:
    calls = 0

    class FakeModels:
        async def generate_content(self, **kwargs):
            nonlocal calls
            calls += 1
            raise errors.ServerError(500, response_json={"message": "temporary provider error"})

    class FakeClient:
        def __init__(self, **kwargs):
            self.aio = SimpleNamespace(models=FakeModels())

    monkeypatch.setattr("google.genai.Client", FakeClient)

    with pytest.raises(errors.ServerError):
        await llm_provider.generate_gemini_response(
            [{"role": "user", "content": "Question"}],
            SimpleNamespace(
                llm_api_key="test-key",
                llm_model="test-model",
                llm_temperature=0.2,
                llm_max_output_tokens=100,
                llm_timeout_seconds=5,
                llm_max_retries=0,
            ),
        )

    assert calls == 1


@pytest.mark.asyncio
async def test_rate_limit_429_is_not_retried(monkeypatch) -> None:
    calls = 0

    class FakeModels:
        async def generate_content(self, **kwargs):
            nonlocal calls
            calls += 1
            raise errors.APIError(429, {"message": "quota exceeded"})

    class FakeClient:
        def __init__(self, **kwargs):
            self.aio = SimpleNamespace(models=FakeModels())

    monkeypatch.setattr("google.genai.Client", FakeClient)

    with pytest.raises(errors.APIError) as error:
        await llm_provider.generate_gemini_response(
            [{"role": "user", "content": "Question"}],
            SimpleNamespace(
                llm_api_key="test-key",
                llm_model="test-model",
                llm_temperature=0.2,
                llm_max_output_tokens=100,
                llm_timeout_seconds=5,
                llm_max_retries=2,
            ),
        )

    assert error.value.code == 429
    assert calls == 1


def test_rate_limit_and_provider_outage_fallbacks_are_specific() -> None:
    settings = SimpleNamespace(
        business_public_email="contact@example.com",
        business_public_phone="+910000000000",
    )

    rate_limit_reply = _llm_failure_reply(errors.APIError(429, {}), settings)
    unavailable_reply = _llm_failure_reply(errors.ServerError(503, {}), settings)

    assert "request limit" in rate_limit_reply
    assert "temporarily unavailable" in unavailable_reply
    assert "contact@example.com" in rate_limit_reply


@pytest.mark.asyncio
async def test_timeout_log_reports_model_and_configured_deadline(monkeypatch, caplog) -> None:
    class FakeModels:
        async def generate_content(self, **kwargs):
            await llm_provider.asyncio.sleep(1)

    class FakeClient:
        def __init__(self, **kwargs):
            self.aio = SimpleNamespace(models=FakeModels())

    monkeypatch.setattr("google.genai.Client", FakeClient)

    with pytest.raises(TimeoutError):
        await llm_provider.generate_gemini_response(
            [{"role": "user", "content": "Question"}],
            SimpleNamespace(
                llm_api_key="test-key",
                llm_model="test-model",
                llm_temperature=0.2,
                llm_max_output_tokens=100,
                llm_timeout_seconds=0.01,
                llm_max_retries=0,
            ),
        )

    assert "model=test-model" in caplog.text
    assert "timeout_seconds=0.01" in caplog.text
    assert "attempts=1" in caplog.text


async def _resolved_sleep() -> None:
    return None