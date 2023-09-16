export const getLocalStorage = (name) => {
  return localStorage.getItem(name);
};

export const setLocalStorage = (name, value) => {
  return localStorage.setItem(name, value);
};

export const clearLocalStorage = () => {
  return localStorage.clear();
};
