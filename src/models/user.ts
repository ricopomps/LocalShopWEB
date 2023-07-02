import { Store } from "./store";

export interface User {
  username: string;
  email: string;
  userType: UserType;
  store?: Store;
}

export enum UserType {
  shopper = "shopper",
  store = "lojista",
}
