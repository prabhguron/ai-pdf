"use client"
import React from "react";

import Modal from "react-modal";
import "./offer-modal.css";
import OfferBoard from "@/components/company/shortlists/OfferBoard";
import {useAppDispatch, useAppSelector } from "@/redux/store";
import { setOfferModalOpen } from "@/redux/contractSteps/contractStepsSlice";
const OfferModal = () => {
  const dispatch = useAppDispatch();
  const offerModalOpen = useAppSelector((state) => state.contractSteps.offerModalOpen);
  return (
    <Modal
      id="offerModal"
      isOpen={offerModalOpen}
      contentLabel="Modal"
      className={{
        base: "offer-modal-base offer-modal-style",
        afterOpen: "offer-modal-base_after-open",
        beforeClose: "offer-modal-base_before-close",
      }}
      overlayClassName={{
        base: "overlay-base",
        afterOpen: "overlay-base_after-open",
        beforeClose: "overlay-base_before-close",
      }}
      ariaHideApp={false}
      // onRequestClose={this.handleModalCloseRequest}
    >
      <div className="row">
        <div className="col-12 mb-3">
          <button
            type="button"
            className="btn-close pull-right"
            aria-label="Close"
            onClick={() => {
              dispatch(setOfferModalOpen(false))
            }}
          ></button>
        </div>
      </div>
      <div className="offerModalBody">
        <OfferBoard />
      </div>
    </Modal>
  );
};

export default OfferModal;
