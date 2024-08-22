"use client"
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { TextField } from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import * as Yup from "yup";
import TextAreaField from "@/components/form/TextAreaField";
import CompanyProfileApi from "@/neb-api/CompanyProfileApi";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "@/utils/helper";
import { COMPANY_INDUSTRY_OPTIONS, COMPANY_LOCATION_OPTIONS, COMPANY_SIZE_OPTIONS, technologyOptions } from "@/utils/formConstants";
import { fetchUserProfile } from "@/redux/auth/authSlice";
import { TextFieldGroup } from "@/components/form/TextFieldGroup";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Image from "next/image";
import { validateGetStartedUserProfile } from "@/redux/getStartedSteps/getStartedStepsSlice";

const validate = Yup.object().shape({
  companyName: Yup.string()
    .max(100, "Must be 100 characters or less")
    .required("Required"),
  telegramUsername: Yup.string()
      .matches(/^[a-zA-Z0-9_]{5,32}$/, 'Invalid Telegram username')
      .required('Telegram username is required'),
  industry: Yup.string()
    .oneOf(COMPANY_INDUSTRY_OPTIONS.map((option) => option.value))
    .required("Required"),
  size: Yup.number()
    .oneOf(COMPANY_SIZE_OPTIONS.map((option) => option.value))
    .required("Required"),
  location: Yup.string()
    .oneOf(COMPANY_LOCATION_OPTIONS.map((option) => option.value))
    .required("Required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  technologies: Yup.array()
    .min(1, "Please select at least one technology")
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      })
    ),
  description: Yup.string()
    .max(1000, "Must be 1000 characters or less")
    .required("Required"),
});


type TechOption = {
    value : string;
    label: string;
}
interface CompanyProfileMainInit {
    companyName: string;
    industry: string;
    location: string;
    size: number;
    email: string;
    telegramUsername: string;
    technologies: TechOption[];
    description: string;
}

