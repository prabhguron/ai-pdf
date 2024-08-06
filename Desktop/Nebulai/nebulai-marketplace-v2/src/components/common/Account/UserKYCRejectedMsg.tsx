import React from "react";
import { FaUserTimes } from "react-icons/fa";

const UserKYCRejectedMsg = () => {
  return (
    <div className="category-block">
      <div className="inner-box mt-3">
        <div className="content">
          <span className={`icon bg-danger`}>
            <FaUserTimes className="text-white"/>
          </span>
          <div className="">
            <p className="fs-5 fw-bold">
              {" "}
              We could not complete your KYC profile verification. Without
              completing the KYC process, you won&apos;t be able to use all
              features of the platform. If you have any questions, please
              contact <a href="#">support@nebulai.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserKYCRejectedMsg;
