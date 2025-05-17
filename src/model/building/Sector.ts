import {Row} from "./Row.ts";

export interface Sector {
    name: string;
    standingArea: boolean;
    rows: Row[];
}