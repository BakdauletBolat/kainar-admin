interface AxleConfiguration {
  id: number;
  name: string;
}

interface BodyType {
  id: number;
  name: string;
}

interface DriveType {
  id: number;
  name: string;
}

interface FuelType {
  id: number;
  name: string;
}

interface GearType {
  id: number;
  name: string;
}

interface SteeringType {
  id: number;
  name: string;
}

export interface CarFilterData {
  axleConfiguration: AxleConfiguration[];
  bodyType: BodyType[];
  capacity: number[];
  driveType: DriveType[];
  engineDisplacement: number[];
  fuelType: FuelType[];
  gearType: GearType[];
  numberOfCycle: number[];
  numberOfValves: number[];
  power: number[];
  steeringType: SteeringType[];
  vinCode: number[];
}

export interface FilterValues {
  search: string | null;
  category: string | null;
  modification: string | null;
  modelCar: string | null;
  manufacturer: number | null;
  axleConfiguration: number | null;
  bodyType: number | null;
  capacity: number | null;
  driveType: number | null;
  engineDisplacement: number | null;
  fuelType: number | null;
  gearType: number | null;
  numberOfCycle: number | null;
  numberOfValves: number | null;
  power: number | null;
  steeringType: number | null;
  vinCode: number | null;
  warehouse_id: number | null;
}
