import cookie from 'js-cookie';

export const setCookie = (key, value) => {
  cookie.set(key, value, {
    expires: 1,
    path: '/',
  });
};

export const removeCookie = key => {
  cookie.remove(key, {
    expires: 1,
  });
};

export const getCookie = key => {
  return cookie.get(key);
};