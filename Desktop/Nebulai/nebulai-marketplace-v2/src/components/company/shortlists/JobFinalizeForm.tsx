"use client";
import OffersApi from "@/neb-api/OffersApi";
import DatePickerCommon from "@/components/form/DatePickerCommon";
import ImgDropzone from "@/components/form/ImgDropzone";
import SelectField from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import useConfirm from "@/context/ConfirmDialog";
import { ErrorMessage, Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { createDummyFileObject, getFormDataNew } from "@/utils/helper";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { currencyImgMap } from "@/utils/formConstants";
import Image from "next/image";
import { goToStep } from "@/redux/contractSteps/contractStepsSlice";
import useApplicationOffer from "@/hooks/useApplicationOffer";
import { OfferForm } from "./shortListTypes";
import { OFFER_STATUS } from "@/utils/constants";
import OfferSentToTalent from "./infoMessage/OfferSentToTalent";
import { TextFieldGroup } from "@/components/form/TextFieldGroup";
import OfferRejectedByTalent from "./infoMessage/OfferRejectedByTalent";
import useMarketplaceContract from "@/hooks/useMarketplaceContract";
import { FaChevronRight } from "react-icons/fa6";

const mimeTypes: {
  [key: string]: [];
} = {
  "image/jpeg": [],
  "image/jpg": [],
  "image/png": [],
  "application/pdf": [],
  "application/docx": [],
  "application/msword": [],
  "text/csv": [],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
};

const validate = Yup.object().shape({
  jobTitle: Yup.string()
    .max(50, "Must be 50 characters or less")
    .required("Required"),
  currencyType: Yup.string().max(30, "Must be 30 characters or less"),
  compensation: Yup.number()
    .typeError("Must be a number")
    .min(1, "Minimum one value allowed")
    .required("Required"),
  providerStake: Yup.number()
    .typeError("Must be a number")
    .min(0, "Minimum zero value allowed")
    .required("Required"),
  jobRequirements: Yup.array()
    .min(1, "Please add at-least one requirement")
    .of(Yup.string().required()),
  jobResources: Yup.array()
    .max(3, "You can select up to 3 images only")
    .of(
      Yup.mixed()
        .test(
          "fileSize",
          "File size must be less than 20MB",
          (value: any) => value && value.size <= 20971520,
        )
        .test(
          "fileType",
          "Only JPEG, JPG, PNG, DOCX, PDF, CSV, XLSX are allowed",
          (value: any) => value && Object.keys(mimeTypes).includes(value.type),
        ),
    )
    .min(1, "Please add at-least one resource"),
  dueDate: Yup.string()
    .max(30, "Must be 30 characters or less")
    .required("Required"),
  talentWalletAddress: Yup.string()
    .max(42, "Must be 42 characters or less")
    .required("Required"),
  projectReviewPeriod: Yup.number()
    .typeError("Must be a number")
    .min(1, "Minimum 1 day allowed")
    .required("Required"),
});

const initialFormValues: OfferForm = {
  jobTitle: "",
  jobRequirementTxt: "",
  jobRequirements: [],
  jobResources: [],
  providerStake: "0",
  compensation: "",
  currencyType: "nebtt",
  dueDate: "",
  talentWalletAddress: "",
  projectReviewPeriod: 1,
};

const JobFinalizeForm = () => {
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const selectedOfferInfo = useAppSelector(
    (state) => state.jobOffer.selectedOfferInfo,
  );
  const { updateJobOffer } = OffersApi();
  const { updateJobOfferState } = useApplicationOffer();
  const [initValues, setInitialValues] = useState<any>(
    selectedOfferInfo || initialFormValues,
  );

  const [currencyImg, setCurrencyImg] = useState(
    currencyImgMap[selectedOfferInfo?.currencyType?.toLowerCase() ?? ""] ?? "",
  );
  const { createJobOffer } = OffersApi();
  const [formActionLoading, setFormActionLoading] = useState(false);
  const [ercTokens, setErcTokens] = useState<TokenOption[]>([]);
  const { getErc20Tokens } = useMarketplaceContract();
  const memoizedGetErc20Tokens = useMemo(() => {
    return getErc20Tokens;
  }, [getErc20Tokens]);

  useEffect(() => {
    const fetchTokens = async () => {
      const options = await memoizedGetErc20Tokens();
      if (options) {
        setErcTokens(options);
      }
    };
    fetchTokens();
  }, []);

  const reviewPeriodOptions = useMemo(() => {
    const array = [];
    for (let i = 1; i <= 30; i++) {
      const label = `${i} day${i !== 1 ? "s" : ""}`;
      array.push({ value: i, label });
    }
    return array;
  }, []);

  const createSendJobOfferHandler = async (formInfo: OfferForm) => {
    if (!selectedOfferInfo?.applicationId) return;
    const choice = await confirm({
      title: "Send Job Offer ?",
      description: `Attention: Once sent, you cannot make any changes till the talent responds!`,
      btnLabel: "Proceed",
      btnClass: "theme-btn btn-style-one btn-xs",
      btnCloseLbl: "Cancel",
      btnCloseClass: "btn-style-eight btn-xs",
      customBtnLabel: "Save as draft",
      customBtnClass: "theme-btn btn-style-three btn-xs",
      zIndexCustom: true,
    });
    if (!choice) return;
    setFormActionLoading(true);
    try {
      const sendOfferToTalent = choice === "customClick" ? false : true;
      const allFormInfo = {
        ...formInfo,
        sendOfferToTalent,
      };
      const formData = getFormDataNew(allFormInfo, [
        "jobResources",
        "jobRequirements",
      ]);
      const { status, data } = await createJobOffer(
        selectedOfferInfo?.applicationId,
        formData,
      );
      const toastMsg =
        choice === "customClick"
          ? "Job offer saved as draft"
          : "Job offer sent to talent successfully";
      if (status === 201) {
        const { offerId, newOffer } = data;
        if (offerId && newOffer) {
          await updateJobOfferState(offerId, newOffer, sendOfferToTalent);
          setFormActionLoading(false);
          toast.success(toastMsg);
          //handleContractNextStep();o
          return;
        }
      }
    } catch (error) {}
    setFormActionLoading(false);
    toast.error("Something went wrong");
  };

  useEffect(() => {
    if (selectedOfferInfo) {
      setInitialValues(selectedOfferInfo);
    }
  }, [selectedOfferInfo]);

  const updateOfferInfo = async (formPayload: OfferForm) => {
    if (!selectedOfferInfo?.offerId) return;
    const choice = await confirm({
      title: "Update & Send Job Offer ?",
      description: `Are you sure you want to update and send the job offer to talent?`,
      btnLabel: "Proceed",
      btnClass: "theme-btn btn-style-one btn-xs",
      btnCloseLbl: "Cancel",
      btnCloseClass: "btn-style-eight btn-xs",
      customBtnLabel: "Update",
      customBtnClass: "theme-btn btn-style-three btn-xs",
      zIndexCustom: true,
    });
    if (!choice) return;
    setFormActionLoading(true);
    try {
      const sendOfferToTalent = choice === "customClick" ? false : true;
      let formValues = {
        ...formPayload,
        sendOfferToTalent,
      };
      if (formValues?.jobResources?.length > 0) {
        formValues.jobResources = formValues.jobResources.map(
          (resource: any) => {
            if (resource?.dummy) {
              resource = createDummyFileObject(
                resource?.name,
                "application/pdf",
              );
            }
            return resource;
          },
        );
      }
      const formData = getFormDataNew(formValues, [
        "jobResources",
        "jobRequirements",
      ]);
      const { status, data } = await updateJobOffer(
        selectedOfferInfo?.offerId,
        formData,
      );
      const toastMsg =
        choice === "customClick"
          ? "Job offer updated successfully"
          : "Job offer sent to talent successfully";
      if (status === 200) {
        const { offerId, updatedOffer } = data;
        if (offerId && updatedOffer) {
          await updateJobOfferState(offerId, updatedOffer, sendOfferToTalent);
          setFormActionLoading(false);
          toast.success(toastMsg);
          return;
        }
      }
    } catch (error) {}
    setFormActionLoading(false);
    toast.error("Something went wrong");
  };

  const currencyOpts = ercTokens?.map((c) => {
    if (!currencyImg.length) {
      setCurrencyImg(c?.imgSrc);
    }
    return {
      value: c.value,
      label: (
        <div>
          {c?.label}{" "}
          <Image src={c?.imgSrc} width={30} height={30} alt={c.imgAlt} />
        </div>
      ),
    };
  });

  const handleContractNextStep = () => {
    dispatch(goToStep(2));
  };

  const currencyChangeHandler = (data: any) => {
    if (data?.value && currencyImgMap[data.value]) {
      setCurrencyImg(currencyImgMap[data.value]);
    }
  };

  const disableNextBtn =
    !selectedOfferInfo?.existingOffer ||
    selectedOfferInfo?.offerStatus !== OFFER_STATUS["APPROVED"];

  return (
    <Formik
      initialValues={initValues}
      validationSchema={validate}
      onSubmit={
        selectedOfferInfo?.offerId ? updateOfferInfo : createSendJobOfferHandler
      }
      enableReinitialize
    >
      {(formik) => (
        <Form className="default-form default-form-small">
          <div className="row">
            {selectedOfferInfo?.offerStatus === OFFER_STATUS["OFFERED"] &&
              selectedOfferInfo?.isOfferSent && <OfferSentToTalent />}
            {selectedOfferInfo?.offerStatus === OFFER_STATUS["REJECTED"] &&
              selectedOfferInfo?.isOfferSent && <OfferRejectedByTalent />}
            {/* {selectedOfferInfo?.offerStatus === OFFER_STATUS["APPROVED"] &&
              !selectedOfferInfo?.escrowProjectId && (
                <span className="my-3 h5">
                  <em>
                    Offer Has Been Approved By Talent, Please Visit{" "}
                    <strong>Offer Details Tab</strong> To Initiate The Job
                  </em>
                </span>
              )}
            {selectedOfferInfo?.offerStatus === OFFER_STATUS["REJECTED"] &&
              selectedOfferInfo?.isOfferSent && (
                <span className="my-3 h5 text-danger">
                  <em>Offer Rejected By Talent</em>
                </span>
              )} */}
            <div className="form-group col-lg-4 col-md-12 mb-3">
              <TextField
                label="Job Title"
                name="jobTitle"
                type="text"
                autoComplete="off"
                disabled={selectedOfferInfo?.isOfferSent}
              />
            </div>
            <div className="form-group col-lg-4 col-md-12 mb-3">
              <SelectField
                label={"Talent Wallet Address"}
                name="talentWalletAddress"
                options={selectedOfferInfo?.linkedWalletOptions ?? null}
                defaultValue={initValues?.talentWalletAddress}
                placeholder="Select Wallet Address"
                isDisabled={selectedOfferInfo?.isOfferSent}
              />
            </div>

            <div className="form-group col-lg-4 col-md-12 mb-3">
              <SelectField
                label={"Project Review Period"}
                name="projectReviewPeriod"
                options={reviewPeriodOptions}
                defaultValue={initValues?.projectReviewPeriod ?? 1}
                placeholder="Select Review Period"
                isDisabled={selectedOfferInfo?.isOfferSent}
              />
            </div>

            <div className="form-group col-lg-4 col-md-12 mb-3">
              <label>Due Date</label>
              <div className="customDatePickerWidth">
                <DatePickerCommon
                  name="dueDate"
                  placeholderText="Select Date"
                  disabled={selectedOfferInfo?.isOfferSent}
                />
              </div>
            </div>
            <div className="form-group col-lg-4 col-md-12 mb-3">
              <SelectField
                label={"Currency Type"}
                name="currencyType"
                options={currencyOpts}
                placeholder="Select Currency"
                isDisabled={selectedOfferInfo?.isOfferSent}
                onChangeCallback={currencyChangeHandler}
              />
            </div>
            <div className="form-group col-lg-4 col-md-12 mb-3 pt-2">
              <TextFieldGroup
                label="Compensation"
                name="compensation"
                type="number"
                min="1"
                autoComplete="off"
                disabled={selectedOfferInfo?.isOfferSent}
                groupIcon={
                  currencyImg.length ? (
                    <Image src={currencyImg} width={22} height={22} alt={""} />
                  ) : (
                    ""
                  )
                }
              />
            </div>
            <div className="form-group col-lg-4 col-md-12 mb-3 pt-2">
              <TextFieldGroup
                label="Talent Stake"
                name="providerStake"
                type="number"
                autoComplete="off"
                min="0"
                disabled={selectedOfferInfo?.isOfferSent}
                groupIcon={
                  currencyImg.length ? (
                    <Image src={currencyImg} width={22} height={22} alt={""} />
                  ) : (
                    ""
                  )
                }
              />
            </div>

            <div className="form-group col-lg-6 col-md-12 mb-3">
              <div className="mb-2">
                <label>Support Materials</label>
                <ImgDropzone
                  /* setFieldValue={formik.setFieldValue} */
                  fieldName={"jobResources"}
                  maxImg={4}
                  acceptedFileType={mimeTypes}
                  dropZoneMsg="Drag 'n' drop some files here, or click to select files"
                  disabled={selectedOfferInfo?.isOfferSent}
                />
              </div>
            </div>

            {!selectedOfferInfo?.isOfferSent && (
              <div className="form-group col-lg-6 col-md-12 mb-3">
                <TextField
                  label="Job Milestones"
                  name="jobRequirementTxt"
                  type="text"
                  autoComplete="off"
                />
                <ErrorMessage
                  component="div"
                  name="jobRequirements"
                  className="error text-danger"
                />
                <button
                  type="button"
                  className="theme-btn btn-style-one btn-xs add-job-requirement"
                  onClick={() => {
                    if (formik.values?.jobRequirementTxt?.length <= 0) return;
                    formik.setFieldValue("jobRequirements", [
                      ...formik.values.jobRequirements,
                      formik.values?.jobRequirementTxt,
                    ]);
                    formik.setFieldValue("jobRequirementTxt", "");
                  }}
                >
                  ADD MILESTONE
                </button>
              </div>
            )}

            <div
              className={`form-group col-lg-${
                selectedOfferInfo?.isOfferSent ? "6" : "6"
              } col-md-12 mb-3`}
            >
              {selectedOfferInfo?.isOfferSent && (
                <span className="fw-bold">Job Milestones</span>
              )}
              <ul
                className={`list-style-one list-style-one-custom ${selectedOfferInfo?.isOfferSent ? "mt-1" : ""}`}
              >
                {formik.values?.jobRequirements.map((req: any, idx: any) => (
                  <li
                    key={idx}
                    className={
                      !selectedOfferInfo?.isOfferSent
                        ? "d-flex justify-content-between p-2 mb-1"
                        : "mb-1 p-1"
                    }
                  >
                    {req}
                    {!selectedOfferInfo?.isOfferSent && (
                      <button
                        type="button"
                        onClick={() => {
                          if (formik.values?.jobRequirements?.length <= 0)
                            return;
                          const requirements =
                            formik.values.jobRequirements.filter(
                              (r: any, rIdx: any) => rIdx !== idx,
                            );
                          formik.setFieldValue("jobRequirements", requirements);
                        }}
                      >
                        <span className="la la-trash"></span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="row">
              {!selectedOfferInfo?.isOfferSent && (
                <div className="form-group col-lg-6 col-md-6 mt-2">
                  <button
                    type="submit"
                    className="theme-btn btn-style-one btn-small w-100"
                    disabled={formActionLoading}
                  >
                    {formActionLoading ? (
                      <>
                        Please Wait...{" "}
                        <span
                          className="spinner-border spinner-border-sm pl-4"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </>
                    ) : selectedOfferInfo?.offerId ? (
                      "UPDATE AND SEND OFFER"
                    ) : (
                      "SEND OFFER"
                    )}
                  </button>
                </div>
              )}

              <div className="form-group col-lg-6 col-md-6 mt-2">
                <button
                  className={`theme-btn btn-style-three btn-small w-100 gap-1 ${
                    disableNextBtn && "disabled-btn"
                  }`}
                  type="button"
                  onClick={handleContractNextStep}
                  disabled={disableNextBtn}
                >
                  Next
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default JobFinalizeForm;
