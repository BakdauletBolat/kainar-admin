export interface Category {
  id: number;
  name: string;
  children?: Category[];
  products_count?: number;
}
