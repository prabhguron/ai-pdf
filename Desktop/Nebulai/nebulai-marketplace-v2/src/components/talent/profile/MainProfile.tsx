"use client";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { TextField } from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import * as Yup from "yup";
import TextAreaField from "@/components/form/TextAreaField";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "@/utils/helper";
import {
  overAllWorkExperienceOptions,
  profileTagOptions,
} from "@/utils/formConstants";
import { fetchUserProfile } from "@/redux/auth/authSlice";
import { TextFieldGroup } from "@/components/form/TextFieldGroup";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Image from "next/image";
import { setOnBoardingStarted, validateGetStartedUserProfile } from "@/redux/getStartedSteps/getStartedStepsSlice";

const validate = Yup.object().shape({
  fullName: Yup.string()
    .max(50, "Must be 50 characters or less")
    .required("Required"),
  telegramUsername: Yup.string()
    .matches(/^[a-zA-Z0-9_]{5,32}$/, 'Invalid Telegram username')
    .required('Telegram username is required'),
  location: Yup.string()
    .max(30, "Must be 30 characters or less")
    .required("Required"),
  jobTitle: Yup.string()
    .max(30, "Must be 30 characters or less")
    .required("Required"),
  overAllWorkExperience: Yup.number()
    .typeError("Must be a number")
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? undefined : Number(value)
    )
    .min(0, "Minimum zero value allowed")
    .required("Required"),
  phone: Yup.string()
    .max(30, "Must be 30 characters or less")
    .required("Required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  languages: Yup.array()
    .min(1, "Please select at least one language")
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      })
    )
    .required("Required"),
  profileTags: Yup.array()
    .min(1, "Please select at least one tag")
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      })
    )
    .required("Required"),
  bio: Yup.string()
    .test('wordCount', 'Maximum word count exceeded, should be less than 200 words', (value: any) => {
      const wordCount = value.trim().split(/\s+/).length;
      return wordCount <= 200;
    })
    // .test('wordCount', 'Minimum word count should be at-least 100 words', (value) => {
    //   const wordCount = value.trim().split(/\s+/).length;
    //   return wordCount >= 100;
    // })
    .required("Required"),
});

const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "arabic", label: "Arabic" },
  { value: "russian", label: "Russian" },
];

type languageOption = {
  value : string;
  label: string;
}

type tagOption = {
  value : string;
  label: string;
}

interface TalentMainProfile { 
  fullName: string;
  telegramUsername: string;
  jobTitle: string;
  phone: string;
  email: string;
  languages: languageOption[];
  bio: string;
  overAllWorkExperience: string;
  location: string;
  profileTags: tagOption[];
}

const MainProfile = () => {
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const profileCompleted = useAppSelector(state => state.getStartedSteps.profileStat?.profileCompleted)
  const talentUserProfile = userProfile as TalentUserProfile

  const formRef = useRef(null);
  const [logoImg, setLogoImg] = useState<File | null>(null);
  const [logoImgPreview, setLogoImgPreview] = useState<any>(null);
  const [savingInfo, setSavingInfo] = useState(false);
  const { updateProfileInfo } = NebulaiApi();

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

  const profileSubmitHandler = async (data: TalentMainProfile) => {
    let message = "Something went wrong";
    let type = "error";
    try {
      setSavingInfo(true);
      const formData = new FormData();
      const arrayFields = ["languages", "profileTags"];
      for (let key in data) {
        let value = data[key as keyof TalentMainProfile] as any;
        if (key === "overAllWorkExperience") {
          value = Number(value);
        }
        if (arrayFields.includes(key)) {
          key = `${key}[]`;
          value.forEach((v: any) => {
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
      const res = await updateProfileInfo(formData);
      if (res?.data) {
        const { status } = res.data;
        if (status.toLowerCase() === "success") {
          type = status.toLowerCase();
          message = "Updated Profile";
          dispatch(fetchUserProfile());
          if(!profileCompleted){
            dispatch(setOnBoardingStarted(true));
            if(talentUserProfile.workExperiences.length && talentUserProfile.skills.length){
              dispatch(validateGetStartedUserProfile());
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    setSavingInfo(false);
    toast(message, { type } as any);
  };

  const profileInit: TalentMainProfile = {
    fullName: talentUserProfile?.fullName || "",
    telegramUsername: talentUserProfile?.telegramUsername || "",
    jobTitle: talentUserProfile?.jobTitle || "",
    phone: talentUserProfile?.phone || "",
    email: talentUserProfile?.email || "",
    languages: talentUserProfile?.languages
      ? talentUserProfile?.languages.map((l) => ({
          value: l,
          label: capitalizeFirstLetter(l),
        }))
      : [],
    bio: talentUserProfile?.bio || "",
    overAllWorkExperience:
      talentUserProfile?.overAllWorkExperience?.toString() || "",
    location: talentUserProfile?.location || "",
    profileTags: talentUserProfile?.profileTags
      ? talentUserProfile?.profileTags.map((tag) => ({
          value: tag,
          label: tag,
        }))
      : [],
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
                {logoImg !== null ? logoImg.name : "Change Profile Picture"}
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
          {talentUserProfile?.profileImage && logoImgPreview === null ? (
            <div>
              <Image
                className="rounded"
                src={talentUserProfile?.profileImage}
                width={100}
                height={100}
                loading="lazy"
                alt="Profile"
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
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <Formik
        innerRef={formRef}
        initialValues={profileInit}
        validationSchema={validate}
        onSubmit={profileSubmitHandler}
        enableReinitialize
      >
        {(formik) => (
          <Form className="default-form">
            <div className="row">
              {/* <!-- Input --> */}
              <div className="form-group col-lg-6 col-md-12">
                <TextField
                  label="Full Name"
                  name="fullName"
                  type="text"
                  autoComplete="off"
                />
              </div>

              {/* <!-- Input --> */}
              <div className="form-group col-lg-6 col-md-12">
                <TextField
                  label="Job Title"
                  name="jobTitle"
                  type="text"
                  autoComplete="off"
                />
              </div>

              {/* <!-- Input --> */}
              <div className="form-group col-lg-6 col-md-12">
                <TextField
                  label="Phone"
                  name="phone"
                  type="text"
                  autoComplete="off"
                />
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <TextFieldGroup label="Telegram Username" name="telegramUsername" type="text" groupIcon={"@"}/>
              </div>

              {/* <!-- Input --> */}
              <div className="form-group col-lg-4 col-md-12">
                <TextField
                  label="Location"
                  name="location"
                  type="text"
                  autoComplete="off"
                />
              </div>

              {/* <!-- Input --> */}
              <div className="form-group col-lg-4 col-md-12">
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="off"
                />
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <SelectField
                  label={"Profile Tags"}
                  name="profileTags"
                  options={profileTagOptions}
                  isMulti
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <SelectField
                  label={"Over All Work Experience"}
                  name="overAllWorkExperience"
                  options={overAllWorkExperienceOptions}
                  inputType="creatable"
                  numberOptions={true}
                />
              </div>

              {/* <!-- Input --> */}
              <div className="form-group col-lg-6 col-md-12">
                <SelectField
                  label={"Languages"}
                  name="languages"
                  options={languageOptions}
                  isMulti
                />
              </div>

              <div className="form-group col-lg-12 col-md-12">
                <TextAreaField label="Bio" name="bio" />
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
