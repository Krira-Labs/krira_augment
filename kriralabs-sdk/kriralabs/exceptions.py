"""Custom exceptions raised by the Kriralabs SDK."""

from __future__ import annotations


class KriralabsError(Exception):
    """Base exception for all SDK errors."""


class AuthenticationError(KriralabsError):
    """Raised when authentication with the Kriralabs API fails."""


class PermissionDeniedError(KriralabsError):
    """Raised when the API key lacks the required permissions."""


class RateLimitError(KriralabsError):
    """Raised when the API limits have been exceeded."""


class ServerError(KriralabsError):
    """Raised when the Kriralabs API encounters an internal problem."""


class TransportError(KriralabsError):
    """Raised when the HTTP client cannot reach the API endpoint."""
