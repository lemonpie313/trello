import api from './api';

export const getCards = async (listId) => {
  const response = await api.get(`/lists/${listId}/cards`);
  return response.data;
};

export const createCard = async (listId, cardData) => {
  return api.post(`/lists/${listId}/cards`, cardData);
};
