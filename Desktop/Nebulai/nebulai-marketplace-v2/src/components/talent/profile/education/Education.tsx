"use client";
import React, { useEffect, useRef, useState } from "react";
import EducationModal from "./EducationModal";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { toast } from "react-toastify";
import useConfirm from "@/context/ConfirmDialog";
import { fetchUserProfile } from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

const Education = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { userProfile } = useAppSelector((state) => state.auth);
  const talentProfile = userProfile as TalentUserProfile;
  const educationModalRef = useRef(null);
  const modalId = "educationModal";
  const { updateTalentEducation, deleteTalentEducation } = NebulaiApi();
  const [educations, setEducations] = useState<TalentEducation[]>([]);

  useEffect(() => {
    if (talentProfile?.education) {
      const allEducation = talentProfile?.education;
      setEducations(allEducation);
    }
  }, [userProfile]);

  const addEducationHandler = async (
    values: TalentEducation,
    { resetForm }: any,
  ) => {
    try {
      const { status, data } = await updateTalentEducation(values);
      if (status === 200) {
        const { education } = data;
        values["_id"] = education;
        setEducations([]);
        resetForm();
        window.$(educationModalRef.current).find(".modalCloseBtn").click();
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    toast.error("Something went wrong");
  };

  const deleteEducationHandler = async (educationId: string) => {
    const choice = await confirm({
      title: "Delete Education",
      description: "Are you sure you want to delete?",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice || !educationId) return;
    try {
      const { status } = await deleteTalentEducation(educationId);
      if (status === 204) {
        setEducations([]);
        dispatch(fetchUserProfile());
        toast.success("Deleted education");
        return;
      }
    } catch (error) {}
    toast.error("Something went wrong");
  };

  return (
    <div className="resume-outer theme-blue">
      <EducationModal
        modalTitle={"Add New Education"}
        onSubmitHandler={addEducationHandler}
        modalRef={educationModalRef}
        modalId={modalId}
      />
      <div className="upper-title mb-4">
        <h3>Education</h3>
        <button
          className="add-info-btn addEducation"
          data-bs-toggle="modal"
          data-bs-target={`#${modalId}`}
        >
          <span className="icon flaticon-plus"></span> Add Education
        </button>
      </div>

      {educations.map(({ courseName, college, startYear, endYear, _id }, i) => (
        <div className="resume-block" key={i}>
          <div className="inner">
            <span className="name">{college[0].toUpperCase()}</span>
            <div className="title-box">
              <div className="info-box">
                <h3>{college}</h3>
                <span>{courseName}</span>
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
                        deleteEducationHandler(_id);
                      }
                    }}
                  >
                    <span className="la la-trash"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Education;
