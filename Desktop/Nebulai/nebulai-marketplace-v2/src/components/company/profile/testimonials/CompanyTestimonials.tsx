"use client";
import React, { useEffect, useState } from "react";
import CompanyProfileApi from "@/neb-api/CompanyProfileApi";
import { BsFillPeopleFill } from "react-icons/bs";
import { toast } from "react-toastify";
import TestimonialForm from "./TestimonialForm";
import useConfirm from "@/context/ConfirmDialog";
import { getFormData } from "@/utils/helper";
import { fetchUserProfile } from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

const testimonialImgKey = "testimonialsImages";

const CompanyTestimonials = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { userProfile } = useAppSelector((state) => state.auth);
  const companyProfile = userProfile as CompanyUserProfile;
  const {
    createCompanyTestimonial,
    updateCompanyTestimonial,
    deleteCompanyTestimonial,
  } = CompanyProfileApi();
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [savingTestimonial, setSavingTestimonial] = useState(false);

  useEffect(() => {
    if (companyProfile?.testimonials) {
      const allTestimonials = companyProfile?.testimonials;
      setTestimonials(allTestimonials);
    }
  }, [userProfile]);

  const newTestimonialHandler = async (
    testimonialValues: Testimonial,
    { resetForm }: any,
  ) => {
    setSavingTestimonial(true);
    try {
      const formData = getFormData(testimonialValues, testimonialImgKey);
      const { status, data } = await createCompanyTestimonial(formData);
      if (status === 200) {
        const { id, images } = data?.testimonial;
        testimonialValues["_id"] = id;
        testimonialValues[testimonialImgKey] = images;
        setTestimonials((prevTestimonials) => [
          ...prevTestimonials,
          testimonialValues,
        ]);
        resetForm();
        setSavingTestimonial(false);
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    setSavingTestimonial(false);
    toast.error("Something went wrong");
  };

  const deleteTestimonialHandler = async (testimonialId: string) => {
    const choice = await confirm({
      title: "Delete Testimonial",
      description: "Are you sure you want to delete?",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice || !testimonialId) return;
    try {
      const { status } = await deleteCompanyTestimonial(testimonialId);
      if (status === 204) {
        toast.success("Deleted testimonial");
        const remainingTestimonial = testimonials.filter(
          (t) => t._id !== testimonialId,
        );
        setTestimonials(remainingTestimonial);
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    toast.error("Something went wrong");
  };

  const editTestimonialHandler = async (
    testimonialInfo: Testimonial,
    { resetForm }: any,
  ) => {
    setSavingTestimonial(true);
    try {
      const { _id: testimonialId, ...testimonialUpdatedInfo } = testimonialInfo;
      if (typeof testimonialId === "undefined") return;
      const formData = getFormData(testimonialUpdatedInfo, testimonialImgKey);
      const { status, data } = await updateCompanyTestimonial(
        testimonialId,
        formData,
      );
      if (status === 200) {
        const { testimonial } = data;
        const testimonialIdx = testimonials.findIndex(
          (p) => p._id === testimonialId,
        );
        if (testimonialIdx !== -1) {
          let allTestimonials = [...testimonials];
          allTestimonials[testimonialIdx] = testimonial;
          setTestimonials(allTestimonials);
        }
        resetForm();
        setSavingTestimonial(false);
        toast.success("Updated project");
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setSavingTestimonial(false);
    toast.error("Something went wrong");
  };

  const enableEditTestimonial = (caseDetails: Testimonial) => {
    setEditingTestimonial(caseDetails);
  };

  return (
    <>
      <div className="mb-2">
        {!!editingTestimonial?.clientName?.length && (
          <span className="mb-3 h5">
            <em>
              You are now editing{" "}
              <strong>{editingTestimonial?.clientName}</strong>
            </em>
          </span>
        )}
      </div>
      <TestimonialForm
        info={testimonials}
        newInfoHandler={newTestimonialHandler}
        defaultListIcon={<BsFillPeopleFill className="defaultIcon" />}
        submitLoader={savingTestimonial}
        deleteInfoHandler={deleteTestimonialHandler}
        testimonialImgKey={testimonialImgKey}
        editInfoHandler={editTestimonialHandler}
        editModeCallBack={enableEditTestimonial}
      />
    </>
  );
};

export default CompanyTestimonials;

