// Token management utility to replace localStorage
class TokenManager {
  constructor() {
    this.token = null;
    this.user = null;
  }

  // Set token and user data
  setToken(token, user) {
    this.token = token;
    this.user = user;
  }

  // Get token
  getToken() {
    return this.token;
  }

  // Get user data
  getUser() {
    return this.user;
  }

  // Update user data
  updateUser(userData) {
    this.user = { ...this.user, ...userData };
  }

  // Clear token and user
  clearToken() {
    this.token = null;
    this.user = null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.token !== null && this.user !== null;
  }
}

// Create singleton instance
const tokenManager = new TokenManager();

export default tokenManager;