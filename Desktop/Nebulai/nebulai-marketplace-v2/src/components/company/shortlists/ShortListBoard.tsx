"use client";
import React from "react";
import ShortlistedJobApplicants from "./ShortlistedJobApplicants";
import OfferBoard from "./OfferBoard";

const ShortListBoard = () => {
  // const dispatch = useAppDispatch();
  // const chatToggle = () => {
  //   dispatch(chatSidebarToggle());
  // };

  return (
    <div className="row">
      <div
        className="contacts_column col-xl-4 col-lg-5 col-md-12 col-sm-12 chat"
        id="chat_contacts"
      >
        <div className="card contacts_card">
          <div className="card-header pt-1 d-none">
            {/* <div
              className="fix-icon position-absolute top-0 end-0 show-1023"
              onClick={chatToggle}
            >
              <span className="flaticon-close"></span>
            </div> */}

            {/* <ShortlistedJobsDropdown /> */}
          </div>

          <div className="card-body contacts_body">
            <h6 className="text-center mb-2 fw-bold">Applicants</h6>
            <ShortlistedJobApplicants />
          </div>
        </div>
      </div>

      <div className=" col-xl-8 col-lg-7 col-md-12 col-sm-12 chat">
        <div className="card message-card">
            <OfferBoard/>
        </div>
      </div>
    </div>
  );
};

export default ShortListBoard;
