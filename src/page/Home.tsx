import useInterceptedFetch from '../hook/useInterceptedFetch.ts';
import API_ENDPOINTS from '../util/endpoint/ApiEndpoint.ts';
import HttpMethod from '../util/HttpMethod.ts';


const Home = () => {
    const intercFetch = useInterceptedFetch();

    return (
        <>
            <div>Home</div>
            <button onClick={() => intercFetch({
                endpoint: API_ENDPOINTS.health,
                reqInit: {
                    method: HttpMethod.GET,
            }})}>Health</button>
        </>
    );
};
export default Home;
