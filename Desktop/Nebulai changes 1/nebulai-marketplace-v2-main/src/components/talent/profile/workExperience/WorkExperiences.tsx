"use client";
import React, { useEffect, useRef, useState } from "react";
import WorkExperienceModal from "./WorkExperienceModal";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { toast } from "react-toastify";
import useConfirm from "@/context/ConfirmDialog";
import { fetchUserProfile } from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  setOnBoardingStarted,
  validateGetStartedUserProfile,
} from "@/redux/getStartedSteps/getStartedStepsSlice";

const WorkExperiences = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { userProfile } = useAppSelector((state) => state.auth);
  const profileCompleted = useAppSelector(
    (state) => state.getStartedSteps.profileStat?.profileCompleted,
  );
  const talentUserProfile = userProfile as TalentUserProfile;
  const modalRef = useRef(null);
  const modalId = "workModal";
  const { updateTalentWorkExperience, deleteWorkExperience } = NebulaiApi();
  const [workExperiences, setWorkExperiences] = useState<TalentWorkExp[]>([]);

  useEffect(() => {
    if (talentUserProfile?.workExperiences) {
      const allWork = talentUserProfile?.workExperiences;
      setWorkExperiences(allWork);
    }
  }, [userProfile]);

  const addNewWorkExperienceHandler = async (
    values: TalentWorkExp,
    { resetForm }: any,
  ) => {
    try {
      const { status, data } = await updateTalentWorkExperience(values);
      if (status === 200) {
        const { workExperience } = data;
        values["_id"] = workExperience;
        setWorkExperiences([]);
        resetForm();
        window.$(modalRef.current).find(".modalCloseBtn").click();
        dispatch(fetchUserProfile());
        if (!profileCompleted) {
          dispatch(setOnBoardingStarted(true));
          if (
            talentUserProfile.telegramUsername.length &&
            talentUserProfile.skills.length
          ) {
            dispatch(validateGetStartedUserProfile());
          }
        }
        return;
      }
    } catch (error) {}
    toast.error("Something went wrong");
  };

  const deleteWorkExpHandler = async (workExpId: string) => {
    const choice = await confirm({
      title: "Delete Work Experience",
      description: "Are you sure you want to delete?",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice || !workExpId) return;
    try {
      const { status } = await deleteWorkExperience(workExpId);
      if (status === 204) {
        toast.success("Deleted work experience");
        setWorkExperiences([]);
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    toast.error("Something went wrong");
  };

  return (
    <div className="resume-outer theme-blue">
      <WorkExperienceModal
        modalTitle={"Add New Work Experience"}
        onSubmitHandler={addNewWorkExperienceHandler}
        modalRef={modalRef}
        modalId={modalId}
      />
      <div className="upper-title mb-4">
        <h3>Work Experience</h3>
        <button
          className="add-info-btn addWork"
          data-bs-toggle="modal"
          data-bs-target={`#${modalId}`}
        >
          <span className="icon flaticon-plus"></span> Add Work
        </button>
      </div>

      {workExperiences.map(
        (
          { jobTitle, companyName, description, startYear, endYear, _id },
          i,
        ) => (
          <div className="resume-block" key={i}>
            <div className="inner">
              <span className="name">{companyName[0].toUpperCase()}</span>
              <div className="title-box">
                <div className="info-box">
                  <h3>{jobTitle}</h3>
                  <span>{companyName}</span>
                </div>
                <div className="edit-box">
                  <span className="year">
                    {startYear} - {endYear}
                  </span>
                  <div className="edit-btns">
                    <button className="d-none">
                      <span className="la la-pencil"></span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (_id) {
                          deleteWorkExpHandler(_id);
                        }
                      }}
                    >
                      <span className="la la-trash"></span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="text">{description}</div>
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export default WorkExperiences;
