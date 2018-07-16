export function isLogged() {
  return localStorage.getItem('token') != null;
}

export function isAdmin() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user.isAdmin)
    return true;
  else return false;
}

export function getUser() {
  return JSON.parse(localStorage.getItem('user'));
}

export function login(token, user) {
  localStorage.setItem('token', JSON.stringify(token));
  localStorage.setItem('user', JSON.stringify(user));
  document.dispatchEvent(new CustomEvent('login', { detail: { user: user } }));
}

export function logout() {
  console.log('logging out');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.dispatchEvent(new CustomEvent('logout'));
  return Promise.resolve();
}