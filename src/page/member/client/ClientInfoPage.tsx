import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from '../../../context/AlertProvider.tsx';
import useInterceptedFetch from '../../../hook/useInterceptedFetch.ts';
import ClientDto from '../../../model/client/ClientDto.ts';
import MemberType from '../../../model/member/MemberType.ts';
import API_ENDPOINTS from '../../../util/endpoint/ApiEndpoint.ts';
import ClientInfoComponent from './ClientInfoComponent.tsx';


const ClientInfoPage = () => {
    const params = useParams();
    console.log('ClientInfoPage', params)
    const interceptedFetch = useInterceptedFetch();
    const { showAlert } = useContext(AlertContext);
    const [client, setClient] = useState<ClientDto>();

    useEffect(() => {
        const endpoint = API_ENDPOINTS.memberById
            .replace(':id', params.id ?? '-1')
            .replace(':memberType', MemberType[MemberType.CLIENT]);
        console.log('ClientInfoPage - useEffect invoked', 'endpoint', endpoint);

        interceptedFetch({endpoint})
            .then(res => res.json())
            .then(json => {
                console.log('ClientInfoPage - returned json', json);
                setClient(json)
            })
            .catch(err => {
                console.log('ClientInfoPage - err', err)
                showAlert(err, 'error');
            });
    }, []);

    return (
        <ClientInfoComponent client={client!} />
    );
};
export default ClientInfoPage;
