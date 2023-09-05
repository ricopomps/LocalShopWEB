import { Historic } from "../models/historic";
import { getApi } from "./api";

const baseUrl = "/api/shoppingListHistory";

export const getHistorics = async () : Promise<Historic[]> => {
  const response = await getApi().get(baseUrl);
  return response.data;
};
