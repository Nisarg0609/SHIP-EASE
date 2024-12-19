import apiClient from "./apiClient";

export async function getVehicles(sort, page, limit) {
  return await apiClient.get(`vehicle/?sort=${sort}&page=${page}&limit=${limit}`);
}

export async function createVehicle(data) {
  return await apiClient.post(`vehicle`, data);
}

export async function updateVehicle(data, id) {
  return await apiClient.patch(`vehicle/${id}`, data);
}

export async function deleteVehicle(id) {
  return await apiClient.delete(`vehicle/${id}`);
}
