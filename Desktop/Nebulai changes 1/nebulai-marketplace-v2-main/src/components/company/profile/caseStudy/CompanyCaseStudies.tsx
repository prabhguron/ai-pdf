"use client";
import React, { useEffect, useState } from "react";
import CompanyProfileApi from "@/neb-api/CompanyProfileApi";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { toast } from "react-toastify";
import CaseStudyForm from "./CaseStudyForm";
import useConfirm from "@/context/ConfirmDialog";
import { getFormData } from "@/utils/helper";
import { fetchUserProfile } from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

const caseStudyImgKey = "caseStudiesImages";

const CompanyCaseStudies = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { userProfile } = useAppSelector((state) => state.auth);
  const companyUserProfile = userProfile as CompanyUserProfile;

  const {
    createCompanyCaseStudy,
    updateCompanyCaseStudy,
    deleteCompanyCaseStudy,
  } = CompanyProfileApi();
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(
    null,
  );
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [savingCaseStudy, setSavingCaseStudy] = useState(false);

  useEffect(() => {
    if (companyUserProfile?.caseStudies) {
      const allCaseStudy = companyUserProfile?.caseStudies;
      setCaseStudies(allCaseStudy);
    }
  }, [userProfile]);

  const newCaseStudyHandler = async (
    caseValues: CaseStudy,
    { resetForm }: any,
  ) => {
    setSavingCaseStudy(true);
    try {
      const formData = getFormData(caseValues, caseStudyImgKey);
      const { status, data } = await createCompanyCaseStudy(formData);
      if (status === 200) {
        const { id, images } = data?.caseStudy;
        caseValues["_id"] = id;
        caseValues[caseStudyImgKey] = images;
        setCaseStudies((prevCases) => [...prevCases, caseValues]);
        resetForm();
        setSavingCaseStudy(false);
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    setSavingCaseStudy(false);
    toast.error("Something went wrong");
  };

  const deleteCaseStudyHandler = async (caseId: string) => {
    const choice = await confirm({
      title: "Delete Case Study",
      description: "Are you sure you want to delete?",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice || !caseId) return;
    try {
      const { status } = await deleteCompanyCaseStudy(caseId);
      if (status === 204) {
        toast.success("Deleted Case Study");
        const remainingCases = caseStudies.filter((c) => c._id !== caseId);
        setCaseStudies(remainingCases);
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    toast.error("Something went wrong");
  };

  const editProjectHandler = async (
    caseInfo: CaseStudy,
    { resetForm }: any,
  ) => {
    setSavingCaseStudy(true);
    try {
      const { _id: caseId, ...caseUpdatedInfo } = caseInfo;
      if (typeof caseId === "undefined") return;
      const formData = getFormData(caseUpdatedInfo, caseStudyImgKey);
      const { status, data } = await updateCompanyCaseStudy(caseId, formData);
      if (status === 200) {
        const { caseStudy } = data;
        const caseIdx = caseStudies.findIndex((p) => p._id === caseId);
        if (caseIdx !== -1) {
          let allCaseStudies = [...caseStudies];
          allCaseStudies[caseIdx] = caseStudy;
          setCaseStudies(allCaseStudies);
        }
        resetForm();
        setSavingCaseStudy(false);
        dispatch(fetchUserProfile());
        toast.success("Updated Case Study");
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setSavingCaseStudy(false);
    toast.error("Something went wrong");
  };

  const enableEditCaseStudy = (caseDetails: CaseStudy) => {
    setEditingCaseStudy(caseDetails);
  };

  return (
    <>
      <div className="mb-2">
        {!!editingCaseStudy?.clientName?.length && (
          <span className="mb-3 h5">
            <em>
              You are now editing{" "}
              <strong>{editingCaseStudy?.clientName}</strong>
            </em>
          </span>
        )}
      </div>
      <CaseStudyForm
        info={caseStudies}
        newInfoHandler={newCaseStudyHandler}
        defaultListIcon={<BsFillBriefcaseFill className="defaultIcon" />}
        submitLoader={savingCaseStudy}
        deleteInfoHandler={deleteCaseStudyHandler}
        caseStudyImgKey={caseStudyImgKey}
        editInfoHandler={editProjectHandler}
        editModeCallBack={enableEditCaseStudy}
      />
    </>
  );
};

export default CompanyCaseStudies;

