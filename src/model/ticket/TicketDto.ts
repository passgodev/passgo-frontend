import ClientDto from '../client/ClientDto.ts';
import EventDto from '../event/EventDto.ts';


interface TicketDto {
    id: number,
    price: number,
    event: EventDto,
    sectorId: number,
    rowId: number,
    seatId: number,
    standingArea: boolean,
    client: ClientDto
}

export default TicketDto;