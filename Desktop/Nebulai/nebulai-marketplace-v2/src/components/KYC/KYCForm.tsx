import { Form, Formik } from "formik";
import React, { useRef } from "react";
import countryOptions from "./country.json";
import ImgDropzone from "../form/ImgDropzone";
import SelectField from "@/components/form/SelectField";
import * as Yup from "yup";
import { KYC_SUPPORTED_DOCUMENTS_OPTIONS } from "@/utils/constants";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { getFormData } from "@/utils/helper";
import { TypeOptions, toast } from "react-toastify";
import { setKYCPending, setOnBoardingComplete } from "@/redux/getStartedSteps/getStartedStepsSlice";
import { useAppDispatch } from "@/redux/store";

const validate = Yup.object().shape({
  country: Yup.string().required("Required"),
  idDocType: Yup.string().required("Required"),
  idDoc: Yup.array()
    .length(1, "Identity Document Is Required")
    .required()
    .max(1, "You can select only one document")
    .of(
      Yup.mixed()
        .test(
          "fileSize",
          "File size must be less than 20MB",
          (value: any) => value && value.size <= 20971520
        )
        .test(
          "fileType",
          "Only JPEG, PNG are allowed",
          (value: any) =>
            value && ["image/jpeg", "image/png"].includes(value.type)
        )
    ),
});

interface KYCFormInterface {
  country: string;
  idDocType: string;
  idDoc: (string | File)[];
}

const KYCForm: React.FC<{
  path: "onboarding" | "retry";
  initValues?: KYCFormInterface;
}> = ({
  path = "retry",
  initValues = {
    country: "USA",
    idDocType: "PASSPORT",
    idDoc: [],
  },
}) => {
  const dispatch = useAppDispatch();
  const formRef = useRef(null);
  const { submitUserKYC } = NebulaiApi();

  const submitKYCHandler = async (formValues: KYCFormInterface) => {
    let status = "error" as TypeOptions;
    let msg = "Something went wrong";
    try {
      const formData = getFormData(formValues, "idDoc");
      const res = await submitUserKYC(formData, {
        path,
      });
      const responseData = res?.data;
      status = responseData?.status ?? "error";
      msg = responseData?.message;
      if (status === "success") {
        dispatch(setOnBoardingComplete(true));
        dispatch(setKYCPending());
      }
    } catch (error) {}
    toast(msg, {
      type: status,
    });
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={initValues}
      validationSchema={validate}
      onSubmit={submitKYCHandler}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="default-form">
          <div className="row p-4">
            <div className="form-group col-lg-4 col-md-12">
              <SelectField
                label={"Country"}
                name="country"
                options={countryOptions}
              />
            </div>
            <div className="form-group col-lg-4 col-md-12">
              <SelectField
                label={"Identity Document"}
                name="idDocType"
                options={KYC_SUPPORTED_DOCUMENTS_OPTIONS}
              />
            </div>

            <div className="form-group col-lg-12 col-md-12">
              <div className="mb-2">
                <label>Upload KYC Document</label>
                <ImgDropzone
                  fieldName={"idDoc"}
                  maxImg={1}
                />
              </div>
            </div>

            <div className="form-group col-md-12">
              <button
                type="submit"
                className="theme-btn btn-style-one btn-small w-100"
              >
                {isSubmitting ? (
                  <>
                    Submitting...{" "}
                    <span
                      className="spinner-border spinner-border-sm pl-4"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </>
                ) : (
                  "SUBMIT"
                )}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default KYCForm;
