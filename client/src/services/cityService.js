import apiClient from "./apiClient";

export async function getCities(sort, page, limit) {
  return await apiClient.get(`city/?sort=${sort}&page=${page}&limit=${limit}`);
}

export async function getCityNames() {
  return await apiClient.get(`city/?fields=city`);
}

export async function createCity(data) {
  return await apiClient.post(`city`, data);
}

export async function updateCity(data, id) {
  return await apiClient.patch(`city/${id}`, data);
}

export async function deleteCity(id) {
  return await apiClient.delete(`city/${id}`);
}

export async function craetePincodes(data, id) {
  return await apiClient.patch(`city/${id}/pincodes`, data);
}
