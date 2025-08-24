export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  features: string[];
  switches: string;
  layout: string;
  wireless: boolean;
  inStock: boolean;
}

export interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}
