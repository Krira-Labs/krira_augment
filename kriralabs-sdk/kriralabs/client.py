"""HTTP client for interacting with the Kriralabs public API."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional

import requests
from requests import Response
from requests.exceptions import ConnectionError as RequestsConnectionError
from requests.exceptions import Timeout as RequestsTimeout

from .exceptions import (
    AuthenticationError,
    KriralabsError,
    PermissionDeniedError,
    RateLimitError,
    ServerError,
    TransportError,
)

DEFAULT_BASE_URL = "https://rag-python-backend.onrender.com/v1"
USER_AGENT = "kriralabs-sdk/0.1.0"


@dataclass(slots=True)
class ChatResponse:
    """Normalized response returned by ``Kriralabs.ask``."""

    answer: str
    bot_id: str
    conversation_id: Optional[str]
    raw: Dict[str, Any]


class Kriralabs:
    """Thin wrapper around the Kriralabs public chat API."""

    def __init__(
        self,
        *,
        api_key: str,
        bot_id: str,
        base_url: str | None = None,
        timeout: float = 15.0,
        session: Optional[requests.Session] = None,
    ) -> None:
        if not api_key or not api_key.strip():
            raise ValueError("api_key is required")
        if not bot_id or not bot_id.strip():
            raise ValueError("bot_id is required")
        if timeout <= 0:
            raise ValueError("timeout must be greater than zero")

        self.api_key = api_key.strip()
        self.bot_id = bot_id.strip()
        self.base_url = (base_url or DEFAULT_BASE_URL).rstrip("/")
        self.timeout = timeout
        self._session = session or requests.Session()
        self._session.headers.update({
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT,
        })

    def ask(
        self,
        question: str,
        *,
        conversation_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        timeout: Optional[float] = None,
    ) -> ChatResponse:
        """Send a user question to the chatbot and return the model answer."""

        if not question or not question.strip():
            raise ValueError("question must be a non-empty string")

        payload: Dict[str, Any] = {
            "bot_id": self.bot_id,
            "query": question.strip(),
        }
        if conversation_id:
            payload["conversation_id"] = conversation_id
        if metadata:
            payload["metadata"] = metadata

        response = self._post("/chat", payload, timeout or self.timeout)
        data = self._parse_response(response)
        answer = data.get("answer")
        if not isinstance(answer, str) or not answer:
            raise ServerError("Chat response payload is missing the 'answer' field")

        return ChatResponse(
            answer=answer,
            bot_id=data.get("bot_id", self.bot_id),
            conversation_id=data.get("conversation_id"),
            raw=data,
        )

    def close(self) -> None:
        """Close the underlying HTTP session."""

        self._session.close()

    # ---------------------------------------------------------------------
    # Internal helpers
    # ---------------------------------------------------------------------
    def _post(self, path: str, payload: Dict[str, Any], timeout: float) -> Response:
        url = f"{self.base_url}{path}"
        try:
            return self._session.post(url, json=payload, timeout=timeout)
        except RequestsTimeout as exc:  # pragma: no cover - network guard
            raise TransportError("Request to Kriralabs timed out") from exc
        except RequestsConnectionError as exc:  # pragma: no cover - network guard
            raise TransportError("Unable to reach Kriralabs API") from exc

    def _parse_response(self, response: Response) -> Dict[str, Any]:
        if response.status_code == 401:
            raise AuthenticationError("API key is invalid or has been revoked")
        if response.status_code == 403:
            raise PermissionDeniedError("API key lacks permission to access this bot")
        if response.status_code == 429:
            raise RateLimitError("API rate limit exceeded. Slow down your requests.")
        if 400 <= response.status_code < 500:
            raise KriralabsError(self._extract_error_message(response) or "Invalid request")
        if response.status_code >= 500:
            raise ServerError("Kriralabs service is temporarily unavailable")

        try:
            return response.json()
        except ValueError as exc:  # pragma: no cover - defensive
            raise ServerError("Received a non-JSON response from Kriralabs") from exc

    @staticmethod
    def _extract_error_message(response: Response) -> str:
        try:
            payload = response.json()
            if isinstance(payload, dict):
                return str(payload.get("message") or payload.get("detail") or "")
            return str(payload)
        except ValueError:
            return response.text.strip()


# Alternate export names for convenience.
KriraChatbot = Kriralabs
KriralabsClient = Kriralabs
