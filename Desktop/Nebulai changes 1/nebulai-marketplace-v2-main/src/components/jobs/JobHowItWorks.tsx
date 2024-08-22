import React from "react";
import HowItWorksBlock from "./HowItWorksBlock";

const JobHowItWorks = () => {
  return (
    <section className="process-section pt-0 mt-3em">
      <div className="auto-container">
        <div className="sec-title text-center">
          <h2>How It Works?</h2>
          <div className="text">Join a global community where talent meets opportunity.</div>
        </div>

        <div className="row" data-aos="fade-up">
          <HowItWorksBlock />
        </div>
      </div>
    </section>
  );
};

export default JobHowItWorks;
