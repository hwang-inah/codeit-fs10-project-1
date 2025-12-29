import CryptoJS from 'crypto-js';

export const encryptPassword = (password) => {
  if (!password) return '';
  return CryptoJS.SHA256(password).toString();
};

