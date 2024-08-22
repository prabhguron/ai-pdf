"use client";
import React, { useState } from "react";
import JobsMarket from "./JobsMarket";
import BreadCrumb from "@/components/common/BreadCrumb";
import CompleteOnBoarding from "@/components/common/CompleteOnBoarding";
import { MenuEntry } from "./interfaces/MenuEntry";
import ButtonTab from "./components/ButtonTab/ButtonTab";
import TalentListing from "./components/Table/TalentListing";
import CompanyListing from "./components/Table/Company/CompanyListing";
//import AIMarket from "./AIMarket";

const menuEntries: MenuEntry[] = [
  {
    id: "jobs-tab",
    name: "jobs",
    active: true,
  },
  {
    id: "talents-tab",
    name: "talents",
    active: false,
  },
  {
    id: "companies-tab",
    name: "companies",
    active: false,
  },
  // {
  //   id: "ai-tab",
  //   name: "AI",
  //   active: false,
  // },
];

const MarketPlaceMain = () => {
  const [activeTab, setActiveTab] = useState("jobs");

  const activeTabHandler = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <>
      <BreadCrumb title="Marketplace" />
      <div className="row">
        <div className="col-lg-12">
          <div className="ls-widget">
            <CompleteOnBoarding>
              <div className="tabs-box">
                <div className="widget-title"></div>

                <div className="widget-content">
                  <nav>
                    <div
                      className="nav nav-tabs mb-3"
                      id="nav-tab"
                      role="tablist"
                    >
                      {menuEntries.map((tab: MenuEntry) => {
                        return (
                          <ButtonTab
                            key={tab.id}
                            tab={tab}
                            onClickHandler={() => {
                              activeTabHandler(tab.name);
                            }}
                          ></ButtonTab>
                        );
                      })}
                    </div>
                  </nav>
                  <div className="tab-content" id="nav-tabContent">
                    <div
                      className="tab-pane fade active show"
                      id="jobs"
                      role="tabpanel"
                      aria-labelledby="jobs-tab"
                    >
                      {activeTab == "jobs" && <JobsMarket />}
                    </div>

                    <div
                      className="tab-pane fade"
                      id="talents"
                      role="tabpanel"
                      aria-labelledby="talents-tab"
                    >
                      {activeTab == "talents" && <TalentListing />}
                    </div>

                    <div
                      className="tab-pane fade"
                      id="companies"
                      role="tabpanel"
                      aria-labelledby="companies-tab"
                    >
                      {activeTab == "companies" && <CompanyListing />}
                    </div>

                    {/* <div
                      className="tab-pane fade"
                      id="AI"
                      role="tabpanel"
                      aria-labelledby="ai-tab"
                    >
                      {activeTab == "AI" && <AIMarket />}
                    </div> */}
                  </div>
                </div>
              </div>
            </CompleteOnBoarding>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketPlaceMain;
