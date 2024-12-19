import apiClient from "./apiClient";

export async function getDeliveryStations(sort, page, limit) {
  return await apiClient.get(`deliveryStation/?sort=${sort}&page=${page}&limit=${limit}`);
}

export async function createDeliveryStation(data) {
  return await apiClient.post(`deliveryStation`, data);
}

export async function updateDeliveryStation(data, id) {
  return await apiClient.patch(`deliveryStation/${id}`, data);
}

export async function deleteDeliveryStation(id) {
  return await apiClient.delete(`deliveryStation/${id}`);
}

export async function getDeliveryStationNames() {
  return await apiClient.get(`deliveryStation?fields=name`);
}

export async function getUnassignedDeliveryStations() {
  return await apiClient.get(`deliveryStation/unassigned`);
}
