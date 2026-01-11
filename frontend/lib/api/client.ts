import { API_CONFIG, HTTP_STATUS, API_ENDPOINTS } from './config';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request configuration interface
interface RequestConfig extends RequestInit {
  timeout?: number;
  retry?: number;
  responseType?: 'json' | 'text' | 'blob';
}

// API Client class
class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private isRefreshing = false;
  private refreshSubscribers: ((success: boolean) => void)[] = [];

  constructor(baseURL: string, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
  }

  // Get access token from cookie
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }

  // Create fetch with timeout
  private async fetchWithTimeout(
    url: string,
    options: RequestConfig = {}
  ): Promise<Response> {
    const { timeout = this.defaultTimeout, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }
      throw error;
    }
  }

  // Retry logic
  private async fetchWithRetry(
    url: string,
    options: RequestConfig = {}
  ): Promise<Response> {
    const { retry = 0, ...fetchOptions } = options;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retry; attempt++) {
      try {
        return await this.fetchWithTimeout(url, fetchOptions);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown network error');
        if (attempt < retry) {
          await new Promise(resolve => 
            setTimeout(resolve, API_CONFIG.RETRY_DELAY * (attempt + 1))
          );
        }
      }
    }

    throw lastError ?? new Error('Unknown network error');
  }

  private onRefreshed(success: boolean) {
    this.refreshSubscribers.forEach(cb => cb(success));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(cb: (success: boolean) => void) {
    this.refreshSubscribers.push(cb);
  }

  // Main request method
  async request<T = unknown>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${this.baseURL}${endpoint}${separator}t=${Date.now()}`;
    const accessToken = this.getAccessToken();

    const headers: Record<string, string> = {
      ...((options.headers as Record<string, string>) || {}),
    };

    // Only set Content-Type if it's not FormData (browser sets it with boundary for FormData)
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const config: RequestConfig = {
      ...options,
      headers,
      credentials: 'include', // Include cookies
      cache: 'no-store', // Prevent browser caching
    };

    try {
      const response = await this.fetchWithRetry(url, config);

      // Handle blob responses (file downloads)
      if (options.responseType === 'blob') {
        if (!response.ok) {
          // Try to read error as json/text if possible
          const errorText = await response.text();
          let errorData;
          try { errorData = JSON.parse(errorText); } catch { errorData = { message: errorText }; }
          throw new ApiError(response.status, errorData.message || 'An error occurred', errorData);
        }
        return (await response.blob()) as unknown as T;
      }

      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data: unknown;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Handle error responses
      if (!response.ok) {
        let errorMessage = 'An error occurred';
        if (typeof data === 'object' && data !== null && 'message' in data) {
          const messageValue = (data as { message?: unknown }).message;
          if (typeof messageValue === 'string') {
            errorMessage = messageValue;
          }
        }

        throw new ApiError(
          response.status,
          errorMessage,
          data
        );
      }

      return data as T;
    } catch (error: unknown) {
      // Handle 401 Unauthorized (Token Expired or Missing)
      if (
        error instanceof ApiError && 
        error.status === 401 && 
        endpoint !== API_ENDPOINTS.AUTH.REFRESH_TOKEN &&
        endpoint !== API_ENDPOINTS.AUTH.LOGIN &&
        endpoint !== API_ENDPOINTS.AUTH.LOGOUT &&
        endpoint !== API_ENDPOINTS.AUTH.FORGOT_PASSWORD &&
        !endpoint.startsWith('/auth/resetpassword/')
      ) {
        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.addRefreshSubscriber((success) => {
              if (success) {
                resolve(this.request(endpoint, options));
              } else {
                reject(error);
              }
            });
          });
        }

        this.isRefreshing = true;

        try {
          // Call refresh endpoint
          await this.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
          this.isRefreshing = false;
          this.onRefreshed(true);
          // Retry original request
          return this.request(endpoint, options);
        } catch (refreshError) {
          this.isRefreshing = false;
          this.onRefreshed(false);
          // Only log critical errors, not expected 401s during refresh (which just mean session expired)
          if (!(refreshError instanceof ApiError) || refreshError.status !== 401) {
            console.error('Token refresh failed:', refreshError);
          }
          
          // Dispatch unauthorized event for AuthContext to handle logout
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth:unauthorized'));
          }

          // If refresh fails, user needs to login again.
          // We throw the original error to let the caller handle logout/redirect
          throw error;
        }
      }

      // Handle network errors
      if (error instanceof ApiError) {
        throw error;
      }

      const fallbackMessage = error instanceof Error ? error.message : 'Network error occurred';
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        fallbackMessage
      );
    }
  }

  // GET request
  async get<T = unknown>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  // POST request
  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestConfig
  ): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
    });
  }

  // PUT request
  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestConfig
  ): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
    });
  }

  // PATCH request
  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestConfig
  ): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
    });
  }

  // DELETE request
  async delete<T = unknown>(
    endpoint: string,
    options?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);
