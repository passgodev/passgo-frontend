import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import MemberInformationComponent from '../../../component/member/MemberInformationComponent.tsx';
import LatestTransactionsComponent from '../../../component/transaction/LatestTransactionsComponent.tsx';


const user = {
    firstName: 'Jan',
    lastName: 'Kowalski',
    role: 'administrator',
    age: 30,
    address: 'ul. Kwiatowa 15, 00-123 Warszawa',
    avatar: 'https://i.pravatar.cc/150?img=3',
    transactions: [
        { id: 'TXN123', amount: '150.00 PLN', date: '2024-05-10' },
        { id: 'TXN122', amount: '89.99 PLN', date: '2024-05-07' },
        { id: 'TXN121', amount: '240.50 PLN', date: '2024-05-01' },
    ],
};

const ClientInfoPage = () => {
    const params = useParams();

    console.log('client info page params', params);

    return (
        <Box>
            {/* Sekcja: O użytkowniku */}
            <MemberInformationComponent member={{...user}} />

            {/* Sekcja: Ostatnie transakcje */}
            <LatestTransactionsComponent transactions={user.transactions} />
        </Box>
    );
};
export default ClientInfoPage;
