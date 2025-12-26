export interface Manufacturer {
  id: number;
  name: string;
  image: string | null;
}

export interface ModelCar {
  id: number;
  manufacturer: Manufacturer;
  name: string;
  startDate?: string;
  endDate?: string;
}
