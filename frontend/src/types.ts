export type Category = 'Skincare' | 'Makeup' | 'Fragrance' | 'Haircare';

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
  badge?: 'Bestseller' | 'New' | 'Limited';
}

export interface CartItem {
  product: Product;
  quantity: number;
}
