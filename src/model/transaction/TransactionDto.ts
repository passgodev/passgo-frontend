import ClientDto from '../client/ClientDto.ts';
import TransactionComponentDto from './TransactionComponentDto.ts';


interface TransactionDto {
	id: number,
	totalPrice: number,
	completedAt: Date,
	client: ClientDto,
	transactionComponents: TransactionComponentDto[]
}

export default TransactionDto;
