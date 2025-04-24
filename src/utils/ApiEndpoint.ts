const API_PREFIX = "/api"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum ApiEndpoint {
    HEALTH,
    SIGNUP,
    LOGIN,
}

type Endpoint = string;

type Endpoints = {
    readonly [key in keyof typeof ApiEndpoint as Lowercase<string & key>]: Endpoint;
}


const ENDPOINTS: Endpoints = {
    health: endpointCreator('/health'),
    signup: endpointCreator('/auth/signup'),
    login: endpointCreator('/auth/login')
}

function endpointCreator(endpoint: string): string {
    return API_PREFIX + endpoint;
}

export { ENDPOINTS, ApiEndpoint, type Endpoint };