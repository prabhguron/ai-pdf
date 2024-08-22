"use client";
import React from "react";

import Modal from "react-modal";
import "./contract-modal.css";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import ContractInfo from "@/components/escrow/ContractInfo";
import { setContractModalOpen } from "@/redux/contractInfo/contractInfoSlice";
const ContractModal = () => {
  const dispatch = useAppDispatch();
  const contractModalOpen = useAppSelector(
    (state) => state.contractInfo.contractModalOpen
  );
  return (
    <Modal
      id="contractModal"
      isOpen={contractModalOpen}
      contentLabel="Modal"
      className={{
        base: "contract-modal-base contract-modal-style",
        afterOpen: "contract-modal-base_after-open",
        beforeClose: "contract-modal-base_before-close",
      }}
      overlayClassName={{
        base: "overlay-base",
        afterOpen: "overlay-base_after-open",
        beforeClose: "overlay-base_before-close",
      }}
      ariaHideApp={false}
    >
      <div className="row">
        <div className="col-12 mb-3">
          <button
            type="button"
            className="btn-close pull-right"
            aria-label="Close"
            onClick={() => {
              dispatch(setContractModalOpen(false));
            }}
          ></button>
        </div>
      </div>
      <div className="contractModalBody">
        <ContractInfo />
      </div>
    </Modal>
  );
};

export default ContractModal;
