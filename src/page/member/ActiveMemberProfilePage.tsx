import { ReactNode, useContext, useEffect, useState } from 'react';
import AlertContext from '../../context/AlertProvider.tsx';
import AuthContext from '../../context/AuthProvider.tsx';
import useInterceptedFetch from '../../hook/useInterceptedFetch.ts';
import ClientDto from '../../model/client/ClientDto.ts';
import MemberType from '../../model/member/MemberType.ts';
import Privilege from '../../model/member/Privilege.ts';
import OrganizerDto from '../../model/organizer/OrganizerDto.ts';
import API_ENDPOINTS from '../../util/endpoint/ApiEndpoint.ts';
import { loggerPrelogWithFactory } from '../../util/logger/Logger.ts';
import ClientInfoComponent from './client/ClientInfoComponent.tsx';
import OrganizerInfoPage from './organizer/OrganizerInfoPage.tsx';


const logger = loggerPrelogWithFactory('[ActiveMemberProfilePage]');

const ActiveMemberProfilePage = () => {
    const interceptedFetch = useInterceptedFetch();
    const { showAlert } = useContext(AlertContext);
    const { auth } = useContext(AuthContext);
    const [member, setMember] = useState<ClientDto | OrganizerDto>();
    const privilegeType: Privilege = auth.privilege!

    useEffect(() => {
        const memberId = auth.memberId;

        if ( memberId == undefined ) {
            showAlert('Logged-in memberId is undefined', 'error')
            return;
        }

        if ( privilegeType == undefined ) {
            showAlert('Logged-in member\'s privilege is undefined', 'error')
            return;
        }

        const endpoint = API_ENDPOINTS.memberById
            .replace(':id', auth.memberId ?? '-1')
            .replace(':memberType', MemberType[privilegeType!]);
        logger.log('ActiveMemberProfilePage - useEffect invoked', 'endpoint', endpoint);

        interceptedFetch({endpoint})
            .then(res => res.json())
            .then(json => {
                logger.log('ActiveMemberProfilePage - returned json', json);
                setMember(json)
            })
            .catch(err => {
                logger.log('ActiveMemberProfilePage - err', err)
                showAlert(err, 'error');
            });
    }, []);

    logger.log(member);

    const pickProperComponent = (privilege: Privilege): ReactNode => {
        switch (privilege) {
            case Privilege.CLIENT: {
                if (!member) return <div>Loading...</div>;
                return <ClientInfoComponent client={member as ClientDto} />;
            }
            case Privilege.ORGANIZER: {
                return <OrganizerInfoPage organizer={member as OrganizerDto} />
            }
        }
    }

    return pickProperComponent(privilegeType);
};
export default ActiveMemberProfilePage;
