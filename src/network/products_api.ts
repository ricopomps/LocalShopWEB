import { Product } from "../models/product";
import { User } from "../models/user";
import { API } from "./notes_api";
const { REACT_APP_API_BASE_URL: baseUrl } = process.env;

//USER ROUTES

export async function getLoggedInUser(): Promise<User> {
  const response = await API.get("/api/users");
  return response.data;
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await API.post("/api/users/signup", credentials);
  return response.data;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await API.post("/api/users/login", credentials);
  return response.data;
}

export async function logout() {
  await API.post("/api/users/logout");
}

//NOTES ROUTES
export async function fetchProducts(): Promise<Product[]> {
  const response = await API.get("/api/products", { withCredentials: true });
  return response.data;
}

export interface ProductInput {
  name: string;
  description?: string;
  image?: string;
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
