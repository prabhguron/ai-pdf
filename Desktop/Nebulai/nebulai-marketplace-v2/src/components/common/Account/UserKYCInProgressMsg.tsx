import Link from "next/link";
import React from "react";
import { FaUserShield } from "react-icons/fa";

const UserKYCInProgressMsg: React.FC<{
  role: Role;
}> = ({ role }) => {
  return (
    <div className="category-block">
      <div className="inner-box mt-3">
        <div className="content">
          <span className={`icon `}>
            <FaUserShield />
          </span>
          <div className="">
            <p className="fs-5 fw-bold">
              {" "}
              Your KYC verification is in progress and may take up to 48 hours.
              Feel free to explore our marketplace while we process your
              information. You will be notified via email once your KYC
              verification is complete.
            </p>

            <Link
              className="theme-btn btn-style-one btn-small fw-bold float-end"
              href={`/${role}/marketplace`}
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserKYCInProgressMsg;
