"use client";
import React, { useEffect } from "react";
import { Address } from "viem";
import { useBalance } from "wagmi";
import TransakBox from "../transak/TransakBox";

const WalletAddressSpan = ({ wallet, walletLinked }: { wallet: Address, walletLinked:boolean}) => {
  const { data } = useBalance({
    address: wallet,
  });

  const balance = parseInt(data?.formatted ?? "0");

  return (
    <>
      {balance <= 0 && (
        <>
          <div className="alert alert-primary d-flex justify-content-between mt-4 mb-1" role="alert">
            <h6 className="fw-bold">
              Your wallet balance is low. You can purchase cryptocurrency now to
              fund your account
            </h6>
            {balance <= 0 && (
                <TransakBox />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default WalletAddressSpan;
