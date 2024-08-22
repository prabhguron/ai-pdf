import NebulaiApi from "@/neb-api/NebulaiApi";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaUser } from "react-icons/fa";
import { BarLoader } from "react-spinners";

interface TalentProfileItem {
  _id: string;
  userId: string;
  fullName: string;
  profileTags: string[];
  location: string;
  profileImage: string;
}

interface CompanyProfileItem {
  _id: string;
  userId: string;
  companyName: string;
  industry: string;
  location: string;
  profileImage: string;
}

// Define the conditional type based on the role
type RecommendedProfile<T extends Role> = T extends "company"
  ? CompanyProfileItem[]
  : T extends "talent"
  ? TalentProfileItem[]
  : never;

const TalentProfileCard = ({
  talentItem,
}: {
  talentItem: TalentProfileItem;
}) => {
  return (
    <div className="job-block-four col-xl-4 col-lg-4 col-md-6 col-sm-12 mt-4">
      <Link href={`/talent-info/${talentItem?.userId}`}>
        <div className="inner-box p-3 pt-3">
          <span className="company-logo">
            {talentItem?.profileImage ? (
              <Image
                src={talentItem?.profileImage}
                alt={talentItem?.fullName}
                width={250}
                height={250}
              />
            ) : (
              <FaUser className="mt-3" size={60} />
            )}
          </span>
          <h4 className="fw-bold">{talentItem?.fullName}</h4>
          <div className="location">
            <span className="icon flaticon-map-locator"></span>
            {talentItem?.location}
          </div>
          <div className="profile-tags">
            {talentItem?.profileTags?.length && (
              <ul className="job-skills mt-4">
                {talentItem?.profileTags?.map((tag, idx) => (
                  <li key={idx} className="badge-tag">
                    {tag?.toUpperCase()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

const CompanyProfileCard = ({
  companyItem,
}: {
  companyItem: CompanyProfileItem;
}) => {
  return (
    <div className="job-block-four col-xl-4 col-lg-4 col-md-6 col-sm-12 mt-4">
      <Link href={`/company-info/${companyItem?.userId}`}>
        <div className="inner-box p-3 pt-3">
          <ul className="job-other-info">
            <li className="time">{companyItem.industry?.toUpperCase()}</li>
          </ul>
          <span className="company-logo">
            {companyItem?.profileImage ? (
              <Image
                src={companyItem?.profileImage}
                alt={companyItem?.companyName}
                width={250}
                height={250}
              />
            ) : (
              <FaUser className="mt-3" size={60} />
            )}
          </span>
          <h4 className="fw-bold">{companyItem?.companyName}</h4>
          <div className="location">
            <span className="icon flaticon-map-locator"></span>
            {companyItem?.location}
          </div>
        </div>
      </Link>
    </div>
  );
};

const DashboardProfileCards: React.FC<{ role: Role }> = ({ role }) => {
  const { getRecommendedDashboardProfiles } = NebulaiApi();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardProfiles", role], // queryKey
    queryFn: () => getRecommendedDashboardProfiles(role), // queryFn
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    onError: (error: any) => {
      console.error(error?.message);
    },
  });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center p-8rem fw-bolder">
        <BarLoader color="#ab31ff" />
      </div>
    );
  }

  let recommendedProfiles: RecommendedProfile<typeof role> = data;

  if (!recommendedProfiles.length) {
    return (
      <div className="job-block-four col-xl-4 col-lg-4 col-md-6 col-sm-12 mt-4">
        No Profiles Found 🥲
      </div>
    );
  }

  if (role === "talent") {
    return (
      <>
        {recommendedProfiles?.map((item) => (
          <React.Fragment key={item._id}>
            <TalentProfileCard talentItem={item as TalentProfileItem} />
          </React.Fragment>
        ))}
      </>
    );
  }

  if (role === "company") {
    return (
      <>
        {recommendedProfiles?.map((item) => (
          <React.Fragment key={item._id}>
            <CompanyProfileCard companyItem={item as CompanyProfileItem} />
          </React.Fragment>
        ))}
      </>
    );
  }

  return null;
};

export default DashboardProfileCards;
