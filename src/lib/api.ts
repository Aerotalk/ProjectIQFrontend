const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface RequestOptions extends RequestInit {
  data?: any;
  responseType?: 'text' | 'json' | 'blob' | 'arraybuffer';
}

export const api = {
  async request(endpoint: string, options: RequestOptions = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!(options.data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Ensure cookies are sent and received
    };

    if (options.data) {
      if (options.data instanceof FormData) {
        config.body = options.data;
      } else {
        config.body = JSON.stringify(options.data);
      }
    }

    let response = await fetch(url, config);

    // If 401 and we are not already trying to refresh or log in
    if (response.status === 401 && !endpoint.includes('/auth/')) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include', // Send refresh token cookie
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (refreshResponse.ok) {
          // Token refreshed, retry original request
          response = await fetch(url, config);
        } else {
          // Refresh failed, clear user context
          window.location.href = '/login';
        }
      } catch (err) {
        window.location.href = '/login';
      }
    }

    if (options.responseType === 'blob') {
      return await response.blob();
    }

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      data = text;
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: typeof data === 'string' ? data : (data?.message || data?.error || 'An error occurred'),
      };
    }

    return data;
  },

  get(endpoint: string, options?: RequestOptions) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint: string, data?: any, options?: RequestOptions) {
    return this.request(endpoint, { ...options, method: 'POST', data });
  },

  put(endpoint: string, data?: any, options?: RequestOptions) {
    return this.request(endpoint, { ...options, method: 'PUT', data });
  },

  delete(endpoint: string, options?: RequestOptions) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};
