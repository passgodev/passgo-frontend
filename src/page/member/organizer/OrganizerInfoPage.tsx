import { Box } from '@mui/material';
import MemberInformationComponent from '../../../component/member/MemberInformationComponent.tsx';
import MemberType from '../../../model/member/MemberType.ts';
import OrganizerDto from '../../../model/organizer/OrganizerDto.ts';


const organizerMock = {
    firstName: 'Adam',
    lastName: 'Nowak',
    role: MemberType[MemberType.ORGANIZER],
    age: 30,
    address: 'ul. Kwiatowa 15, 00-123 Warszawa',
    avatar: 'https://i.pravatar.cc/150?img=3',
};

interface OrganizerInfoPageProps {
    organizer: OrganizerDto
}

const OrganizerInfoPage = ({ organizer }: OrganizerInfoPageProps) => {
    const user = {...organizerMock, ...organizer};
    console.log('ClientInfoComponent - informations of user', user);

    return (
        <Box>
            {/* Sekcja: O użytkowniku */}
            <MemberInformationComponent member={{...user}} />
        </Box>
    );
};
export default OrganizerInfoPage;
