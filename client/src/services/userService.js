import apiClient from "./apiClient";

export async function getUsers(sort, page, limit, filter) {
  return await apiClient.get(
    `user/?${filter && `role=${filter}`}&sort=${sort}&page=${page}&limit=${limit}`
  );
}

export async function createUser(data) {
  return await apiClient.post(`user/manager`, data);
}

export async function updateUser(data, id) {
  return await apiClient.patch(`user/${id}/manager`, data);
}

export async function deleteUser(id) {
  return await apiClient.delete(`user/${id}`);
}
