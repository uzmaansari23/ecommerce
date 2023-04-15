const user = "user";

export const setToken = token => {
  localStorage.setItem(user, token);
};

export const getToken = () => {
  return localStorage.getItem(user);
};

export const removeToken = () => {
  localStorage.removeItem(user);
};