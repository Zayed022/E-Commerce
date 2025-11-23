export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number; // backend returns number now
  createdAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user: User;
  total: number;
  status: string;
  address: string;
  items: OrderItem[];
  createdAt: string;
}
