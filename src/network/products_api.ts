import { Product } from "../models/product";
import { getApi } from "./api";

export async function fetchProducts(
  storeId: string,
  page: number,
  take?: number
): Promise<Product[]> {
  const response = await getApi().get(
    `/api/products?storeId=${storeId}&page=${page}&take=${take ?? 10}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export interface ProductInput {
  name: string;
  description?: string;
  image?: string;
  storeId: string;
}

export async function createProduct(product: ProductInput): Promise<Product> {
  const response = await getApi().post("/api/products", product);
  return response.data;
}

export async function updateProduct(
  productId: string,
  product: ProductInput
): Promise<Product> {
  const response = await getApi().patch(`/api/products/${productId}`, product);
  return response.data;
}

export async function deleteProduct(productId: string) {
  await getApi().delete(`/api/products/${productId}`);
}
