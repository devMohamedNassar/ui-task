export interface Product {
  brand: string;
  category: string;
  description: string;
  discountPercentage: number;
  id: number;
  images: string[];
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  title: string;
}

export interface Page {
  limit: number;
  skip: number;
  total: number;
  pageIndex: number;
  isLastPage: boolean;
} 