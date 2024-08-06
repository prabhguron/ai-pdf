"use client";
import React, { useEffect, useState } from "react";
import NebulaiApi from "@/neb-api/NebulaiApi";
import BreadCrumb from "@/components/common/BreadCrumb";
import LinkWallets from "@/components/wallet/LinkWallets";
import SecuritySettings from "@/components/auth/SecuritySettings";
import SettingsForm from "./SettingsForm";


const CompanyAccountSettings = () => {
  const { getUserWallets } = NebulaiApi();
  const [wallets, setWallets] = useState([]);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    let fetch = true;
    (async () => {
      const res = await getUserWallets();
      if(res?.data){
        let {addresses} = res.data;
        if(fetch){
          setWallets(addresses);
        }
      }
    })()
    return () => {
      fetch = false;
    }
  },[refetch]);

  const refetchWallets = () => {
    setRefetch(!refetch);
  }

  return (
    <>
      <BreadCrumb title="My Account" />
      {/* breadCrumb */}

      <div className="row">
        <div className="col-lg-12">
          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h4>Personal Info</h4>
              </div>
              <SettingsForm />
            </div>
          </div>

          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h4>Security Settings</h4>
              </div>
              <SecuritySettings />
            </div>
          </div>

          <div className="ls-widget" id="linkWallet">
            <div className="tabs-box">
              <div className="widget-title">
                <h4>Linked Wallets</h4>
              </div>
              <LinkWallets wallets={wallets} refetchWallets={refetchWallets}/>
            </div>
          </div>

        </div>
      </div>
      {/* End .row */}
    </>
  );
};

export default CompanyAccountSettings;
