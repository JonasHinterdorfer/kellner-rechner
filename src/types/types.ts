export type ProductOption = {
  name: string;
  price: number;
  color?: string; // Optional color for this specific option
};

export type Product = {
  id: string;
  name: string;
  basePrice: number;
  options?: ProductOption[];
  color?: string; // Optional color code for background highlight
};

export type ProductsData = {
  food: Product[];
  drinks: Product[];
};

export type CartItem = {
  productId: string;
  productName: string;
  selectedOption: ProductOption;
  quantity: number;
  category: 'food' | 'drinks';
};
