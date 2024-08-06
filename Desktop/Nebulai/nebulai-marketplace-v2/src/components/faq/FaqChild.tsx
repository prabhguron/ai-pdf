/* eslint-disable react/no-unescaped-entities */
'use client'
import React from "react";

const FaqChild = () => {
  return (
    <>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item accordion block active-block">
          <h2 className="accordion-header">
            <button
              className="acc-btn accordion-button fw-bold"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
            >
              What is the Nebulai Marketplace? 
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div className="content">
                <p className="fw-bold">
                The Nebulai Marketplace is a decentralized platform that connects companies, solution providers, and talent, allowing them to collaborate on projects in a secure and transparent way. 
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion-item accordion block active-block">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button acc-btn collapsed fw-bold"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              How is the Nebulai Marketplace different from other marketplaces? 
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div className="content">
                <p className="fw-bold">
                The Nebulai Marketplace is built on blockchain technology, which allows for a high level of security and transparency. It also uses a unique rewards system to incentivize users to participate and contribute to the platform. 
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion-item accordion block active-block">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button acc-btn collapsed fw-bold"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              How do I create an account on the Nebulai Marketplace? 
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div className="content">
                <p className="fw-bold">
                To create an account on the Nebulai Marketplace, simply click on the "Sign Up" button on the homepage and follow the prompts to fill in your personal information. 
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion-item accordion block active-block">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button acc-btn collapsed fw-bold"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFour"
              aria-expanded="false"
              aria-controls="collapseFour"
            >
              How do I find projects to work on? 
            </button>
          </h2>
          <div
            id="collapseFour"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div className="content">
                <p className="fw-bold">
                You can browse available projects on the Nebulai Marketplace by clicking on the "Marketplace" tab and using the search and filter functions to narrow down your results. 
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="accordion-item accordion block active-block">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button acc-btn collapsed fw-bold"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFive"
              aria-expanded="false"
              aria-controls="collapseFive"
            >
              How do I get paid for my work on the Nebulai Marketplace?
            </button>
          </h2>
          <div
            id="collapseFive"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div className="content">
                <p className="fw-bold">
                Once you've completed a project and it has been approved by the client, payment will be automatically released to you through the platform's escrow system.  
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqChild;
