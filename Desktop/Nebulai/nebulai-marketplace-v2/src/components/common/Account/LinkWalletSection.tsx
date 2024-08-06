"use client";

import WalletAddressSpan from "@/components/auth/WalletAddressSpan";
import LinkConnectButton from "@/components/wallet/LinkConnectButton";
import { useAppSelector } from "@/redux/store";
import { PROFILE_WELCOME_TEXT } from "@/utils/constants";
import React from "react";
import { Address } from "viem";

const LinkWalletSection = () => {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;
  const profileStat = useAppSelector(
    (state) => state.getStartedSteps.profileStat,
  );
  if (!role) return null;

  const walletLinked = profileStat?.walletLinked ?? false;
  const allWallets = profileStat?.wallets ?? [];
  let wallet: Address | null = null;
  if (walletLinked && allWallets) {
    wallet = allWallets?.length > 0 ? allWallets[0].address : null;
  }

  return (
    <>
      {walletLinked && wallet ? (
        <WalletAddressSpan walletLinked={walletLinked} wallet={wallet} />
      ) : (
        <form action={"#"} className="default-form">
          <div className="category-block">
            <div className="inner-box mt-3">
              <div className="">
                <div className="form-group">
                  <h3 className="fw-bold mb-2">Link Your Wallet</h3>
                  <p className="fs-5 fw-bold">
                    {" "}
                    {PROFILE_WELCOME_TEXT[role].wallet}
                  </p>

                  <div className="col-12 col-sm-10 col-md-9 col-lg-7 offset-0 offset-sm-2 offset-md-3 offset-lg-5">
                    <LinkConnectButton
                      btnLbl="Link Wallet"
                      lblIcon={""}
                      refetchWallets={() => {}}
                      floatClass=""
                      connectAfterLink={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default LinkWalletSection;
