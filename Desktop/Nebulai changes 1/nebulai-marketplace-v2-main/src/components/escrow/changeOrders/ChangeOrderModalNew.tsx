"use client";
import Modal from "react-modal";
import "./change-order-modal.css";
import TextAreaField from "@/components/form/TextAreaField";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import React from "react";
import { TextField } from "@/components/form/TextField";
import { useAppSelector } from "@/redux/store";

import { PiCoinsLight } from "react-icons/pi";
import InfoInner from "@/components/common/InfoInner";

type ValidateField =
  | "changeOrderDesc"
  | "adjustedProjectFee"
  | "talentStakeForfeit";

const validate = (validateFields: ValidateField[]) =>
  Yup.object().shape({
    ...(validateFields.includes("changeOrderDesc") && {
      changeOrderDesc: Yup.string()
        .test(
          "wordCount",
          "Maximum word count exceeded, should be less than 500 words",
          (value: any) => {
            const wordCount = value.trim().split(/\s+/).length;
            return wordCount <= 500;
          }
        )
        .required("Required"),
    }),
    ...(validateFields.includes("adjustedProjectFee") && {
      adjustedProjectFee: Yup.number()
        .typeError("Must be a number")
        .min(1, "Minimum one value allowed")
        .required("Required"),
    }),
    ...(validateFields.includes("talentStakeForfeit") && {
      adjustedProjectFee: Yup.number()
        .typeError("Must be a number")
        .min(0, "Minimum one value allowed")
        .required("Required"),
    }),
  });

export interface ChangeOrderFormInit {
  changeOrderDesc?: string;
  adjustedProjectFee: number;
  talentStakeForfeit: number;
}

interface ChangeOrderModal {
  isOpen: boolean;
  onClose: any;
  modalTitle: string;
  onSubmitHandler: (
    values: ChangeOrderFormInit,
    { resetForm }: FormikHelpers<ChangeOrderFormInit>
  ) => void;
  modalId: string;
  formInitPayload?: ChangeOrderFormInit;
  validateFields?: ValidateField[];
}

const ChangeOrderModalNew = ({
  isOpen,
  onClose,
  modalTitle,
  onSubmitHandler,
  modalId,
  formInitPayload = {
    changeOrderDesc: "",
    adjustedProjectFee: 0,
    talentStakeForfeit: 0,
  },
  validateFields = [
    "changeOrderDesc",
    "adjustedProjectFee",
    "talentStakeForfeit",
  ],
}: ChangeOrderModal) => {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;
  const currencyType = useAppSelector(
    (state) => state.contractInfo?.contractDetails?.currencyType
  );
  const projectFee = useAppSelector(
    (state) => state.contractInfo?.contractDetails?.projectFee
  );
  const talentStake = useAppSelector(
    (state) => state.contractInfo?.contractDetails?.providerStake
  );
  
  return (
    <Modal
      id={modalId}
      isOpen={isOpen}
      contentLabel="Modal"
      className={{
        base: "change-order-modal-base change-order-modal-style",
        afterOpen: "change-order-modal-base_after-open",
        beforeClose: "change-order-modal-base_before-close",
      }}
      overlayClassName={{
        base: "overlay-base",
        afterOpen: "overlay-base_after-open",
        beforeClose: "overlay-base_before-close",
      }}
      ariaHideApp={false}
    >
      <div className="row mb-2">
        <div className="col-6">
            <h4 className="fw-bold">{modalTitle}</h4>
        </div>
        <div className="col-6 mb-2">
          <button
            type="button"
            className="btn-close pull-right"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
      <div className="changeOrderModalBody">
        <Formik
          initialValues={formInitPayload}
          validationSchema={validate(validateFields)}
          onSubmit={onSubmitHandler}
        >
          {(formik) => (
            <Form className="default-form default-form-small">
              <div className="row">
                <div className="category-block col-12 col-md-12 col-lg-6 col-xl-6 mb-2">
                  <InfoInner
                    iconSpanElement={<span className="flaticon-money-1"></span>}
                    value={`${projectFee ?? "-"} ${
                      currencyType?.toUpperCase() ?? ""
                    }`}
                    label="Current Compensation"
                  />
                </div>
                <div className={`category-block col-12 col-md-12 col-lg-6 col-xl-6 mb-2 ${role === 'talent' ? 'd-none' : ''}`}>
                  <InfoInner
                    iconSpanElement={<PiCoinsLight />}
                    value={`${talentStake ?? "-"} ${
                      currencyType?.toUpperCase() ?? ""
                    }`}
                    label="Current Talent Stake"
                  />
                </div>
              </div>
              <div className="row">
                {validateFields.includes("adjustedProjectFee") && (
                  <div className="form-group col-lg-8 col-md-12 mb-2">
                    <TextField
                      min={0}
                      label="Adjusted Compensation Fee"
                      name="adjustedProjectFee"
                      type="number"
                      autoComplete="off"
                    />
                  </div>
                )}
                {validateFields.includes("talentStakeForfeit") && (
                  <div className={`form-group col-lg-8 col-md-12 mb-2 ${(parseInt(talentStake ?? "0") === 0 || role === 'talent') ? 'd-none' : ''}`}>
                    <TextField
                      min={0}
                      label="Talent Stake Forfeit"
                      name="talentStakeForfeit"
                      type="number"
                      autoComplete="off"
                    />
                  </div>
                )}
                {validateFields.includes("changeOrderDesc") && (
                  <div className="form-group col-lg-12 col-md-12">
                    <TextAreaField label="Description" name="changeOrderDesc" />
                  </div>
                )}

                <div className="form-group">
                  <button
                    type="submit"
                    className="theme-btn btn-style-one btn-small"
                  >
                    Initiate
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default ChangeOrderModalNew;
