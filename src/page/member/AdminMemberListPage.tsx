import { GridColDef } from '@mui/x-data-grid';
import MemberListComponent from '../../component/member/MemberListComponent.tsx';
import ClientDto from '../../model/client/ClientDto.ts';
import MemberType from '../../model/member/MemberType.ts';
import OrganizerDto from '../../model/organizer/OrganizerDto.ts';

const clientColumns: GridColDef<ClientDto>[] = [
    {
        field: 'id', headerName: 'ID', width: 90
    },
    {
        field: 'firstName',
        headerName: 'First Name',
        width: 150,
    },
    {
        field: 'lastName',
        headerName: 'Last Name',
        width: 150,
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 150,
    },
    {
        field: 'registrationDate',
        headerName: 'Registration Date',
        width: 150,
    },
    {
        field: 'birthDate',
        headerName: 'Birth Date',
        width: 150,
    },
    {
        field: 'isActive',
        headerName: 'Is active?',
        width: 150,
    },
];

const organizerColumns: GridColDef<OrganizerDto>[] = [
    {
        field: 'id', headerName: 'ID', width: 90
    },
    {
        field: 'firstName',
        headerName: 'First Name',
        width: 150,
    },
    {
        field: 'lastName',
        headerName: 'Last Name',
        width: 150,
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 150,
    },
    {
        field: 'registrationDate',
        headerName: 'Registration Date',
        width: 150,
    },
    {
        field: 'birthDate',
        headerName: 'Birth Date',
        width: 150,
    },
    {
        field: 'isActive',
        headerName: 'Is active?',
        width: 150,
    },
    {
        field: 'organizationName',
        headerName: 'Organization Name',
        width: 150,
    }
];

const AdminMemberListPage = () => {
    return (
        <>
            <MemberListComponent<ClientDto> memberType={MemberType.CLIENT} columns={clientColumns} />
            <MemberListComponent<OrganizerDto> memberType={MemberType.ORGANIZER} columns={organizerColumns} />
        </>
    );
};
export default AdminMemberListPage;
