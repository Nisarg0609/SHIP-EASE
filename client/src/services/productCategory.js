import apiClient from "./apiClient";

export async function getProductCategory(sort, page, limit) {
  return await apiClient.get(`productCategory/?sort=${sort}&page=${page}&limit=${limit}`);
}

export async function createProductCategory(data) {
  return await apiClient.post(`productCategory`, data);
}

export async function updateProductCategory(data, id) {
  return await apiClient.patch(`productCategory/${id}`, data);
}

export async function deleteProductCategory(id) {
  return await apiClient.delete(`productCategory/${id}`);
}

export async function getProductCategoryNames() {
  return await apiClient.get(`productCategory?fields=name`);
}

export async function getSubProductCategory() {
  return await apiClient.get(`productCategory/subCategories`);
}
