import { CellCoordinates } from "../components/Grid";
import { Product } from "../models/product";
import { getApi } from "./api";

const baseUrl = "/api/products";

export async function fetchProducts(
  storeId: string,
  page: number,
  take?: number
): Promise<Product[]> {
  const response = await getApi().get(
    `${baseUrl}?storeId=${storeId}&page=${page}&take=${take ?? 10}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export interface ProductInput {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  category: string;
  storeId: string;
  location?: CellCoordinates;
}

export async function createProduct(product: ProductInput): Promise<Product> {
  const response = await getApi().post(baseUrl, product);
  return response.data;
}

export async function updateProduct(
  productId: string,
  product: ProductInput
): Promise<Product> {
  const response = await getApi().patch(`${baseUrl}/${productId}`, product);
  return response.data;
}

export async function deleteProduct(productId: string) {
  await getApi().delete(`${baseUrl}/${productId}`);
}

export async function getCategories() {
  const response = await getApi().get(`${baseUrl}/categories`);
  return response.data;
}

export async function getProductList(): Promise<
  { _id: string; name: string }[]
> {
  const response = await getApi().get(`${baseUrl}/list`);
  return response.data;
}

export async function getProduct(productId: string): Promise<Product> {
  const response = await getApi().get(`${baseUrl}/${productId}`);
  return response.data;
}
