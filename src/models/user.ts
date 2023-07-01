export interface User {
  username: string;
  email: string;
  userType: UserType;
}

export enum UserType {
  shopper = "shopper",
  store = "lojista",
}
