class TokenManager {
  constructor() {
    this.loadFromStorage();
  }

  setToken(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  getUser() {
    if (!this.user && localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
    return this.user;
  }

  updateUser(userData) {
    this.user = { ...this.user, ...userData };
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  clearToken() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.getToken() && !!this.getUser();
  }

  loadFromStorage() {
    this.token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;
  }

  getUserRole() {
    const user = this.getUser();
    return user?.role || 'user';
  }
}

// Create singleton instance
const tokenManager = new TokenManager();

export default tokenManager;