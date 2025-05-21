import {Status} from "../Status.ts";
import {Address} from "../building/Address.ts";

export interface DetailedEventDto {
    id: number;
    name: string;
    buildingName: string;
    address: Address;
    date: string;
    description: string;
    category: string;
    status: Status;
}
