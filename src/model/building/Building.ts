import {Address} from "./Address.ts";
import {Sector} from "./Sector.ts";

export interface Building {
    name: string;
    address: Address;
    sectors: Sector[];
}