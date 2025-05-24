import { Box } from '@mui/material';
import MemberInformationComponent from '../../../component/member/MemberInformationComponent.tsx';
import MemberTicketsComponent from '../../../component/member/MemberTicketsComponent.tsx';
import ClientDto from '../../../model/client/ClientDto.ts';
import MemberType from '../../../model/member/MemberType.ts';
import LatestTransactionsComponent from '../../../component/transaction/LatestTransactionsComponent.tsx';


const userMock = {
    role: MemberType[MemberType.CLIENT],
};

interface ClientInfoPageProps {
    client: ClientDto
}

const ClientInfoComponent = ({ client }: ClientInfoPageProps) => {
    const user = {...userMock, ...client}
    console.log('ClientInfoComponent - informations of user DUOA', user);

    return (
        <Box>
            {/* Sekcja: O użytkowniku */}
            <MemberInformationComponent member={user} />

            {/* Sekcja: Ostatnie transakcje */}
            <LatestTransactionsComponent member={user} />

            {/* Sekcja: Bilety */}
            <MemberTicketsComponent member={user} />
        </Box>
    );
};
export default ClientInfoComponent;
