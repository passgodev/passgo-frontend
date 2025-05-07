import { Endpoint } from "./Endpoint.ts";

const API_PREFIX = "/api";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum ApiEndpoint {
    HEALTH,
    SIGNUP,
    LOGIN,
    REFRESH,
    FAQ,
}

type Endpoints = {
    readonly [key in keyof typeof ApiEndpoint as Lowercase<
        string & key
    >]: Endpoint;
};

const ApiEndpoints: Endpoints = {
    health: endpointCreator("/health"),
    signup: endpointCreator("/auth/signup"),
    login: endpointCreator("/auth/login"),
    refresh: endpointCreator("/auth/refresh"),
    faq: endpointCreator("/faqs"),
};

function endpointCreator(endpoint: string): string {
    return API_PREFIX + endpoint;
}

export default ApiEndpoints;
