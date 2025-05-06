import { useEffect, useState } from "react";
import FAQ from "../component/FAQ";
import "./../style/faq.css";
import ApiEndpoints from "../util/endpoint/ApiEndpoint";

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

  useEffect(() => {
    const url = `${ApiEndpoints.faq}?page=${page}&size=${pageSize}`;
    fetch(url)
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
        i === index ? { ...faq, open: !faq.open } : { ...faq, open: false }
      )
    );
  };
  console.log(faqs);

  return (
    <>
      <h1 className="faq-header">FAQ</h1>
      {faqs.length === 0 ? (
        <div className="no-faq">No FAQs available.</div>
      ) : (
        <div className="faqs">
          <div className="page-size-selector">
            <label>Number of FAQs per page</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
            >
              {[2, 3, 4, 5].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          {faqs.map((faq, index) => (
            <FAQ faq={faq} index={index} key={faq.id} toggleFAQ={toggleFAQ} />
          ))}
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              Prev
            </button>
            <span>
              {page + 1} / {totalPages}
            </span>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FaqPage;
