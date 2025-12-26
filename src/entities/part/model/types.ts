export interface Category {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  recar_category_id: number;
  parent: number | null;
}

export interface WarehouseCategory {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  recar_category_id: number;
  parent: number | null;
}

export interface City {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  uid: string | null;
  country: number;
}

export interface Warehouse {
  id: number;
  name: string;
  categories: WarehouseCategory[];
  city: City;
}

export interface Detail {
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

export interface ModelCar {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  manufacturer: number;
}

export interface EavAttributes {
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
  code: any[];
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
