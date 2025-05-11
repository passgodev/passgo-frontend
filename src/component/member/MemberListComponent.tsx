import { Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationInitialState, GridValidRowModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
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

    useEffect(() => {
        interceptedFetch({
            endpoint: API_ENDPOINTS.members.replace(':memberType', MemberType[memberType])
        }).then(res => res.json() as unknown as Paginated<T> )
            .then(paginatedMembers => {
                console.log('Paginated members', paginatedMembers);
                setPaginatedMembers(paginatedMembers);
            })
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
        </>
    );
};
export default MemberListComponent;
