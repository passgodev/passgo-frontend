import {GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import MemberListComponent from '../../component/member/MemberListComponent.tsx';
import MemberType from '../../model/member/MemberType.ts';
import OrganizerDto from '../../model/organizer/OrganizerDto.ts';
import useInterceptedFetch from '../../hook/useInterceptedFetch.ts';
import { useState } from 'react';
import {Typography, Button, Box} from "@mui/material";
import ApiEndpoint from "../../util/endpoint/ApiEndpoint.ts";
import dayjs from 'dayjs';

const AdminClientListPage = () => {
    const fetch = useInterceptedFetch();
    const [refreshKey, setRefreshKey] = useState(0);

    const approveOrganizer = (id: number) => {
        fetch({
            endpoint: ApiEndpoint.activateOrganizer.replace(":id", id.toString()),
            reqInit: { method: "PATCH" },
        }).then(() => setRefreshKey(prev => prev + 1));
    };

    const organizerColumns: GridColDef<OrganizerDto>[] = [
        {
            field: 'id', headerName: 'ID', width: 60
        },
        {
            field: 'firstName',
            headerName: 'First Name',
            width: 140,
        },
        {
            field: 'lastName',
            headerName: 'Last Name',
            width: 140,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 140,
        },
        {
            field: 'registrationDate',
            headerName: 'Registration Date',
            width: 140,
            valueFormatter: (params: any) => dayjs(params.value).format('YYYY-MM-DD HH:mm')
        },
        {
            field: 'birthDate',
            headerName: 'Birth Date',
            width: 130,
        },
        {
            field: 'isActive',
            headerName: 'Is active?',
            width: 80,
        },
        {
            field: 'organizationName',
            headerName: 'Organization Name',
            width: 150,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 130,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams<OrganizerDto>) => {
                const organizer = params.row;
                return (
                    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
                        {!organizer.isActive ? (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => approveOrganizer(organizer.id)}
                            >
                                Approve
                            </Button>
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                Active
                            </Typography>
                        )}
                    </Box>
                )
            }
        }
    ];

    return (
        <MemberListComponent<OrganizerDto> memberType={MemberType.ORGANIZER} columns={organizerColumns} refreshKey={refreshKey}  />
    );
};
export default AdminClientListPage;
