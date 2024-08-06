"use client";
import React from "react";
import { TransakConfig, Transak } from "@transak/transak-sdk";
import { RootState, useAppSelector } from "@/redux/store";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import useWalletUtil from "@/hooks/useWalletUtil";
import _ from "lodash";

const TransakBox = ({ customClass }: { customClass?: string }) => {
  const {connectWallet} = useWalletUtil({key: 'transak-neb-connect'});
  const { isConnected, address } = useAccount();
  const { user, useWalletLinked } = useAppSelector(
    (state: RootState) => state.auth
  );
  if (!user || !useWalletLinked /* || !isConnected */) {
    return null;
  }

  let transakEnvironment = Transak.ENVIRONMENTS.PRODUCTION;
  if(process.env.NEXT_PUBLIC_APP_ENV === 'development'){
    transakEnvironment = Transak.ENVIRONMENTS.STAGING;
  }

  const transakConfig: TransakConfig = {
    apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY as string, // Your API Key
    environment: transakEnvironment, // STAGING/PRODUCTION
    defaultCryptoCurrency: "ETH",
    themeColor: "#ab31ff", // App theme color
    widgetHeight: "700px",
    widgetWidth: "500px",
    network: "polygon",
    cryptoCurrencyList: "MATIC,USDT",
    email: user.email,
  };

  const openTransak = () => {
    if (!isConnected || !address) {
      connectWallet?.();
      return;
    }
    const linkedWallets = user.linkedWallets?.length ? user.linkedWallets : [];
    if (!_.find(linkedWallets, {address: address?.toLowerCase()})) {
      toast.warning("Wallet connected is not linked to your account");
      return;
    }
    transakConfig.walletAddress = address;

    const transak = new Transak(transakConfig);

    transak.init();

    // To get all the events
    Transak.on("*", (data) => {
      //console.log(data);
    });

    // This will trigger when the user closed the widget
    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
      //console.log("Transak SDK closed!");
    });

    /*
     * This will trigger when the user has confirmed the order
     * This doesn't guarantee that payment has completed in all scenarios
     * If you want to close/navigate away, use the TRANSAK_ORDER_SUCCESSFUL event
     */
    Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
      //console.log(orderData);
    });

    /*
     * This will trigger when the user marks payment is made
     * You can close/navigate away at this event
     */
    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      //console.log(orderData);
      transak.close();
    });
  };

  return (
    <div className="transakBtn">
      <button
        className={`theme-btn btn-style-one btn-small fw-bold ${customClass}`}
        onClick={openTransak}
      >
        Buy Crypto
      </button>
    </div>
  );
};

export default TransakBox;
