import { Endpoint } from "./Endpoint.ts";

const API_PREFIX = "/api";

const API_ENDPOINTS = {
    health: endpointCreator('/health'),
    signup: endpointCreator('/auth/signup'),
    login: endpointCreator('/auth/login'),
    logout: endpointCreator('/auth/logout'),
    refresh: endpointCreator('/auth/refresh'),
    transactions: endpointCreator('/transactions'),
    faq: endpointCreator("/faqs"),
    members: endpointCreator('/members?type=:memberType'),
    memberById: endpointCreator('/members/:id?type=:memberType'),
    activateOrganizer: endpointCreator('/members/organizers/:id/activation'),
    events: endpointCreator('/events'),
    organizerEvents: endpointCreator('/events/:id/organizer'),
    eventImage: endpointCreator('/events/:id/image'),
    buildings: endpointCreator('/buildings'),
    buildingsDetails: endpointCreator('/buildings/:id'),
    buyTickets: endpointCreator('/tickets/purchase'),
    ticketsInfo: endpointCreator('/tickets/:eventId/info'),
}


function endpointCreator(endpoint: string): Endpoint {
    return API_PREFIX + endpoint;
}

export default API_ENDPOINTS;
