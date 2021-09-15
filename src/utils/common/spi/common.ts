function getLocalStorage(name: string): Any {
  return window.localStorage.getItem(name);
}

function setLocalStorage(name: string, value: Any): Any {
  return window.localStorage.setItem(name, value);
}

function removeItemFromLocalStorage(name: string): Any {
  return window.localStorage.removeItem(name);
}

export { getLocalStorage, setLocalStorage, removeItemFromLocalStorage };
