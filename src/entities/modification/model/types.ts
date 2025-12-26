interface Manufacturer {
  id: number;
  name: string;
  image: string | null;
}

interface ModelCar {
  id: number;
  manufacturer: Manufacturer;
  name: string;
  startDate?: string;
}

export interface Modification {
  axleConfiguration: null;
  image: string | null;
  bodyType: string;
  capacity: number;
  driveType: string;
  engineDisplacement: null;
  engines: any[];
  fuelType: string;
  gearType: null;
  id: number;
  modelCar: ModelCar;
  name: string;
  numberOfCycle: number;
  numberOfValves: number;
  power: number;
  steeringType: null;
  vinCode: number;
}
