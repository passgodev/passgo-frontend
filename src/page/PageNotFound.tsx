import { useNavigate } from 'react-router-dom';
import FallbackCard from '../component/page/FallbackCard.tsx';
import WEB_ENDPOINTS from '../util/endpoint/WebEndpoint.ts';


const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <FallbackCard title='Page Not Found' navigateTo={{
            name: 'Home Page',
            callback: () => navigate(WEB_ENDPOINTS.home)
        }} />
    );
};
export default PageNotFound;
