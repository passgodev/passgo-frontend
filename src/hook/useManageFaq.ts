import useInterceptedFetch from "./useInterceptedFetch.ts";
import { useCallback } from "react";
import API_ENDPOINTS from "../util/endpoint/ApiEndpoint.ts";
import HttpMethod from "../util/HttpMethod.ts";
import FaqDto from "../model/faq/FaqDto.ts";

interface FaqRequest {
	question: string;
	answer: string;
}

const useManageFaq = () => {
	const interceptedFetch = useInterceptedFetch();

	const updateFaq = useCallback(async (faqId: number, faqRequest: FaqRequest): Promise<FaqDto> => {
		const res = await interceptedFetch({
			endpoint: `${API_ENDPOINTS.faq}/${faqId}`,
			reqInit: {
				method: HttpMethod.PUT,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(faqRequest)
			}
		});
		return res.json();
	}, [interceptedFetch]);

	const deleteFaq = useCallback(async (faqId: number): Promise<void> => {
		await interceptedFetch({
			endpoint: `${API_ENDPOINTS.faq}/${faqId}`,
			reqInit: { method: HttpMethod.DELETE }
		});
	}, [interceptedFetch]);

	return { updateFaq, deleteFaq };
};

export default useManageFaq;