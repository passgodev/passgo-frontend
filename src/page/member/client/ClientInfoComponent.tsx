import { Box } from '@mui/material';
import MemberInformationComponent from '../../../component/member/MemberInformationComponent.tsx';
import MemberTicketsComponent from '../../../component/member/MemberTicketsComponent.tsx';
import ClientDto from '../../../model/client/ClientDto.ts';
import MemberType from '../../../model/member/MemberType.ts';


const userMock = {
    firstName: 'Jan',
    lastName: 'Kowalski',
    role: MemberType[MemberType.CLIENT],
    age: 30,
    address: 'ul. Kwiatowa 15, 00-123 Warszawa',
    avatar: 'https://i.pravatar.cc/150?img=3',
    transactions: [
        { id: 'TXN123', amount: '150.00 PLN', date: '2024-05-10' },
        { id: 'TXN122', amount: '89.99 PLN', date: '2024-05-07' },
        { id: 'TXN121', amount: '240.50 PLN', date: '2024-05-01' },
    ],
};

interface ClientInfoPageProps {
    client: ClientDto
}

const ClientInfoComponent = ({ client }: ClientInfoPageProps) => {
    const user = {...userMock, ...client};
    
    console.log('ClientInfoComponent - informations of user', user);
    // console.log('ClientInfoComponent - informations of client', client);
    return (
        <Box>
            {/* Sekcja: O użytkowniku */}
            <MemberInformationComponent member={{...user}} />

            {/* Sekcja: Ostatnie transakcje */}
            {/* <LatestTransactionsComponent transactions={user.transactions} /> */}

            {/* Sekcja: Bilety */}
            {/* <div>{user.address}</div> */}
            <MemberTicketsComponent member={{...user}} />
        </Box>
    );
};
export default ClientInfoComponent;
