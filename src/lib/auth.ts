import md5 from 'md5';

const SUBSONIC_VERSION = '1.16.1';
const CLIENT_NAME = 'crosswalk-web';

export const buildAuthParams = (username: string, password: string): URLSearchParams => {
  const saltBytes = crypto.getRandomValues(new Uint8Array(8));
  const salt = Array.from(saltBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const token = md5(password + salt);

  return new URLSearchParams({
    u: username,
    t: token,
    s: salt,
    v: SUBSONIC_VERSION,
    c: CLIENT_NAME,
  });
}
