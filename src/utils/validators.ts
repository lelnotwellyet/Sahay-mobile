export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isValidLicense = (license: string): boolean => {
  return license.length >= 5;
};

export const isValidPhone = (phone: string): boolean => {
  return /^\+?[\d\s-]{10,}$/.test(phone);
};