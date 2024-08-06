"use client";
import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/store";
import { convertRating } from "@/utils/helper";

const ProfileRating = () => {
  const { getProfileRating } = NebulaiApi();
  const { userProfile } = useAppSelector((state) => state.auth);
  const profileCompleted = useAppSelector(
    (state) => state.getStartedSteps.profileStat?.profileCompleted,
  );
  const talentProfile = userProfile as TalentUserProfile;
  const talentRating = talentProfile?.rating ?? 0;
  const userId = talentProfile.userId;

  const [gettingRating, setGettingRating] = useState(false);
  const [profileRating, setProfileRating] = useState(talentRating);
  const [ratingRequests, setRatingRequests] = useState(0);

  useEffect(() => {
    // on render: talentProfile starts as undefined
    // once profile is pulled from redux we update local state
    setProfileRating(talentRating);
  }, [talentRating]);

  useEffect(() => {
    setRatingRequests(talentProfile?.ratingRequests?.length);
  }, [talentProfile]);

  const ratingInstructionText = {
    initial: "Get your AI-assessed score now!",
    // completed:
    //   "Great news! Your profile has a new AI rating. Share it with the world!",
    completed: "Great news! Your profile has a new AI rating.",
    suggest: "Want a higher score? Enhance your profile and reassess!",
  };

  async function getRatingHandler() {
    let message = "Something went wrong";
    let type = "error";
    try {
      setGettingRating(true);
      // send to rating endpoint - get rating response
      const {
        data: { status, rating, ratingRequests, error, message: apiMsg },
      }: { data: GetProfileRatingResponse } = await getProfileRating(userId);
      console.log("getProfileRating: ", {
        status,
        rating,
        ratingRequests,
        error,
        apiMsg,
      });
      if (status === "success" && rating) {
        // update local rating state
        setProfileRating(rating);
        setRatingRequests(ratingRequests?.length ?? 1);
        message = `Your new profile rating is ${convertRating(rating, "string")}`;
        type = status;
      }

      if (status === "error" && apiMsg) {
        // error from api
        message = apiMsg;
        type = status;
      }
    } catch (err) {
      console.error(err);
    }
    setGettingRating(false);
    toast(message, { type } as any);
  }

  // function shareRatingHandler() {}

  return (
    <>
      <div className="widget-content profile-rating">
        <div className="row mb-4">
          <div className="rating-left-content col-xs-4 col-md-8 col-lg-9">
            <p className="instruction-text">
              {!profileRating
                ? ratingInstructionText.initial
                : ratingInstructionText.completed}
            </p>
            {profileRating !== 0 && profileRating < 10 && (
              <p className="instruction-text alert alert-primary suggestion gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ display: "none" }}
                >
                  <symbol
                    id="info-fill"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                  </symbol>
                </svg>
                <svg
                  className="bi flex-shrink-0 me-2"
                  width="24"
                  height="24"
                  role="img"
                  aria-label="Info:"
                >
                  <use xlinkHref="#info-fill" />
                </svg>
                {ratingInstructionText.suggest +
                  ` (${5 - ratingRequests} left this month)`}
              </p>
            )}
            <div
              className={`rating-button-container ${profileRating && "gap-3"}`}
            >
              {!profileRating ? (
                <button
                  onClick={getRatingHandler}
                  className={`theme-btn btn-style-one btn-small btn-full col-xs-12 col-lg-4 ${!profileCompleted ? "disabled-btn" : ""}`}
                >
                  {gettingRating ? (
                    <>
                      Rating...{" "}
                      <span
                        className="spinner-border spinner-border-sm pl-4"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    </>
                  ) : (
                    "Reveal My Rating"
                  )}
                </button>
              ) : (
                <>
                  <button
                    onClick={getRatingHandler}
                    className={`theme-btn btn-style-one btn-small btn-full col-xs-12 col-lg-4 ${ratingRequests >= 5 ? "disabled-btn" : ""}`}
                  >
                    {gettingRating ? (
                      <>
                        Rating...{" "}
                        <span
                          className="spinner-border spinner-border-sm pl-4"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </>
                    ) : (
                      "Reassess Rating"
                    )}
                  </button>
                  {/* Two btn layout with "Share" button for when sharing is implemented */}
                  {/* <button
                    onClick={shareRatingHandler}
                    className="theme-btn btn-style-one btn-small btn-full col col-lg-4 disabled-btn"
                  >
                    Share Rating
                  </button>
                  <button
                    onClick={getRatingHandler}
                    className={`theme-btn btn-style-three btn-small btn-full col col-lg-4 ${ratingRequests >= 5 ? "disabled-btn" : ""}`}
                  >
                    {gettingRating ? (
                      <>
                        Rating...{" "}
                        <span
                          className="spinner-border spinner-border-sm pl-4"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </>
                    ) : (
                      "Reassess Rating"
                    )}
                  </button> */}
                </>
              )}
            </div>
          </div>
          <div className="rating-container col col-xs-12 col-lg-3 gap-3">
            <h4 className="">Talent&nbsp;Rating:</h4>
            <span className="rating-score text-nowrap">
              {profileRating
                ? `${convertRating(profileRating, "string")} / 5.0`
                : "NA"}
            </span>
            <div className="box-rating-stars">
              <StarRatings
                rating={convertRating(profileRating) as number}
                starRatedColor="#ab31ff"
                numberOfStars={5}
                name="talent-rating"
                starDimension="25px"
                starSpacing="0px"
                svgIconViewBox="0 0 16 16"
                svgIconPath="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileRating;
