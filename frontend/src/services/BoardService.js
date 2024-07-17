import api from './api';

export const getBoards = async () => {
  const response = await api.get('/boards');
  return response.data;
};

export const createBoard = async (boardData) => {
  return api.post('/boards', boardData);
};
