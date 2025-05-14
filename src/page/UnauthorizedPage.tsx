import { useNavigate } from 'react-router-dom';
import FallbackCard from '../component/page/FallbackCard.tsx';


const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <FallbackCard title='Unauthorized page' navigateTo={{
            name: 'Unauthorized Page',
            callback: () => navigate(-1)
        }} />
    );
};
export default UnauthorizedPage;
