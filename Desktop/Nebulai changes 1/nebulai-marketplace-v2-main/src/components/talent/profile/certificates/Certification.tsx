"use client";
import React, { useEffect, useState } from "react";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { GrCertificate } from "react-icons/gr";
import { toast } from "react-toastify";
import useConfirm from "@/context/ConfirmDialog";
import CertificationsForm from "./CertificationsForm";
import { getFormData } from "@/utils/helper";
import { fetchUserProfile } from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

const certificateImgKey = "certificatesImages";

const Certification = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { userProfile } = useAppSelector((state) => state.auth);
  const talentProfile = userProfile as TalentUserProfile;

  const {
    createTalentCertificates,
    updateTalentCertificates,
    deleteTalentCertificate,
  } = NebulaiApi();
  const [certificates, setCertificates] = useState<TalentCertificate[]>([]);
  const [editingCert, setEditingCert] = useState<TalentCertificate | null>(
    null,
  );
  const [savingCert, setSavingCert] = useState(false);

  useEffect(() => {
    if (talentProfile?.certificates) {
      const allCerts = talentProfile?.certificates;
      setCertificates(allCerts);
    }
  }, [userProfile]);

  const newCertificateHandler = async (
    certValues: TalentCertificate,
    { resetForm }: any,
  ) => {
    setSavingCert(true);
    try {
      const formData = getFormData(certValues, certificateImgKey);
      const { status, data } = await createTalentCertificates(formData);
      if (status === 200) {
        const { id, images } = data?.certificate;
        certValues["_id"] = id;
        certValues[certificateImgKey] = images;
        setCertificates((prevCertInfo) => [...prevCertInfo, certValues]);
        resetForm();
        setSavingCert(false);
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    setSavingCert(false);
    toast.error("Something went wrong");
  };

  const deleteCertificateHandler = async (certId: string) => {
    const choice = await confirm({
      title: "Delete Certificate",
      description: "Are you sure you want to delete?",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice || !certId) return;
    try {
      const { status } = await deleteTalentCertificate(certId);
      if (status === 204) {
        toast.success("Deleted certificate");
        const remainingCerts = certificates.filter((c) => c._id !== certId);
        setCertificates(remainingCerts);
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    toast.error("Something went wrong");
  };

  const editCertHandler = async (
    certInfo: TalentCertificate,
    { resetForm }: any,
  ) => {
    setSavingCert(true);
    try {
      const { _id: certId, ...certUpdatedInfo } = certInfo;
      if (typeof certId === "undefined") return;
      const formData = getFormData(certUpdatedInfo, certificateImgKey);
      const { status, data } = await updateTalentCertificates(certId, formData);
      if (status === 200) {
        const { certificate } = data;
        const certIdx = certificates.findIndex((c) => c._id === certId);
        if (certIdx !== -1) {
          let allCerts = [...certificates];
          allCerts[certIdx] = certificate;
          setCertificates(allCerts);
        }
        resetForm();
        setSavingCert(false);
        toast.success("Updated Certificate");
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setSavingCert(false);
    toast.error("Something went wrong");
  };

  const enableEditCert = (caseDetails: TalentCertificate) => {
    setEditingCert(caseDetails);
  };

  return (
    <>
      <div className="mb-2">
        {!!editingCert?.name?.length && (
          <span className="mb-3 h5">
            <em>
              You are now editing <strong>{editingCert?.name}</strong>
            </em>
          </span>
        )}
      </div>
      <CertificationsForm
        info={certificates}
        newInfoHandler={newCertificateHandler}
        defaultListIcon={<GrCertificate className="defaultIcon" />}
        submitLoader={savingCert}
        deleteInfoHandler={deleteCertificateHandler}
        certificateImgKey={certificateImgKey}
        editInfoHandler={editCertHandler}
        editModeCallBack={enableEditCert}
      />
    </>
  );
};

export default Certification;

