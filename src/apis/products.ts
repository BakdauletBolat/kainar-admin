import generateQuery from "@/shared/lib/generateQuery";
import axios from "@/shared/api/axios";
interface Category {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  recar_category_id: number;
  parent: number | null;
}

interface WarehouseCategory {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  recar_category_id: number;
  parent: number | null;
}

interface City {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  uid: string | null;
  country: number;
}

interface Warehouse {
  id: number;
  name: string;
  categories: WarehouseCategory[];
  city: City;
}

interface Detail {
  id: number;
  height: number;
  width: number;
  length: number;
  weight: number;
}

export interface Picture {
  id: number;
  image: string;
  product: number;
}

interface ModelCar {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  manufacturer: number;
}

interface EavAttributes {
  axleConfiguration: string;
  bodyType: string;
  capacity: string;
  driveType: string;
  engineDisplacement: string;
  fuelType: string;
  gearType: string;
  numberOfCycle: string;
  numberOfValves: string;
  power: string;
  steeringType: string;
  vinCode: string;
  modelCar: ModelCar;
}

export interface ProductDetail {
  id: number;
  price: number | null;
  color: string | null;
  category: Category;
  code: number[]; // Assuming the code is an array, adjust if necessary
  warehouse: Warehouse;
  detail: Detail;
  status: string;
  pictures: Picture[];
  eav_attributes: EavAttributes;
  created_at: string;
  updated_at: string;
  name: string;
  market_price: number | null;
  properties: any | null;
  defect: any | null;
  comment: any | null;
  mileage: number | null;
  modification: number;
  mileageType: any | null;
}

export interface ProductList {
  id: number;
  price: number;
  warehouse: {
    name: string;
    city: {
      name: string;
    };
  };
  color: null;
  category: {
    name: string;
  };
  modelCar: {
    name: string;
  };
  code: any[];
  detail: null;
  status: string;
  pictures: Picture[];
  created_at: Date;
  updated_at: Date;
  name: string;
  market_price: number;
  properties: null;
  defect: null;
  comment: null;
  mileage: null;
  mileageType: null;
}

export async function getProducts(options: object = {}) {
  const query = generateQuery(options);
  return await axios.get<{
    results: ProductList[];
    count: number;
  }>(`/api/admin/product/v2/product/${query}`);
}

export async function getProduct(id: string) {
  return await axios.get(`/api/admin/product/v2/${id}/product/`);
}