const MainProfile = () => {
  const dispatch = useAppDispatch()
  const { userProfile } = useAppSelector((state) => state.auth);
  const profileCompleted = useAppSelector(state => state.getStartedSteps.profileStat?.profileCompleted)
  const companyUserProfile = userProfile as CompanyUserProfile
  const formRef = useRef(null);
  const [logoImg, setLogoImg] = useState<File | null>(null);
  const [logoImgPreview, setLogoImgPreview] = useState<any>(null);
  const [savingInfo, setSavingInfo] = useState(false);
  const { updateCompanyProfileInfo } = CompanyProfileApi();

  useEffect(() => {
		if (logoImg !== null) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setLogoImgPreview(reader.result);
			};
			reader.readAsDataURL(logoImg);
		} else {
			setLogoImgPreview(null);
		}
	}, [logoImg]);

  const logoImgHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e?.target?.files?.[0];
    if(!imgFile) return;
    setLogoImg(imgFile);
  };

  const profileSubmitHandler = async (data: CompanyProfileMainInit) => {
    let message = "Something went wrong";
    let type: any = "error";
    try {
      setSavingInfo(true);
      const formData = new FormData();
      for (let key in data) {
        let value = data[key as keyof CompanyProfileMainInit] as any;
        if (key === "technologies") {
          value = value as TechOption[]
          key = `${key}[]`;
          value.forEach((v: TechOption) => {
            if (v?.value) {
              formData.append(key, v?.value);
            }
          });
        } else {
          formData.append(key, value);
        }
      }
      if (logoImg?.name) {
        formData.append("profileImage", logoImg);
      }
     
      const res = await updateCompanyProfileInfo(formData);
      if (res?.data) {
        const { status } = res.data;
        if (status.toLowerCase() === "success") {
          type = status.toLowerCase();
          message = "Updated Profile";
          dispatch(fetchUserProfile())
          if(!profileCompleted){
            dispatch(validateGetStartedUserProfile());
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    setSavingInfo(false);
    toast(message, { type });
  };

  

  const profileInitFields: CompanyProfileMainInit = {
    companyName: companyUserProfile?.companyName || "",
    industry: companyUserProfile?.industry || "",
    location: companyUserProfile?.location || "",
    size: companyUserProfile?.size || 0,
    email: companyUserProfile?.email || "",
    telegramUsername: companyUserProfile?.telegramUsername || "",
    technologies: companyUserProfile?.technologies
      ? companyUserProfile?.technologies.map((l) => ({
          value: l,
          label: capitalizeFirstLetter(l),
        }))
      : [],
    description: companyUserProfile?.description || "",
  }

  return (
    <div className="widget-content">
      <div className="mb-4 d-flex flex-column flex-md-row column-gap-3">
        <div className="">
          <div className="">
            <div className="uploadButton">
              <input
                className="uploadButton-input"
                type="file"
                name="attachments[]"
                accept="image/*"
                id="upload"
                required
                onChange={logoImgHandler}
              />
              <label
                className="uploadButton-button ripple-effect text-break"
                htmlFor="upload"
              >
                {logoImg !== null ? logoImg.name : "Change Logo"}
              </label>
              <span className="uploadButton-file-name"></span>
            </div>
            <div className="text">
              {logoImg && (
                <button
                  type="button"
                  className="theme-btn btn-style-one btn-small"
                  onClick={() => {
                    setLogoImg(null);
                  }}
                >
                  cancel
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="">
          {companyUserProfile?.profileImage && logoImgPreview === null ? (
            <div>
              <Image
                className="rounded"
                src={companyUserProfile?.profileImage}
                width={100}
                height={100}
                alt="Profile"
                loading="lazy"
              />
            </div>
          ) : logoImgPreview !== null ? (
            <div>
              <Image
                className="rounded"
                src={logoImgPreview}
                width={100}
                height={100}
                alt="Profile"
                loading="lazy"
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <Formik
        innerRef={formRef}
        initialValues={profileInitFields}
        validationSchema={validate}
        onSubmit={profileSubmitHandler}
        enableReinitialize
      >
        {(formik) => (
          <Form className="default-form">
            <div className="row">
              {/* <!-- Input --> */}
              <div className="form-group col-lg-4 col-md-12">
                <TextField
                  label="Company Name"
                  name="companyName"
                  type="text"
                  autoComplete="off"
                />
              </div>

              {/* <!-- Input --> */}
              <div className="form-group col-lg-4 col-md-12">
                <SelectField
                  label="Industry"
                  name="industry"
                  options={COMPANY_INDUSTRY_OPTIONS}
                />
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <TextFieldGroup label="Telegram Username" name="telegramUsername" type="text" groupIcon={"@"}/>
              </div>

              {/* <!-- Input --> */}
              <div className="form-group col-lg-6 col-md-12">
                <SelectField
                  label="Location"
                  name="location"
                  options={COMPANY_LOCATION_OPTIONS}
                />
              </div>

              {/* <!-- Input --> */}
              <div className="form-group col-lg-6 col-md-12">
                <SelectField
                  label="Size"
                  name="size"
                  options={COMPANY_SIZE_OPTIONS}
                />
              </div>

              {/* <!-- Input --> */}
              <div className="form-group col-lg-6 col-md-12">
                <TextField
                  label="Contact Email"
                  name="email"
                  type="email"
                  autoComplete="off"
                />
              </div>

              {/* <!-- Input --> */}
              <div className="form-group col-lg-6 col-md-12">
                <SelectField
                  label={"Technologies"}
                  name="technologies"
                  options={technologyOptions}
                  isMulti
                  inputType="creatable"
                />
              </div>

              <div className="form-group col-lg-12 col-md-12">
                <TextAreaField label="Description" name="description"/>
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <button
                  type="submit"
                  className="theme-btn btn-style-one btn-small"
                >
                  {savingInfo ? (
                  <>
                    Saving...{" "}
                    <span
                      className="spinner-border spinner-border-sm pl-4"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </>
                ) : (
                  "Save"
                )}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MainProfile;
