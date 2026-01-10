"""Custom exceptions raised by the Krira Augment SDK."""

from __future__ import annotations


class KriraAugmentError(Exception):
    """Base exception for all SDK errors."""


class AuthenticationError(KriraAugmentError):
    """Raised when authentication with the Krira Augment API fails."""


class PermissionDeniedError(KriraAugmentError):
    """Raised when the API key lacks the required permissions."""


class RateLimitError(KriraAugmentError):
    """Raised when the API limits have been exceeded."""


class ServerError(KriraAugmentError):
    """Raised when the Krira Augment API encounters an internal problem."""


class TransportError(KriraAugmentError):
    """Raised when the HTTP client cannot reach the API endpoint."""
