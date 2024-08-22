"use client"
import { useAppSelector } from "@/redux/store";
import { getTelegramURI } from "@/utils/helper";
import Image from "next/image";
import React from "react";

const JobOfferCardHeader = () => {
  const offerInfo = useAppSelector((state) => state.jobOffer.offerInfo);
  if (!offerInfo) return;

  const telegramUsername = offerInfo?.userId?.telegramUsername;
  let telegramUri = null;
  if (telegramUsername) {
    telegramUri = getTelegramURI(telegramUsername);
  }

  return (
    <div className="row">
      <div className="col-12 d-flex justify-content-between">
        <div className="d-flex bd-highlight">
          <div className="img_cont">
            {offerInfo?.companyImage && (
              <Image
                src={offerInfo?.companyImage ?? ""}
                alt=""
                className="rounded-circle user_img"
                loading="lazy"
                width={50}
                height={50}
              />
            )}
          </div>
          <div className="user_info">
            <span className="fw-bolder">
              {offerInfo?.companyProfileId?.companyName}
            </span>
          </div>
        </div>

        {telegramUri && (
          <a
            className={"theme-btn btn-style-one btn-small"}
            href={offerInfo?.userId?.telegramUsername}
            target="_blank"
            rel="noreferrer"
          >
            <span style={{ marginRight: "5px" }}>Chat Now</span>
            <span className="la la-telegram"></span>
          </a>
        )}
      </div>
    </div>
  );
};

export default JobOfferCardHeader;
