import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationInitialState, GridValidRowModel } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import useInterceptedFetch from '../../hook/useInterceptedFetch.ts';
import MemberType from '../../model/member/MemberType.ts';
import API_ENDPOINTS from '../../util/endpoint/ApiEndpoint.ts';
import { Paginated } from '../../util/pagination/Paginated.ts';


interface MemberListComponentProps<T extends GridValidRowModel> {
    memberType: MemberType,
    columns: GridColDef<T>[]
}

const MemberListComponent = <T extends GridValidRowModel,> ({memberType, columns}: MemberListComponentProps<T>) => {
    const interceptedFetch = useInterceptedFetch();
    const [paginatedMembers, setPaginatedMembers] = useState<Paginated<T>>();

    const loadMember = useCallback(() => {
        interceptedFetch({
            endpoint: API_ENDPOINTS.members.replace(':memberType', MemberType[memberType])
        }).then(res => res.json() as unknown as Paginated<T> )
            .then(paginatedMembers => {
                console.log('Paginated members', paginatedMembers);
                setPaginatedMembers(paginatedMembers);
            })
    }, []);

    useEffect(() => {
        loadMember();
    }, []);

    const members = paginatedMembers?.content;
    const pagination: GridPaginationInitialState = {
        paginationModel: {
            pageSize: paginatedMembers?.pageable?.pageSize
        },
    }

    console.log(`loaded members of type ${MemberType[memberType]}`, members);

    return (
        <>
            <Paper elevation={2}>
                <Box flexDirection='column' padding='20px'>
                    <Box display='flex' flexDirection='row' justifyContent='space-between' marginBottom={2} sx={{ bgcolor: 'primary.main' }} padding={1} borderRadius={1}>
                        <Box width='100%' display='flex' justifyContent='center' >
                            <Typography variant="h4" fontWeight="bold" color='white'>
                                {MemberType[memberType]}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button title='Refresh' size='small' onClick={() => loadMember()} >
                                <RefreshIcon sx={{color: 'white'}} fontSize='small' />
                            </Button>
                        </Box>
                    </Box>
                    {
                        members === undefined
                            ? <Typography>Loading...</Typography>
                            : members.length === 0
                                ? <Typography>No members found.</Typography>
                                : <DataGrid
                                    rows={members}
                                    columns={columns}
                                    initialState={{
                                        pagination
                                    }}
                                    pageSizeOptions={[1, 5, 10]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                />
                    }
                </Box>

            </Paper>
        </>
    );
};
export default MemberListComponent;
