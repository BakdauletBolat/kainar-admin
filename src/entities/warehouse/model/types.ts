export interface Category {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  recar_category_id: number;
  parent: number | null;
}

export interface WarehouseList {
  id: string;
  name: string;
  min_stock_level: number;
  categories: Category[];
  city: {
    id: number;
    name: string;
  };
}
