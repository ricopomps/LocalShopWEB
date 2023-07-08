import { Store } from "../models/store";
import { API } from "./api";

export async function fetchStores(): Promise<Store[]> {
  const response = await API.get("/api/stores", { withCredentials: true });
  return response.data;
}

export interface StoreInput {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
}

export async function createStore(store: StoreInput): Promise<Store> {
  const response = await API.post("/api/stores", store);
  return response.data;
}

export async function updateStore(
  storeId: string,
  store: StoreInput
): Promise<Store> {
  const response = await API.patch(`/api/stores/${storeId}`, store);
  return response.data;
}

export async function deleteStore(storeId: string) {
  await API.delete(`/api/stores/${storeId}`);
}

export async function setSessionStoreId(storeId: string) {
  await API.patch(`/api/stores/session/${storeId}`);
}

export async function getStoreByLoggedUser(): Promise<Store> {
  const response = await API.get("/api/stores/session/");
  return response.data;
}
