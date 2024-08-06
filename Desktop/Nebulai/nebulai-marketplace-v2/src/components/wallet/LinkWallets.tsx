"use client";
import React from "react";
import { FaWallet } from "react-icons/fa";
import { toast } from "react-toastify";
import NebulaiApi from "@/neb-api/NebulaiApi";
import LinkConnectButton from "./LinkConnectButton";
import useConfirm from "@/context/ConfirmDialog";
import { shortAddress } from "@/utils/helper";
import { setUserWalletLinked } from "@/redux/auth/authSlice";
import { useAppDispatch } from "@/redux/store";
import { Address } from "viem";
import { WalletInfo } from "@/hooks/useWalletUtil";

interface LinkWalletProps {
  wallets: WalletInfo[];
  refetchWallets: () => void;
}
const LinkWallets = ({ wallets = [], refetchWallets }: LinkWalletProps) => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { unLinkWallet } = NebulaiApi();

  const unLinkHandler = async (addr: Address) => {
    const choice = await confirm({
      title: "Unlink Wallet Address",
      description: `Are you sure you want to unlink ${shortAddress(addr)}?`,
      btnLabel: "Yes",
      btnClass: "btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice) return;
    try {
      const unlinkRes = await unLinkWallet({ address: addr });
      if (unlinkRes && unlinkRes.status && unlinkRes.data) {
        const status = unlinkRes?.data?.status || "error";
        const msg = unlinkRes?.data?.message || "Something went wrong";
        const toastMsg =
          status === "success" ? `Address ${addr} unlinked successfully` : msg;
        toast(toastMsg, { type: status });
        await dispatch(setUserWalletLinked(false));
        refetchWallets();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="widget-content">
      <form action="#" className="default-form">
        <div className="row">
          <div className="form-group col-md-7 col-lg-7 d-none d-md-block d-lg-block d-xl-block d-xxl-block"></div>
          <div className="form-group col-md-5 col-lg-5 col-sm-12">
            {/* {wallets.length === 0 && ( */}
            <LinkConnectButton
              btnLbl={wallets.length === 0 ? "Link Wallet" : "Link New Wallet"}
              lblIcon={<FaWallet />}
              refetchWallets={refetchWallets}
            />
            {/* )} */}
          </div>

          <div className="form-group col-lg-12 col-md-12">
            <div className="tabs-box">
              {/* End filter top bar */}

              {/* Start table widget content */}
              {/* <div className="widget-content"> */}
              <div className="table-outer">
                <div className="table-outer">
                  <table className="default-table manage-job-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Whitelisted</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {wallets.length ? (
                        wallets.map((wallet) => (
                          <tr key={wallet?._id}>
                            <td className="fw-bold">{wallet?.name}</td>
                            <td className="fw-bold">{wallet?.address}</td>
                            <td className="fw-bold">
                              {wallet?.isApproved ? <>✅</> : <>❌</>}
                            </td>
                            <td>
                              <div className="option-box">
                                <ul className="option-list">
                                  <li>
                                    <button
                                      type="button"
                                      data-text="Unlink"
                                      onClick={() => {
                                        unLinkHandler(wallet?.address);
                                      }}
                                    >
                                      <span className="la la-trash"></span>
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <></>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* </div> */}
              {/* End table widget content */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LinkWallets;
