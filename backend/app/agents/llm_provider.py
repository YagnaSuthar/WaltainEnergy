from __future__ import annotations

import asyncio
import logging
import random
import time

import httpx

from app.core.config import Settings, get_settings

logger = logging.getLogger(__name__)


class ProviderResponseError(RuntimeError):
    def __init__(self, status_code: int) -> None:
        super().__init__(f"LLM provider returned HTTP {status_code}")
        self.code = status_code


async def generate_llm_response(
    messages: list[dict[str, str]], settings: Settings | None = None
) -> str:
    """Dispatch chat generation to the provider selected in settings."""
    settings = settings or get_settings()
    provider = settings.llm_provider.strip().casefold()
    if provider == "groq":
        return await generate_groq_response(messages, settings)
    if provider == "gemini":
        return await generate_gemini_response(messages, settings)
    raise ValueError(f"Unsupported LLM provider: {settings.llm_provider}")


async def generate_groq_response(
    messages: list[dict[str, str]], settings: Settings | None = None
) -> str:
    """Generate a response through Groq's OpenAI-compatible chat API."""
    settings = settings or get_settings()
    if not settings.llm_api_key:
        raise RuntimeError("LLM_API_KEY is not configured")

    retry_count = max(0, settings.llm_max_retries)
    request_started = time.monotonic()
    async with httpx.AsyncClient(
        timeout=httpx.Timeout(settings.llm_timeout_seconds)
    ) as client:
        for attempt in range(retry_count + 1):
            try:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.llm_api_key}"},
                    json={
                        "model": settings.llm_model,
                        "messages": messages,
                        "temperature": settings.llm_temperature,
                        "max_completion_tokens": settings.llm_max_output_tokens,
                    },
                )
                if response.is_error:
                    raise ProviderResponseError(response.status_code)

                choices = response.json().get("choices", [])
                text = choices[0].get("message", {}).get("content")
                if not isinstance(text, str) or not text.strip():
                    raise RuntimeError("Groq returned an empty response")
                return text.strip()
            except (
                ProviderResponseError,
                httpx.TimeoutException,
                httpx.TransportError,
            ) as exc:
                status_code = getattr(exc, "code", None)
                is_retryable = (
                    status_code is None or status_code >= 500
                )
                if not is_retryable or attempt >= retry_count:
                    if isinstance(exc, httpx.TimeoutException):
                        logger.error(
                            "Groq request timed out model=%s timeout_seconds=%s attempts=%s elapsed_seconds=%.1f",
                            settings.llm_model,
                            settings.llm_timeout_seconds,
                            attempt + 1,
                            time.monotonic() - request_started,
                        )
                    raise

                delay_seconds = min(2**attempt + random.random(), 8)
                logger.warning(
                    "Groq temporary request failure model=%s type=%s provider_http_code=%s; retry %d/%d in %.1fs",
                    settings.llm_model,
                    type(exc).__name__,
                    status_code,
                    attempt + 1,
                    retry_count,
                    delay_seconds,
                )
                await asyncio.sleep(delay_seconds)

    raise RuntimeError("Groq request failed after configured retries")


async def generate_gemini_response(
    messages: list[dict[str, str]], settings: Settings | None = None
) -> str:
    """Generate a response through the configured Google GenAI model."""
    settings = settings or get_settings()
    if not settings.llm_api_key:
        raise RuntimeError("LLM_API_KEY is not configured")

    from google import genai
    from google.genai import errors
    from google.genai import types

    prompt = "\n\n".join(
        f"{message.get('role', 'user').upper()}: {message.get('content', '')}"
        for message in messages
    )
    client = genai.Client(api_key=settings.llm_api_key)
    retry_count = max(0, settings.llm_max_retries)
    request_started = time.monotonic()
    for attempt in range(retry_count + 1):
        try:
            response = await asyncio.wait_for(
                client.aio.models.generate_content(
                    model=settings.llm_model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=settings.llm_temperature,
                        max_output_tokens=settings.llm_max_output_tokens,
                    ),
                ),
                timeout=settings.llm_timeout_seconds,
            )
            text = response.text
            if not text or not text.strip():
                raise RuntimeError("The configured LLM returned an empty response")
            return text.strip()
        except (errors.ServerError, TimeoutError, asyncio.TimeoutError, ConnectionError) as exc:
            if attempt >= retry_count:
                if isinstance(exc, (TimeoutError, asyncio.TimeoutError)):
                    logger.error(
                        "Gemini request timed out model=%s timeout_seconds=%s attempts=%s elapsed_seconds=%.1f",
                        settings.llm_model,
                        settings.llm_timeout_seconds,
                        attempt + 1,
                        time.monotonic() - request_started,
                    )
                raise
            delay_seconds = min(2**attempt + random.random(), 8)
            logger.warning(
                "Gemini temporary request failure model=%s type=%s provider_http_code=%s; retry %d/%d in %.1fs",
                settings.llm_model,
                type(exc).__name__,
                getattr(exc, "code", None),
                attempt + 1,
                retry_count,
                delay_seconds,
            )
            await asyncio.sleep(delay_seconds)

    raise RuntimeError("Gemini request failed after configured retries")
