import { Typography, Paper, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import ApiEndpoints from "../util/endpoint/ApiEndpoint";
import Faq from "../interface/FaqInterface";
import AdminFaqListItem from "../component/AdminFaqListItem";
import AdminFaqDialog from "../component/AdminFaqDialog";
import AdminDeleteConfirmDialog from "../component/AdminDeleteConfirmDialog";
import useInterceptedFetch from "../hook/useInterceptedFetch";

const AdminFaqPage = () => {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(3);
    const [totalPages, setTotalPages] = useState(0);

    const [openDialog, setOpenDialog] = useState(false);
    const [editFaq, setEditFaq] = useState<Partial<Faq> | null>(null);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);

    const fetch = useInterceptedFetch();

    const fetchFaqs = () => {
        fetch({ endpoint: `${ApiEndpoints.faq}?page=${page}&size=${pageSize}` })
            .then((res) => res.json())
            .then((data) => {
                setFaqs(data.content);
                setTotalPages(data.totalPages);
            });
    };

    useEffect(() => {
        fetchFaqs();
    }, [page]);

    const handleSave = () => {
        if (!editFaq) return;

        const method = editFaq?.id ? "PUT" : "POST";
        const url = editFaq?.id
            ? `${ApiEndpoints.faq}/${editFaq.id}`
            : ApiEndpoints.faq;

        const payload = {
            question: editFaq?.question,
            answer: editFaq?.answer,
        };

        fetch({
            endpoint: url,
            reqInit: {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            },
        }).then(() => {
            setOpenDialog(false);
            fetchFaqs();
        });
    };

    const handleDelete = () => {
        if (!faqToDelete) return;
        fetch({
            endpoint: `${ApiEndpoints.faq}/${faqToDelete.id}`,
            reqInit: {
                method: "DELETE",
            },
        }).then(() => {
            setOpenDeleteDialog(false);
            setPage(0); // Reset to first page in case item was last
            fetchFaqs();
        });
    };

    return (
        <Box sx={{ p: 4 }}>
            <Paper
                sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: "#64affa",
                    color: "#eee",
                    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h5">FAQ - Admin Panel</Typography>
                <Button
                    variant="contained"
                    onClick={() => {
                        setEditFaq({ question: "", answer: "" });
                        setOpenDialog(true);
                    }}
                >
                    Add FAQ
                </Button>
            </Paper>

            {faqs.map((faq) => (
                <AdminFaqListItem
                    key={faq.id}
                    faq={faq}
                    onEdit={(faq) => {
                        setEditFaq(faq);
                        setOpenDialog(true);
                    }}
                    onDelete={(faq) => {
                        setFaqToDelete(faq);
                        setOpenDeleteDialog(true);
                    }}
                />
            ))}

            {/* Pagination */}
            {faqs.length === 0 ? (
                <Box textAlign="center" mt={4}>
                    <Typography variant="h6">No FAQs available.</Typography>
                </Box>
            ) : (
                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button
                        disabled={page === 0}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Prev
                    </Button>
                    <Typography>
                        {page + 1} / {totalPages}
                    </Typography>
                    <Button
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </Box>
            )}

            {/* Dialog Add/Edit */}
            <AdminFaqDialog
                open={openDialog}
                faq={editFaq}
                onClose={() => setOpenDialog(false)}
                onChange={(faq) => setEditFaq(faq)}
                onSave={handleSave}
            />

            {/* Dialog Delete */}
            <AdminDeleteConfirmDialog
                open={openDeleteDialog}
                faq={faqToDelete}
                onCancel={() => setOpenDeleteDialog(false)}
                onConfirm={handleDelete}
            />
        </Box>
    );
};

export default AdminFaqPage;
