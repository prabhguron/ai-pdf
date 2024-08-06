"use client";

import { useRouter } from "next/navigation";

interface TalentStats {
  totalAppliedJobs: number; 
  totalShortlistedJobs: number; 
  totalAcceptedJobs: number;
}

interface CardTalentBoard {
  id: number;
  icon: string;
  countNumber: number;
  metaName: string;
  uiClass: string;
  redirectTo: string;
}


const TalentDashboardStats = ({totalAppliedJobs, totalShortlistedJobs, totalAcceptedJobs}: TalentStats) => {
  const router = useRouter();

  const cardContent: CardTalentBoard[] = [
    {
      id: 1,
      icon: "flaticon-briefcase",
      countNumber: totalAppliedJobs ?? 0,
      metaName: "Applied Jobs",
      uiClass: "ui-blue",
      redirectTo: 'talent/applied-jobs'
    },
    {
      id: 3,
      icon: "la-file-invoice",
      countNumber: totalShortlistedJobs ?? 0,
      metaName: "Job Offers",
      uiClass: "ui-yellow",
      redirectTo: 'talent/applied-jobs'
    },
    {
      id: 2,
      icon: "la-check-square",
      countNumber: totalAcceptedJobs ?? 0,
      metaName: "Accepted Contracts",
      uiClass: "ui-green",
      redirectTo: 'talent/applied-jobs'
    },
    // {
    //   id: 4,
    //   icon: "la-bookmark-o",
    //   countNumber: "0",
    //   metaName: "Shortlist",
    //   uiClass: "ui-green",
    // },
  ];

  return (
    <>
      {cardContent.map((item: CardTalentBoard) => (
        <div
          className="ui-block col-xl-4 col-lg-4 col-md-12 col-sm-12 cursor-pointer"
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

export default TalentDashboardStats;
