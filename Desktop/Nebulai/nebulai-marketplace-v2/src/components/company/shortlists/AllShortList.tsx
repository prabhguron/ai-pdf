"use client";
import BreadCrumb from "@/components/common/BreadCrumb";
import React from "react";
import ShortListBoard from "./ShortListBoard";
import CompleteOnBoarding from "@/components/common/CompleteOnBoarding";
import { useAppSelector } from "@/redux/store";

const AllShortList = () => {
  const { chatSidebar } = useAppSelector((state) => state.toggle);

  return (
    <>
      <BreadCrumb title="Short Listed Applicants" />
      {/* breadCrumb */}

      <div className="row">
        <div
          className={`col-lg-12 ${chatSidebar ? "active-chat-contacts" : ""}`}
        >
          {/* <!-- Ls widget --> */}

          <div className="widget-content">
            <div className="row">
              <div className={`col-lg-12`}>
                <div className="chat-widget">
                  <div className="widget-content">
                    <CompleteOnBoarding>
                      <ShortListBoard />
                    </CompleteOnBoarding>
                  </div>
                </div>
                {/* <!-- Chat Widget --> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End .row */}
    </>
  );
};

export default AllShortList;
