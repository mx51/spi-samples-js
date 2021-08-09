function getLocalStorage(name: string): Any {
  return window.localStorage.getItem(name);
}

function setLocalStorage(name: string, value: string): Any {
  return window.localStorage.setItem(name, value);
}

export { getLocalStorage, setLocalStorage };
