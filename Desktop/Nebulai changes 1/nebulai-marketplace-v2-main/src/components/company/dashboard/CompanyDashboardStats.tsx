"use client";

import { useRouter } from "next/navigation";

interface CompanyStats{
  totalPostedJobs: number;
  totalShortlistedApplications: number;
  totalAcceptedApplications: number;
} 
const CompanyDashboardStats = ({totalPostedJobs, totalShortlistedApplications, totalAcceptedApplications}: CompanyStats) => {
  const router = useRouter();
  const cardContent = [
    {
      id: 1,
      icon: "flaticon-briefcase",
      countNumber: totalPostedJobs ?? 0,
      metaName: "Posted Jobs",
      uiClass: "ui-blue",
      redirectTo: 'company/my-jobs'
    },
    {
      id: 2,
      icon: "la-file-invoice",
      countNumber: totalShortlistedApplications ?? 0,
      metaName: "Shortlisted",
      uiClass: "ui-yellow",
      redirectTo: 'company/my-jobs',
    },
    {
      id: 3,
      icon: "la-check-square",
      countNumber: totalAcceptedApplications ?? 0,
      metaName: "Accepted",
      uiClass: "ui-green",
      redirectTo: 'company/my-jobs',
    },
  ];

  return (
    <>
      {cardContent.map((item) => (
        <div
          className="ui-block col-xl-4 col-lg-6 col-md-6 col-sm-12 cursor-pointer"
          key={item.id}
          onClick={() => {
            router.push(`/${item.redirectTo}`)
          }}
        >
          <div className={`ui-item ${item.uiClass}`}>
            <div className="left">
              <i className={`icon la ${item.icon}`}></i>
            </div>
            <div className="right">
              <h4>{item.countNumber}</h4>
              <p>{item.metaName}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CompanyDashboardStats;
