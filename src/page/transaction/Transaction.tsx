import { Box, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationInitialState } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import useInterceptedFetch from '../../hook/useInterceptedFetch.ts';
import TransactionDto from '../../model/transaction/TransactionDto.ts';
import ApiEndpoints from '../../util/endpoint/ApiEndpoint.ts';
import { Paginated } from '../../util/pagination/Paginated.ts';


const columns: GridColDef<TransactionDto>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'totalPrice',
        headerName: 'Total price',
        width: 150,
        editable: true,
    },
    {
        field: 'completedAt',
        headerName: 'Completed At',
        width: 150,
        editable: true,
    },
    {
        field: 'client',
        headerName: 'Client',
        width: 150,
        editable: true,
        renderCell: (cell) => {
            const {id, firstName, lastName} = cell.formattedValue;
            return <Typography variant='button' onClick={() => console.log('onClick - client Cell', cell)}>
                <Link href={`http://localhost:8080/api/members/${id}?type=client`} >
                    {firstName + ' ' + lastName}
                </Link>
            </Typography>
        }
    },
];

const DEFAULT_TRANSACTIONS: TransactionDto[] = [];

const Transaction = () => {
    const fetch = useInterceptedFetch();
    const [paginatedTransactions, setPaginatedTransactions] = useState<Paginated<TransactionDto>>();
    const [transactionError, setTransactionError] = useState('');

    useEffect(() => {
        fetch({ endpoint: ApiEndpoints.transaction })
            .then((response) => response.json() as unknown as Paginated<TransactionDto>)
            .then(paginatedTransaction => {
                console.log('Paginated Transaction', paginatedTransaction);
                setPaginatedTransactions(paginatedTransaction);
            })
            .catch(err => {
                console.log('trsansaction fetch error', err);
                setTransactionError('error occured');
            })
    }, []);

    const transactions = paginatedTransactions?.content ?? DEFAULT_TRANSACTIONS;
    const transactionsLength = transactions?.length ?? DEFAULT_TRANSACTIONS.length;
    const pagination: GridPaginationInitialState = {
        paginationModel: {
            pageSize: paginatedTransactions?.pageable?.pageSize
        },
    }

    return (
        <Box>
            {
                transactionError !== ''
                    ? <Typography>Error</Typography>
                    : transactionsLength > 0
                        ? <DataGrid
                            rows={transactions}
                            columns={columns}
                            initialState={{
                                pagination
                            }}
                            pageSizeOptions={[1, 5, 10]}
                            checkboxSelection
                            disableRowSelectionOnClick
                        />
                        : <Typography>Loading</Typography>}
        </Box>
    );
};
export default Transaction;
