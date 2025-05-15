import {
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Paper,
    Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import FAQ from "../component/FAQ";
import ApiEndpoints from "../util/endpoint/ApiEndpoint";
import useInterceptedFetch from "../hook/useInterceptedFetch";

export interface FaqItem {
    id: number;
    question: string;
    answer: string;
    open: boolean;
}

const FaqPage = () => {
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(4);

    const fetch = useInterceptedFetch();

    useEffect(() => {
        const url = `${ApiEndpoints.faq}?page=${page}&size=${pageSize}`;
        fetch({ endpoint: url })
            .then((res) => res.json())
            .then((data) => {
                const faqsWithOpen = data.content.map((faq: any) => ({
                    ...faq,
                    open: false,
                }));
                setFaqs(faqsWithOpen);
                setTotalPages(data.totalPages);
            })
            .catch((err) => console.error("Error fetching FAQs:", err));
    }, [page, pageSize]);

    const toggleFAQ = (index: number) => {
        setFaqs((prevFaqs) =>
            prevFaqs.map((faq, i) =>
                i === index
                    ? { ...faq, open: !faq.open }
                    : { ...faq, open: false }
            )
        );
    };
    console.log(faqs);

    return (
        <>
            <Paper
                elevation={2}
                sx={{
                    backgroundColor: "#64affa",
                    color: "#eee",
                    marginTop: "8px",
                    padding: "15px",
                    borderRadius: "5px",
                    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    FAQ
                </Typography>
            </Paper>
            {faqs.length === 0 ? (
                <Box textAlign="center" mt={4}>
                    <Typography variant="h6">No FAQs available.</Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 768,
                        margin: "0 auto",
                        padding: 2,
                    }}
                >
                    <Box display="flex" justifyContent="center" mb={2}>
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel id="page-size-label">
                                FAQs per page
                            </InputLabel>
                            <Select
                                labelId="page-size-label"
                                value={pageSize}
                                label="FAQs per page"
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPage(0);
                                }}
                            >
                                {[2, 3, 4, 5].map((size) => (
                                    <MenuItem key={size} value={size}>
                                        {size}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    {faqs.map((faq, index) => (
                        <FAQ
                            faq={faq}
                            index={index}
                            key={faq.id}
                            toggleFAQ={toggleFAQ}
                        />
                    ))}
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={2}
                        mt={2}
                    >
                        <Button
                            variant="contained"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 0}
                        >
                            Prev
                        </Button>
                        <Typography>
                            {page + 1} / {totalPages}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => setPage(page + 1)}
                            disabled={page + 1 >= totalPages}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default FaqPage;
