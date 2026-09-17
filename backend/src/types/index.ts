// Domain types — mirror the frontend interfaces exactly.
// When Azure SQL is connected, these map to table rows.

export type Category = 'Skincare' | 'Makeup' | 'Fragrance' | 'Haircare';
export type Badge = 'Bestseller' | 'New' | 'Limited';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  description: string;
  ingredients: string;
  badge?: Badge;
}

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string | null;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
}

export interface OrderShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  email: string;
  items: OrderItem[];
  shippingAddress: OrderShippingAddress;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

// Public-safe user (no password hash)
export interface UserPublic {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface AuthToken {
  token: string;
  user: UserPublic;
}
