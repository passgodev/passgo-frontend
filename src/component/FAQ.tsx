import { FC } from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { FaqItem } from "../page/FaqPage";

interface FAQProps {
    faq: FaqItem;
    index: number;
    toggleFAQ: (index: number) => void;
}

const FAQ: FC<FAQProps> = ({ faq, index, toggleFAQ }) => {
    return (
        <Card
            sx={{
                mb: 2,
                border: faq.open ? "2px solid #1976d2" : "1px solid #ccc",
                transition: "border 0.2s ease-in-out",
                boxShadow: faq.open ? 3 : 1,
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={2}
                py={1.5}
                onClick={() => toggleFAQ(index)}
                sx={{ cursor: "pointer" }}
            >
                <Typography variant="h6">{faq.question}</Typography>
                <IconButton size="small">
                    {faq.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Box>
            <Collapse in={faq.open} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography variant="body1">{faq.answer}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default FAQ;
