export interface ISelectOptions {
  value: string;
  label: string;
}

interface BodyType {
  id: number;
  name: string;
}

export interface IManufacturerType {
  id: number;
  name: string;
}

export interface ICarModelType {
  id: number;
  name: string;
}

interface FuelType {
  id: number;
  name: string;
}

interface DriveType {
  id: number;
  name: string;
}

interface GearType {
  id: number;
  name: string;
}

interface Color {
  id: number;
  name: string;
}

export interface ICarFiltersData {
  capacities: number[];
  body_types: BodyType[];
  fuel_types: FuelType[];
  drive_types: DriveType[];
  gear_types: GearType[];
  colors: Color[];
  powers: number[]
}


export interface IProduct {
  id: number;
  price: number;
  warehouse: {
    name: string,
    city: {
      name: string
    }
  };
  color: string | null;
  category: string;
  code: string[]; // Assuming code is an array of strings
  modification: Modification;
  detail: Detail;
  status: string;
  pictures: Picture[];
  created_at: string; // Using string for ISO date format
  updated_at: string; // Using string for ISO date format
  name: string;
  market_price: number | null;
  properties: any; // Adjust type as needed
  defect: any; // Adjust type as needed
  comment: any; // Adjust type as needed
  mileage: number | null;
  mileageType: any; // Adjust type as needed
}

interface Modification {
  id: number;
  axleConfiguration: string | null;
  engines: any[]; // Adjust type as needed
  driveType: string;
  gearType: string | null;
  fuelType: string;
  bodyType: string;
  modelCar: ModelCar;
  name: string;
  capacity: number;
  power: number;
  numberOfCycle: number;
  numberOfValves: number;
  vinCode: number;
}

interface ModelCar {
  id: number;
  name: string;
  startDate: string; // Using string for ISO date format
  endDate: string; // Using string for ISO date format
  manufacturer: number;
}

interface Detail {
  id: number;
  height: number;
  width: number;
  length: number;
  weight: number;
}

interface Picture {
  id: number;
  image: string;
  product: number;
}
