import apiClient from "./apiClient";

export async function getWarehouses(sort, page, limit) {
  return await apiClient.get(`warehouse/?sort=${sort}&page=${page}&limit=${limit}`);
}

export async function createWarehouse(data) {
  return await apiClient.post(`warehouse`, data);
}

export async function updateWarehouse(data, id) {
  return await apiClient.patch(`warehouse/${id}`, data);
}

export async function deleteWarehouse(id) {
  return await apiClient.delete(`warehouse/${id}`);
}

export async function getUnassignedCities() {
  return await apiClient.get(`warehouse/unassigedCities`);
}

export async function addTransportCities(data, id) {
  return await apiClient.patch(`warehouse/${id}/addTransportCities`, data);
}

export async function getWarehouseNames() {
  return await apiClient.get(`warehouse?fields=name`);
}

export async function getUnassignedWarehouses() {
  return await apiClient.get(`warehouse/unassigned`);
}
