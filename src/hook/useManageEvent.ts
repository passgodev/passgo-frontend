import useInterceptedFetch from "./useInterceptedFetch.ts";
import {useCallback} from "react";
import {UpdateEventDto} from "../model/event/UpdateEventDto.ts";
import ApiEndpoints from "../util/endpoint/ApiEndpoint.ts";
import HttpMethod from "../util/HttpMethod.ts";


const useManageEvent = () => {
	const interceptedFetch = useInterceptedFetch();

	const getEvent = useCallback(async (eventId: number) => {
		return interceptedFetch({
			endpoint: ApiEndpoints.eventById.replace(":id", eventId.toString()),
			reqInit: { method: HttpMethod.GET }
		});
	}, [interceptedFetch]);

	const updateEvent = useCallback(async (eventId: number, updateEventDto: UpdateEventDto) => {
		return interceptedFetch({
			endpoint: ApiEndpoints.eventById.replace(":id", eventId.toString()),
			reqInit: { method: HttpMethod.PUT, body: JSON.stringify(updateEventDto), headers: { "Content-Type": "application/json" } }
		});
	}, [interceptedFetch]);

	return { getEvent, updateEvent };
}

export default useManageEvent;