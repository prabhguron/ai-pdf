"use client";
import SelectField from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatToArray, jobDescriptionTemplate, skills } from "@/utils/helper";
import * as Yup from "yup";
import { omit } from "lodash";
import JobsApi from "@/neb-api/JobsApi";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DatePickerCommon from "@/components/form/DatePickerCommon";
import TextRichEditor from "@/components/form/TextRichEditor";
import {
  experienceLevelOptions,
  contractTypeOptions,
} from "@/utils/formConstants";
import useConfirm from "@/context/ConfirmDialog";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppSelector } from "@/redux/store";
import useMarketplaceContract from "@/hooks/useMarketplaceContract";

const wordCountValidator = (
  value: string,
  min: number,
  max: number,
  check: "max" | "min" | "all",
): boolean => {
  const wordCount = value?.trim().split(/\s+/).length;
  if (check === "min") {
    return !!wordCount && wordCount >= min;
  } else if (check === "max") {
    return !!wordCount && wordCount <= max;
  }
  return !!wordCount && wordCount >= min && wordCount <= max;
};

const validate = Yup.object().shape({
  jobTitle: Yup.string()
    .max(30, "Must be 30 characters or less")
    .required("Required"),
  location: Yup.string()
    .max(30, "Must be 30 characters or less")
    .required("Required"),
  skillsRequired: Yup.array()
    .min(1, "Please select at least one skill")
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      }),
    ),
  experienceLevel: Yup.string()
    .max(30, "Must be 30 characters or less")
    .required("Required"),
  // portfolioOrWorkSamples: Yup.array()
  //   .min(1, "Please add at least one work sample")
  //   .of(
  //     Yup.object().shape({
  //       label: Yup.string().required(),
  //       value: Yup.string().matches(
  //         /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
  //           'Enter correct url!'
  //       ).required(),
  //     })
  //   ),
  // references: Yup.array()
  //   .min(1, "Please add at least one reference")
  //   .of(
  //     Yup.object().shape({
  //       label: Yup.string().required(),
  //       value: Yup.string().email('Invalid Email').required(),
  //     })
  //   ),
  jobDescription: Yup.string()
    .test(
      "wordCount",
      "Maximum word count exceeded, should be less than 500 words",
      (value: any) => {
        return wordCountValidator(value, 200, 500, "max");
      },
    )
    .test(
      "wordCount",
      "Minimum word count should be at-least 200 words",
      (value: any) => {
        return wordCountValidator(value, 200, 500, "min");
      },
    )
    .required("Required"),
  availability: Yup.string()
    .max(30, "Must be 30 characters or less")
    .required("Required"),
  currencyType: Yup.string().max(30, "Must be 30 characters or less"),
  compensation: Yup.number()
    .typeError("Must be a number")
    .min(1, "Minimum one value allowed")
    .required("Required"),
  contractType: Yup.string()
    .max(30, "Must be 30 characters or less")
    .required("Required"),
  applicationDeadline: Yup.string()
    .max(30, "Must be 30 characters or less")
    .required("Required"),
  contactInformation: Yup.string()
    .max(30, "Must be 30 characters or less")
    .required("Required"),
});

const initValues: PostJob = {
  jobTitle: "",
  location: "",
  skillsRequired: [],
  experienceLevel: "junior",
  jobDescription: "",
  jobDescriptionFormatted: "",
  availability: "",
  compensation: "",
  currencyType: "nebtt",
  contractType: "permanent",
  applicationDeadline: "",
  contactInformation: "",
  jobDesc: "",
};

