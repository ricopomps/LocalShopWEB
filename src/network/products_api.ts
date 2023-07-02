import { Product } from "../models/product";
import { API } from "./notes_api";

export async function fetchProducts(): Promise<Product[]> {
  const response = await API.get("/api/products", { withCredentials: true });
  return response.data;
}

export interface ProductInput {
  name: string;
  description?: string;
  image?: string;
  storeId: string;
}

export async function createProduct(product: ProductInput): Promise<Product> {
  const response = await API.post("/api/products", product);
  return response.data;
}

export async function updateProduct(
  productId: string,
  product: ProductInput
): Promise<Product> {
  const response = await API.patch(`/api/products/${productId}`, product);
  return response.data;
}

export async function deleteProduct(productId: string) {
  await API.delete(`/api/products/${productId}`);
}
