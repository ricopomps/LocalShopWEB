export interface Historic {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  totalValue?: number;
}
