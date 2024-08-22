'use client'
import React from "react";
import PageLayout from "@/components/PageLayout";
import FaqChild from "@/components/faq/FaqChild";

const Faq = () => {
  return (
    <PageLayout>
      <section className="faqs-section">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Frequently Asked Questions</h2>
            <div className="text">Home / Faq</div>
          </div>
          
          <ul className="accordion-box">
            <FaqChild />
          </ul>

        </div>
      </section>
    </PageLayout>
  );
};

export default Faq;
