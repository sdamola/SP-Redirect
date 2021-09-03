export const getCookie = (name: string) => {
  let cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    let [key, val] = cookie.trim().split("=");
    if (key === name) return val;
  }
  return null;
};

export const setCookie = (
  name: string,
  value: string,
  expiresInSeconds: number = 0,
  cookiePath: string
) => {
  let exp = new Date(Date.now() + expiresInSeconds * 1000);
  let expires = "; expires=" + exp.toUTCString();
  let path = cookiePath ? "; path=" + cookiePath : "";
  document.cookie = name + "=" + value + expires + path;
};

export const getCache = (name: string) => {
  let cache = getCookie(name);
  return cache ? JSON.parse(cache) : null;
};
