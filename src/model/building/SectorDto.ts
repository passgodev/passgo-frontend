import { RowDto } from "./RowDto";

export interface SectorDto {
    name: string;
    standingArea: boolean;
    rows: RowDto[];
}