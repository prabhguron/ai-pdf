"use client";

import { useAppSelector } from "@/redux/store";
import React from "react";

const ContractTabs = () => {
  const changeOrdersCount = useAppSelector(
    (state) => state.contractInfo.changeOrdersCount,
  );
  const canRaiseDispute = useAppSelector(
    (state) => state.contractInfo.canRaiseDispute,
  );
  const disputeId = useAppSelector((state) => state.contractInfo.disputeId);

  return (
    <nav className="p-2">
      <div className="nav nav-tabs mb-2" id="nav-tab" role="tablist">
        <button
          className="nav-link active contractNavTab fw-bold"
          id="jobs-tab"
          data-bs-toggle="tab"
          data-bs-target="#contractInfo"
          type="button"
          role="tab"
          aria-controls="contractInfo"
          aria-selected="true"
        >
          Contract Info
        </button>
        <button
          className={`nav-link contractNavTab fw-bold ${changeOrdersCount > 0 ? "" : "disabled"}`}
          id="change-order-tab"
          data-bs-toggle="tab"
          data-bs-target="#change-order"
          type="button"
          role="tab"
          aria-controls="change-order"
          aria-selected="false"
          aria-disabled={changeOrdersCount > 0 ? false : true}
        >
          Change Orders ({changeOrdersCount})
        </button>
        <button
          className={`nav-link contractNavTab fw-bold ${canRaiseDispute || disputeId ? "" : "disabled"}`}
          id="mediation-tab"
          data-bs-toggle="tab"
          data-bs-target="#mediation"
          type="button"
          role="tab"
          aria-controls="mediation"
          aria-selected="false"
          aria-disabled={canRaiseDispute || disputeId ? false : true}
        >
          Mediation
        </button>
      </div>
    </nav>
  );
};

export default ContractTabs;
