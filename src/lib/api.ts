const API_BASE_URL = 'http://localhost:8080/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

export const api = {
  async request(endpoint: string, options: RequestOptions = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    if (options.data) {
      config.body = JSON.stringify(options.data);
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
        message: data.message || data || 'An error occurred',
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
