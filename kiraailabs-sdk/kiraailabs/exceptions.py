"""Custom exceptions raised by the Kiraailabs SDK."""

from __future__ import annotations


class KiraailabsError(Exception):
    """Base exception for all SDK errors."""


class AuthenticationError(KiraailabsError):
    """Raised when authentication with the Kiraailabs API fails."""


class PermissionDeniedError(KiraailabsError):
    """Raised when the API key lacks the required permissions."""


class RateLimitError(KiraailabsError):
    """Raised when the API limits have been exceeded."""


class ServerError(KiraailabsError):
    """Raised when the Kiraailabs API encounters an internal problem."""


class TransportError(KiraailabsError):
    """Raised when the HTTP client cannot reach the API endpoint."""
