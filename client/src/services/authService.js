import apiClient from "./apiClient.js";

export async function login(data) {
  return await apiClient.post("auth/login", data);
}

export async function signup(data) {
  return await apiClient.post("auth/signup", data);
}

export async function getUser() {
  const res = await apiClient.get("user/getUser");
  return res.data;
}
