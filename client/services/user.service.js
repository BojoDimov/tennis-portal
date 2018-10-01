class UserService {
  isLogged() {
    return localStorage.getItem('token') != null;
  }

  isAdmin() {
    return true;
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.isAdmin)
      return true;
    else return false;
  }

  getUser() {
    let user = JSON.parse(localStorage.getItem('user'));
    let token = JSON.parse(localStorage.getItem('token'));
    if (user && token && new Date(token.expires) > new Date())
      return user;
    else return null;
  }

  login(token, user) {
    localStorage.setItem('token', JSON.stringify(token));
    localStorage.setItem('user', JSON.stringify(user));
    document.dispatchEvent(new CustomEvent('login', { detail: { user: user } }));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.dispatchEvent(new CustomEvent('logout'));
    return Promise.resolve();
  }
}

export default new UserService();