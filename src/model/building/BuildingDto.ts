import {Address} from "./Address.ts";
import { Status } from "../Status.ts";
import {SectorDto} from "./SectorDto.ts";

export interface BuildingDto {
    id: number;
    name: string;
    address: Address;
    sectors: SectorDto[];
    status: Status;
}