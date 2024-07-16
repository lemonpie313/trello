import api from './api';

export const getLists = async (boardId) => {
  const response = await api.get(`/boards/${boardId}/lists`);
  return response.data;
};

export const createList = async (boardId, listData) => {
  return api.post(`/boards/${boardId}/lists`, listData);
};
