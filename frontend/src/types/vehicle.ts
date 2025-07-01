export interface IVehicleImage {
  url: string;
  publicId: string;
  key: string;
  order: number;
  isMain: boolean;
}

export interface IVehicle {
  _id?: string;
  title: string;
  price: number;
  priceCurrency: string;
  description: string;
  make: string;
  model: string;
  year: number;
  mileage: string;
  mileageUnit: string;
  vin?: string;
  bodyType?: string;
  color?: string;
  fuelType?: string;
  vehicleSeatingCapacity?: string;
  vehicleTransmission?: string;
  carFeature: string[];
  carSafetyFeature: string[];
  images: IVehicleImage[];
  stockNumber?: string;
  driveType?: string;
  engineType?: string;
  engineCapacity?: string;
  interiorColor?: string;
  doors?: string;
  condition?: string;
  month?: string;
  location?: string;
  isFeatured: boolean;
  section?: string;
  offerType: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
} 