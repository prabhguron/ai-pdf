"use client";
import React, { useEffect, useState } from "react";
import CompanyProfileApi from "@/neb-api/CompanyProfileApi";
import { toast } from "react-toastify";
import { FaHandshake } from "react-icons/fa";
import PartnershipForm from "./PartnershipForm";
import useConfirm from "@/context/ConfirmDialog";
import { getFormData } from "@/utils/helper";
import { fetchUserProfile } from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

const partnershipsImgKey = "partnershipsImages";

const CompanyPartnerships = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { userProfile } = useAppSelector((state) => state.auth);
  const companyProfile = userProfile as CompanyUserProfile;
  const { createCompanyPartner, updateCompanyPartner, deleteCompanyPartner } =
    CompanyProfileApi();
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [editingPartner, setEditingPartner] = useState<Partnership | null>(
    null,
  );
  const [savingPartner, setSavingPartner] = useState(false);

  useEffect(() => {
    if (companyProfile?.partnerships) {
      const allPartnerships = companyProfile?.partnerships;
      setPartnerships(allPartnerships);
    }
  }, [userProfile]);

  const newPartnerHandler = async (
    partnerValues: Partnership,
    { resetForm }: any,
  ) => {
    setSavingPartner(true);
    try {
      const formData = getFormData(partnerValues, partnershipsImgKey);
      const { status, data } = await createCompanyPartner(formData);
      if (status === 200) {
        const { id, images } = data?.partnership;
        partnerValues["_id"] = id;
        partnerValues[partnershipsImgKey] = images;
        setPartnerships((prevPartnerInfo) => [
          ...prevPartnerInfo,
          partnerValues,
        ]);
        resetForm();
        setSavingPartner(false);
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    setSavingPartner(false);
    toast.error("Something went wrong");
  };

  const deletePartnerHandler = async (partnerId: string) => {
    const choice = await confirm({
      title: "Delete Partner",
      description: "Are you sure you want to delete?",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice || !partnerId) return;
    try {
      const { status } = await deleteCompanyPartner(partnerId);
      if (status === 204) {
        toast.success("Deleted partner");
        const remainingPartners = partnerships.filter(
          (c) => c._id !== partnerId,
        );
        setPartnerships(remainingPartners);
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    toast.error("Something went wrong");
  };

  const editPartnerHandler = async (
    partnerInfo: Partnership,
    { resetForm }: any,
  ) => {
    setSavingPartner(true);
    try {
      const { _id: partnerId, ...partnerUpdatedInfo } = partnerInfo;
      if (typeof partnerId === "undefined") return;
      const formData = getFormData(partnerUpdatedInfo, partnershipsImgKey);
      const { status, data } = await updateCompanyPartner(partnerId, formData);
      if (status === 200) {
        const { partnership } = data;
        const partnerIdx = partnerships.findIndex((p) => p._id === partnerId);
        if (partnerIdx !== -1) {
          let allPartners = [...partnerships];
          allPartners[partnerIdx] = partnership;
          setPartnerships(allPartners);
        }
        resetForm();
        setSavingPartner(false);
        dispatch(fetchUserProfile());
        toast.success("Updated project");
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setSavingPartner(false);
    toast.error("Something went wrong");
  };

  const enableEditPartner = (caseDetails: Partnership) => {
    setEditingPartner(caseDetails);
  };

  return (
    <>
      <div className="mb-2">
        {!!editingPartner?.name?.length && (
          <span className="mb-3 h5">
            <em>
              You are now editing <strong>{editingPartner?.name}</strong>
            </em>
          </span>
        )}
      </div>
      <PartnershipForm
        info={partnerships}
        newInfoHandler={newPartnerHandler}
        defaultListIcon={<FaHandshake className="defaultIcon" />}
        submitLoader={savingPartner}
        deleteInfoHandler={deletePartnerHandler}
        partnerImgKey={partnershipsImgKey}
        editInfoHandler={editPartnerHandler}
        editModeCallBack={enableEditPartner}
      />
    </>
  );
};

export default CompanyPartnerships;

