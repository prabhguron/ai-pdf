"use client";
interface JobOverviewProps {
  postedOnRaw: string;
  applicationDeadlineFormatted: string;
  location: string;
  jobTitle: string;
  compensation: string;
  currencyType: string;
}
const JobOverview = ({
  postedOnRaw,
  applicationDeadlineFormatted,
  location,
  jobTitle,
  compensation,
  currencyType,
}: JobOverviewProps) => {
  return (
    <div className="widget-content">
      <ul className="job-overview">
        <li>
          <i className="icon icon-calendar"></i>
          <h5>Date Posted:</h5>
          <span>{postedOnRaw}</span>
        </li>
        <li>
          <i className="icon icon-expiry"></i>
          <h5>Expiration date:</h5>
          <span>{applicationDeadlineFormatted}</span>
        </li>
        <li>
          <i className="icon icon-location"></i>
          <h5>Location:</h5>
          <span>{location}</span>
        </li>
        <li>
          <i className="icon icon-user-2"></i>
          <h5>Job Title:</h5>
          <span>{jobTitle}</span>
        </li>
        <li>
          <i className="icon icon-salary"></i>
          <h5>Compensation:</h5>
          <span className="fw-bolder">
            {compensation} {currencyType?.toUpperCase()}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default JobOverview;
