// Enums
export enum ProductStatus {
  RAW = 1,
  IN_STOCK = 2,
  RESERVED = 3,
  DELETED = 4,
  SOLD = 5
}

// OEM Code
export interface OemCode {
  id: number;
  code: string;
  manufacturer?: string;
}

// Mileage Type
export interface MileageType {
  id: number;
  name: string;
  unit: string;
}

// Product Image
export interface ProductImage {
  id: number;
  image: string;
  product: number;
}

// Product Detail
export interface ProductDetail {
  id: number;
  height: number | null;
  width: number | null;
  length: number | null;
  weight: number | null;
  product: number;
}

// Product View
export interface ProductView {
  id: number;
  product: number;
  views_count: number;
}

// Main Product interface
export interface Product {
  id: number;
  name: string;
  code: number[];
  market_price: number | null;
  modification: number | null;
  category: number | null;
  color: number | null;
  properties: string | null;
  defect: string | null;
  comment: string | null;
  status: ProductStatus;
  mileage: number | null;
  mileageType: number | null;
  parent: number | null;
  warehouse: number | null;
  created_at: string;
  updated_at: string;
}

// Extended Product with related objects
export interface ProductDetailed extends Omit<Product, 'code' | 'modification' | 'category' | 'color' | 'mileageType' | 'parent' | 'warehouse'> {
  code: OemCode[];
  modification: any | null;
  category: any | null;
  color: any | null;
  mileageType: MileageType | null;
  parent: Product | null;
  warehouse: any | null;
  pictures: ProductImage[];
  view_data?: ProductView;
  detail?: ProductDetail;
  components: Product[];
}

// Feedback interface
export interface Feedback {
  id: number;
  name: string;
  phone: string;
  product: Product | null;
  created_at: Date;
  updated_at: Date;
  completed_at: Date | null;
}

// Feedback with detailed product
export interface FeedbackWithDetailedProduct extends Omit<Feedback, 'product'> {
  product: ProductDetailed | null;
}
