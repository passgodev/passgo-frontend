import {Address} from "./Address.ts";
import {Sector} from "./Sector.ts";
import { BuildingStatus } from "./BuildingStatus.ts";

export interface BuildingDto {
    id: number;
    name: string;
    address: Address;
    sectors: Sector[];
    status: BuildingStatus;
}