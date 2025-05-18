import { Endpoint } from "./Endpoint.ts";

const API_PREFIX = "/api";

const API_ENDPOINTS = {
    health: endpointCreator('/health'),
    signup: endpointCreator('/auth/signup'),
    login: endpointCreator('/auth/login'),
    refresh: endpointCreator('/auth/refresh'),
    transactions: endpointCreator('/transactions'),
    faq: endpointCreator("/faqs"),
    members: endpointCreator('/members?type=:memberType'),
    memberById: endpointCreator('/members/:id?type=:memberType'),
    events: endpointCreator('/events'),
    buildings: endpointCreator('/buildings'),
    buyTickets: endpointCreator('/tickets/purchase')
}


function endpointCreator(endpoint: string): Endpoint {
    return API_PREFIX + endpoint;
}

export default API_ENDPOINTS;
