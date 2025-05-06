import { FC } from "react";
import "./../style/faq.css";
import { FaqItem } from "../page/FaqPage";

interface FAQProps {
  faq: FaqItem;
  index: number;
  toggleFAQ: (index: number) => void;
}

const FAQ: FC<FAQProps> = ({ faq, index, toggleFAQ }) => {
  return (
    <div
      className={`faq ${faq.open ? "open" : ""}`}
      key={index}
      onClick={() => toggleFAQ(index)}
    >
      <div className="faq-header-row">
        <div className="faq-question">{faq.question}</div>
        <div className="faq-toggle">{faq.open ? "-" : "+"}</div>
      </div>
      <div className="faq-answer">{faq.answer}</div>
    </div>
  );
};

export default FAQ;
