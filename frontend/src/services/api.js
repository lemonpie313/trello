import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const getBoard = async (boardId) => {
  const response = await axios.get(`${API_BASE_URL}/boards/${boardId}`);
  return response.data;
};

export const createCard = async (boardId, cardData) => {
  const response = await axios.post(`${API_BASE_URL}/boards/${boardId}/cards`, cardData);
  return response.data;
};

export const updateCard = async (boardId, cardId, cardData) => {
  const response = await axios.put(`${API_BASE_URL}/boards/${boardId}/cards/${cardId}`, cardData);
  return response.data;
};

export const deleteCard = async (boardId, cardId) => {
  const response = await axios.delete(`${API_BASE_URL}/boards/${boardId}/cards/${cardId}`);
  return response.data;
};
