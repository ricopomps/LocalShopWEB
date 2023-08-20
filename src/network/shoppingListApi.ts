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

const baseUrl = "/api/shoppinglist";

export const createShoppingList = async (shoppingList: ShoppingList) => {
  const response = await getApi().post(baseUrl, shoppingList);
  return response.data;
};

export const getShoppingList = async (
  storeId: string
): Promise<ShoppingList> => {
  const response = await getApi().get(`${baseUrl}/${storeId}`);
  return response.data;
};
