export interface User {
  username: string;
  email: string;
  userType: UserType;
  storeId?: string;
}

export enum UserType {
  shopper = "shopper",
  store = "lojista",
}
