import { Store } from "../models/store";
import { getApi } from "./api";

const baseUrl = "/api/stores";

export async function fetchStores(): Promise<Store[]> {
  const response = await getApi().get(baseUrl, { withCredentials: true });
  return response.data;
}

export interface StoreInput {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
}

export async function createStore(store: StoreInput): Promise<Store> {
  const response = await getApi().post(baseUrl, store);
  return response.data;
}

export async function updateStore(
  storeId: string,
  store: StoreInput
): Promise<Store> {
  const response = await getApi().patch(`${baseUrl}/${storeId}`, store);
  return response.data;
}

export async function deleteStore(storeId: string) {
  await getApi().delete(`${baseUrl}/${storeId}`);
}

export async function setSessionStoreId(storeId: string) {
  await getApi().patch(`${baseUrl}/session/${storeId}`);
}

export async function getStoreByLoggedUser(): Promise<Store> {
  const response = await getApi().get(`${baseUrl}/session`);
  return response.data;
}
