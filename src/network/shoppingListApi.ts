import { CellCoordinates } from "../components/Grid";
import { ProductItem } from "../context/ShoppingListContext";
import { getApi } from "./api";

export interface ShoppingList {
  storeId: string;
  products: ShoppingListProductItem[];
  totalValue?: number;
}

interface ShoppingListProductItem {
  product: string;
  quantity: number;
}
export interface ShoppingListReturn {
  storeId: string;
  products: ProductItem[];
  totalValue?: number;
}

const baseUrl = "/api/shoppinglist";

export const createShoppingList = async (shoppingList: ShoppingList) => {
  const response = await getApi().post(baseUrl, shoppingList);
  return response.data;
};

export const getShoppingList = async (
  storeId: string
): Promise<ShoppingListReturn> => {
  const response = await getApi().get(`${baseUrl}/${storeId}`);
  return response.data;
};

export const finishShoppingList = async (shoppingList: ShoppingList) => {
  await getApi().post(`${baseUrl}/finish`, shoppingList);
};

export const copyShoppingList = async (historicId: string) => {
  await getApi().post(`${baseUrl}/copy/${historicId}`);
};

export const getShoppingListPath = async (
  shoppingList: ShoppingList
): Promise<CellCoordinates[][]> => {
  const response = await getApi().post(`${baseUrl}/path`, shoppingList);
  return response.data;
};
