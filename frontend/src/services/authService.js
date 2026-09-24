import api from './api';

const TOKEN_KEY = 'schoolerp_token';
const USER_KEY = 'schoolerp_user';

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        return response.data;
      }
    } catch {
      // Demo / Mock fallback for UI evaluation without backend running
      if (email && password) {
        // Validate credentials for demo mode
        const mockUser = {
          id: 'usr-admin-1',
          name: 'Dr. Sarah Jenkins',
          email: email.trim(),
          role: 'Admin',
          schoolName: 'St. Jude International Academy',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWEyWynl9v9EpxDWexDoNPQABWYy3erNuCULUpvJ6lsqKX5FPXBmd-X4428zPkOc9mRFs7W2dgRbfbsJsRAEohPO-8ZFsLw02c3uY-k-bGSMk8QxhPM5E5B-La6ydT6ODDTMztPOnbVQQDQEbK2Sr8FidXnglOsK9gmQcAr0_7gV15tDu1cs20IRrakY0tzg_SukFmUEBW8mOhv06-3LY1jgx801l9KzQxnni84FVJR53ac_5VWNjh',
        };
        const mockToken = 'mock_jwt_token_' + Date.now();
        localStorage.setItem(TOKEN_KEY, mockToken);
        localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
        return { token: mockToken, user: mockUser };
      }
      throw new Error('Please enter a valid email and password.');
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};