const PostBoxForm = ({ formInitValues = initValues }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const confirm = useConfirm();
  const jobFormRef = useRef<any>();
  const { postNewJob, updateJob } = JobsApi();
  const userKycCompleted =
    useAppSelector(
      (state) => state.getStartedSteps?.profileStat?.userKycCompleted,
    ) ?? false;
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

  const createJobPostMutation = useMutation({
    mutationFn: postNewJob,
    onSuccess: (response) => {
      const { status } = response;
      if (status === 201) {
        jobFormRef?.current?.resetForm();
        jobFormRef?.current?.setFieldValue(
          "jobDescriptionFormatted",
          jobDescriptionTemplate,
        );
        toast.success("Job Posted Successfully");
        router.push("/company/my-jobs");
        return;
      } else {
        toast.error("Job Post Failed");
      }
    },
    onError: (error) => {
      toast.error("Something went wrong");
    },
  });

  const updateJobPostMutation = useMutation({
    mutationFn: updateJob,
    onSuccess: (response) => {
      const { status } = response;
      if (status === 200) {
        queryClient.invalidateQueries(["myAllJobs"]);
        toast.success("Updated Job Post Successfully");
        return;
      } else {
        toast.error("Update Job Post Failed");
      }
    },
    onError: (error) => {
      toast.error("Something went wrong");
    },
  });

  const submitHandler = async (jobValues: PostJob) => {
    if (!userKycCompleted) {
      toast.warning("KYC Pending...");
      return;
    }
    const choice = await confirm({
      title: "Post New Job ?",
      description: `Are you sure you want to post the job?`,
      btnLabel: "Yes",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice) return;
    try {
      let postData = omit(jobValues, ["startDate", "endDate", "date"]);
      if (postData) {
        //postData.portfolioOrWorkSamples = formatToArray(postData.portfolioOrWorkSamples);
        //postData.references = formatToArray(postData.references);
        postData.skillsRequired = formatToArray(postData.skillsRequired);
        createJobPostMutation.mutate(postData);
      }
    } catch (error) {}
  };

  const editActionHandler = async (updatedValues: PostJob) => {
    if (!userKycCompleted) {
      toast.warning("KYC Pending...");
      return;
    }
    const choice = await confirm({
      title: "Edit Job Post?",
      description: `Are you sure you want to update your job post?`,
      btnLabel: "Yes",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice) return;
    if (updatedValues) {
      const { _id: jobId } = updatedValues;
      const data = omit(updatedValues, [
        "_id",
        "created_at",
        "updated_at",
        "userId",
      ]);
      //data.portfolioOrWorkSamples = formatToArray(data.portfolioOrWorkSamples);
      //data.references = formatToArray(data.references);
      data.skillsRequired = formatToArray(data.skillsRequired);
      updateJobPostMutation.mutate({ jobId, data });
    }
  };

  const currencyOpts = ercTokens.map((c) => {
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

  return (
    <>
      <Formik
        innerRef={jobFormRef}
        initialValues={formInitValues}
        validationSchema={validate}
        onSubmit={formInitValues?._id ? editActionHandler : submitHandler}
        enableReinitialize
      >
        {(formik) => (
          <Form className="default-form">
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <TextField
                  label="Job Title"
                  name="jobTitle"
                  type="text"
                  autoComplete="off"
                />
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <TextField
                  label="Location"
                  name="location"
                  type="text"
                  autoComplete="off"
                />
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <SelectField
                  label={"Choose Skill"}
                  name="skillsRequired"
                  options={skills}
                  inputType="creatable"
                  placeholder="Select Skill"
                  isMulti
                />
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <SelectField
                  label={"Choose Experience Level"}
                  name="experienceLevel"
                  options={experienceLevelOptions}
                  placeholder="Select Experience Level"
                  inputType="creatable"
                />
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <TextField
                  min={0}
                  label="Compensation"
                  name="compensation"
                  type="number"
                  className="mt-2"
                  autoComplete="off"
                />
              </div>
              <div className="form-group col-lg-4 col-md-12">
                <SelectField
                  label={"Currency Type"}
                  name="currencyType"
                  options={currencyOpts}
                  placeholder="Select Range"
                />
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <SelectField
                  label={"Contract Type"}
                  name="contractType"
                  options={contractTypeOptions}
                  inputType="creatable"
                  placeholder="Select Contract Type"
                />
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <label>Availability</label>
                <div className="customDatePickerWidth">
                  <DatePickerCommon
                    name="availability"
                    placeholderText="Select Date"
                  />
                </div>
              </div>
              <div className="form-group col-lg-4 col-md-12">
                <label>Application Deadline</label>
                <div className="customDatePickerWidth">
                  <DatePickerCommon
                    name="applicationDeadline"
                    placeholderText="Select Date"
                  />
                </div>
              </div>

              <div className="form-group col-lg-4 col-md-12">
                <TextField
                  label="Point Of Contact"
                  name="contactInformation"
                  type="text"
                  autoComplete="off"
                  className="mt-2"
                  placeholder="Email / Phone"
                />
              </div>

              {/* <div className="form-group col-lg-12 col-md-12">
                <TextAreaField label="Job Description" name="jobDescription" />
              </div> */}

              <div className="form-group col-lg-12 col-md-12">
                <TextRichEditor
                  name="jobDescription"
                  setFormattedField={(val) =>
                    formik.setFieldValue("jobDescriptionFormatted", val)
                  }
                  setFieldValue={(val) =>
                    formik.setFieldValue("jobDescription", val)
                  }
                  value={
                    formik.values.jobDescriptionFormatted ||
                    jobDescriptionTemplate
                  }
                />
              </div>

              {userKycCompleted && (
                <div className="form-group col-lg-6 col-md-12 mt-2">
                  <button
                    type="submit"
                    className="theme-btn btn-style-one btn-small"
                  >
                    {createJobPostMutation?.isLoading ||
                    updateJobPostMutation?.isLoading ? (
                      <>
                        Please Wait...{" "}
                        <span
                          className="spinner-border spinner-border-sm pl-4"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </>
                    ) : formik.values?._id ? (
                      "SAVE CHANGES"
                    ) : (
                      "POST JOB"
                    )}
                  </button>
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PostBoxForm;
