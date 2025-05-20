import { CircularProgress, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import AlertContext from '../../context/AlertProvider.tsx';
import useInterceptedFetch from '../../hook/useInterceptedFetch.ts';
import ClientDto from '../../model/client/ClientDto.ts';
import SimpleTicketDto from '../../model/ticket/SimpleTicketDto.ts';
import API_ENDPOINTS from '../../util/endpoint/ApiEndpoint.ts';


interface MemberTicketsComponentProps {
    member: ClientDto;
}

const MemberTicketsComponent = ({ member }: MemberTicketsComponentProps) => {
    const [tickets, setTickets] = useState<SimpleTicketDto[]>([]);
    const [loading, setLoading] = useState(true);
    const { showAlert } = useContext(AlertContext);
    const interceptedFetch = useInterceptedFetch();

    useEffect(() => {
        
        console.log("DEBUG: ", member)

        if (!member.id) {
            showAlert('Brak ID użytkownika.', 'error');
            return;
        }

        const endpoint = API_ENDPOINTS.clientTickets.replace(':id', member.id.toString());

        interceptedFetch({ endpoint })
            .then(res => res.json())
            .then((data: SimpleTicketDto[]) => {
                setTickets(data);
            })
            .catch(err => {
                showAlert('Nie udało się pobrać biletów', 'error');
                console.error(err);
            })
            .finally(() => setLoading(false));

    }, [member.id]);

    if (loading) {
        return <CircularProgress />;
    }

    if (tickets.length === 0) {
        return <Typography variant="body1">Brak biletów.</Typography>;
    }

    return (
        <>
        <div>DDD</div>
        

        </>
    );
};

export default MemberTicketsComponent;
