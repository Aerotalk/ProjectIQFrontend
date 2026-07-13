const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface RequestOptions extends RequestInit {
  data?: any;
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

    const token = localStorage.getItem('token');
    if (token && !endpoint.startsWith('/auth')) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    if (options.data) {
      if (options.data instanceof FormData) {
        config.body = options.data;
      } else {
        config.body = JSON.stringify(options.data);
      }
    }

    const response = await fetch(url, config);
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
