export interface UserSummary {
  id: number;
  name: string;
  username: string;
  role: "ADMIN" | "SELLER";
}

export interface Order {
  id?: number;
  customerName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  mumColor: string;
  quantity: number;
  totalPrice?: number;
  status?: string;
  user?: UserSummary;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  customerName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  mumColor: string;
  quantity: number;
}
