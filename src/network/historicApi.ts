import { Historic } from "../models/historic";
import { getApi } from "./api";

const baseUrl = "/api/shoppingListHistory";

export const getHistorics = async () : Promise<Historic[]> => {
  const response = await getApi().get(baseUrl);
  return response.data;
};

export const getHistoric = async (historicId: string) : Promise<Historic> => {
  const response = await getApi().get(`${baseUrl}/${historicId}`);
  return response.data;
};

