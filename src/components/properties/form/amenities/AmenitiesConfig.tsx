
import { 
  Wifi, 
  AirVent, 
  Flame, 
  Tv, 
  BedDouble, 
  ParkingSquare,
  Utensils,
  Building,
  Waves
} from "lucide-react";
import { FormValues } from "../PropertyFormSchema";

export interface AmenityConfig {
  name: keyof FormValues;
  label: string;
  icon: typeof Wifi;
}

export const amenitiesConfig: AmenityConfig[] = [
  {
    name: "wifi",
    label: "WiFi",
    icon: Wifi
  },
  {
    name: "kitchen",
    label: "Kitchen",
    icon: Utensils
  },
  {
    name: "ac",
    label: "Air Conditioning",
    icon: AirVent
  },
  {
    name: "heating",
    label: "Heating",
    icon: Flame
  },
  {
    name: "tv",
    label: "TV",
    icon: Tv
  },
  {
    name: "washer",
    label: "Washer",
    icon: BedDouble
  },
  {
    name: "dryer",
    label: "Dryer",
    icon: BedDouble
  },
  {
    name: "parking",
    label: "Parking",
    icon: ParkingSquare
  },
  {
    name: "elevator",
    label: "Elevator",
    icon: Building
  },
  {
    name: "pool",
    label: "Pool",
    icon: Waves
  }
];
