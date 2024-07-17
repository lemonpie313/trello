import api from './api';

export const signUp = async (userData) => {
  return api.post('/auth/sign-up', userData);
};

export const signIn = async (userData) => {
  return api.post('/auth/sign-in', userData);
};
