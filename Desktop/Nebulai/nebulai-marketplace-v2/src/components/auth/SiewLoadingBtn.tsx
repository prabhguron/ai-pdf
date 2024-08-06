"use client";

import React from "react";

const SiewLoadingBtn = ({walletLoading, walletLoadingMsg}:{walletLoading: boolean; walletLoadingMsg: string;}) => {
  return (
    <div className="form-group">
      <button
        className="btn siweBtn"
        type="button"
        name="sign-in-eth"
        disabled={walletLoading}
      >
        {walletLoading && walletLoadingMsg && (
          <>
            {walletLoadingMsg}{" "}
            <span
              className="spinner-border spinner-border-sm pl-4"
              role="status"
              aria-hidden="true"
            ></span>
          </>
        )}
      </button>
    </div>
  );
};

export default SiewLoadingBtn;
