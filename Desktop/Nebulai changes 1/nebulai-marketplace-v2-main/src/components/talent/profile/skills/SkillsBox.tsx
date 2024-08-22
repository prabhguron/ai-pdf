"use client";
import React, { useEffect, useState } from "react";
import {
  FaJava,
  FaPython,
  FaRust,
  FaLaptop,
  FaDatabase,
  FaCloud,
  FaRegChartBar,
  FaCubes,
  FaBrain,
  FaMobile,
  FaPencilRuler,
} from "react-icons/fa";
import { SiJavascript, SiPhp, SiSolidity } from "react-icons/si";
import { AiFillProject } from "react-icons/ai";
import { HiCubeTransparent } from "react-icons/hi";
import { GiSpy } from "react-icons/gi";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { toast } from "react-toastify";
import useConfirm from "@/context/ConfirmDialog";
import { Form, Formik } from "formik";
import SelectField from "@/components/form/SelectField";
import * as Yup from "yup";
import { skills } from "@/utils/helper";
import { fetchUserProfile } from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  setOnBoardingStarted,
  validateGetStartedUserProfile,
} from "@/redux/getStartedSteps/getStartedStepsSlice";

const experience = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10" },
  { value: 11, label: "11" },
  { value: 12, label: "12" },
  { value: 13, label: "13" },
  { value: 14, label: "14" },
  { value: 15, label: "15" },
  { value: 16, label: "16" },
  { value: 17, label: "17" },
  { value: 18, label: "18" },
  { value: 19, label: "19" },
  { value: 20, label: "20+" },
];

type SkillIconMapping = {
  [key: string]: React.ReactElement;
};

const skillIconMapping: SkillIconMapping = {
  java: <FaJava />,
  javascript: <SiJavascript />,
  python: <FaPython />,
  rust: <FaRust />,
  solidity: <SiSolidity />,
  php: <SiPhp />,
  "ui/ux design": <FaPencilRuler />,
  "mobile development": <FaMobile />,
  "database design and management": <FaDatabase />,
  "cloud computing": <FaCloud />,
  "project management": <AiFillProject />,
  "data analysis": <FaRegChartBar />,
  "data visualization": <FaCubes />,
  "artificial intelligence and machine learning": <FaBrain />,
  "blockchain development": <HiCubeTransparent />,
  cybersecurity: <GiSpy />,
};

const validate = Yup.object().shape({
  skill: Yup.string().required("Required"),
  yearsOfExperience: Yup.string().required("Required"),
});

interface TalentSkillCustom extends TalentSkill {
  icon?: React.ReactElement | string;
}

const initialFormValues: TalentSkillCustom = {
  skill: "",
  yearsOfExperience: 2023,
};

const SkillsBox = () => {
  const dispatch = useAppDispatch();
  const [initValues, setInitValues] = useState(initialFormValues);
  const confirm = useConfirm();
  const { userProfile } = useAppSelector((state) => state.auth);
  const profileCompleted = useAppSelector(
    (state) => state.getStartedSteps.profileStat?.profileCompleted,
  );
  const talentProfile = userProfile as TalentUserProfile;
  const { createTalentSkills, updateTalentSkills, deleteTalentSkill } =
    NebulaiApi();
  const [skillsData, setSkillsData] = useState<TalentSkillCustom[]>([]);
  const [savingSkill, setSavingSkill] = useState(false);

  useEffect(() => {
    if (talentProfile?.skills) {
      const allSkills = talentProfile?.skills.map((s) => {
        return {
          ...s,
          icon: skillIconMapping[s.skill.toLowerCase()] || <FaLaptop />,
        };
      });
      setSkillsData(allSkills);
    }
  }, [userProfile]);

  const addSkill = async (
    newSkillInfo: TalentSkillCustom,
    { resetForm }: any,
  ) => {
    newSkillInfo["icon"] = skillIconMapping[
      newSkillInfo?.skill.toLowerCase()
    ] || <FaLaptop />;
    setSavingSkill(true);
    try {
      const { status, data } = await createTalentSkills(newSkillInfo);
      if (status === 200) {
        const { id } = data?.skill;
        newSkillInfo["_id"] = id;
        setSkillsData((prevSkills) => [...prevSkills, newSkillInfo]);
        resetForm();
        setSavingSkill(false);
        dispatch(fetchUserProfile());
        if (!profileCompleted) {
          dispatch(setOnBoardingStarted(true));
          if (
            talentProfile.telegramUsername.length &&
            talentProfile.workExperiences.length
          ) {
            dispatch(validateGetStartedUserProfile());
          }
        }
        return;
      }
    } catch (error) {}
    setSavingSkill(false);
    toast.error("Something went wrong");
  };

  const deleteSkill = async (skillId: string) => {
    const choice = await confirm({
      title: "Delete Skill",
      description: "Are you sure you want to delete?",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice || !skillId) return;
    try {
      const { status } = await deleteTalentSkill(skillId);
      if (status === 204) {
        toast.success("Deleted Skill");
        const otherSkills = skillsData.filter((sk) => sk._id !== skillId);
        setSkillsData(otherSkills);
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    toast.error("Something went wrong");
  };

  const populateForm = (formData: TalentSkillCustom) => {
    const updatedSkillData = {
      ...formData,
      skill: formData?.skill.toLowerCase(),
    };
    setInitValues(updatedSkillData);
  };

  const editSkill = async (
    skillInfo: TalentSkillCustom,
    { resetForm }: any,
  ) => {
    setSavingSkill(true);
    try {
      const { _id: skillId, ...skillUpdatedInfo } = skillInfo;
      if (typeof skillId === "undefined") return;
      const { status, data } = await updateTalentSkills(
        skillId,
        skillUpdatedInfo,
      );
      if (status === 200) {
        const { skill } = data;
        const skillIdx = skillsData.findIndex((sk) => sk._id === skillId);
        if (skillIdx !== -1) {
          let allMembersStudies = [...skillsData];
          allMembersStudies[skillIdx] = skill;
          allMembersStudies[skillIdx]["icon"] = skillIconMapping[
            skill?.skill.toLowerCase()
          ] || <FaLaptop />;
          setSkillsData(allMembersStudies);
        }
        resetForm();
        setSavingSkill(false);
        setInitValues(initialFormValues);
        dispatch(fetchUserProfile());
        toast.success("Updated Skill");
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setSavingSkill(false);
    toast.error("Something went wrong");
  };

  const resetFormEdit = () => {
    setInitValues(initialFormValues);
  };

  return (
    <>
      <Formik
        initialValues={initValues}
        validationSchema={validate}
        onSubmit={initValues?._id ? editSkill : addSkill}
        enableReinitialize
      >
        {(formik) => (
          <Form className="default-form">
            <div className="row">
              <div className="mb-2">
                {formik.values?._id && (
                  <span className="mb-3 h5">
                    <em>
                      You are now editing{" "}
                      <strong>
                        {skills.find((sk) => sk.value === formik.values?.skill)
                          ?.label || formik.values?.skill}
                      </strong>
                    </em>
                  </span>
                )}
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <SelectField
                  label={"Choose skill"}
                  name="skill"
                  options={skills}
                  inputType="creatable"
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <SelectField
                  label={"Years of experience"}
                  name="yearsOfExperience"
                  options={experience}
                />
              </div>
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <button
                type="submit"
                className="theme-btn btn-style-one btn-small"
                disabled={savingSkill}
              >
                {savingSkill ? (
                  <>
                    Saving...{" "}
                    <span
                      className="spinner-border spinner-border-sm pl-4"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </>
                ) : initValues?._id ? (
                  "SAVE CHANGES"
                ) : (
                  "ADD"
                )}
              </button>

              {formik.values?._id && (
                <button
                  type="button"
                  className="btn btn-small ml-5"
                  onClick={resetFormEdit}
                >
                  CANCEL
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>

      <div className="row">
        {skillsData.map(({ skill, icon, yearsOfExperience, _id }, idx) => (
          <div className="job-block col-lg-5 col-md-6 col-sm-12" key={idx}>
            <div className="inner-box">
              <div className="content">
                <span className="company-logo">
                  {icon &&
                    React.cloneElement(icon as React.ReactElement, {
                      className: "skillIcon",
                    })}
                </span>
                <h4>{skill}</h4>

                <ul className="job-other-info cert-or-skill">
                  <li className={`time text-center`}>
                    {" "}
                    {`${yearsOfExperience === 20 ? "20+" : yearsOfExperience} ${
                      yearsOfExperience === 1 ? "Year" : "Years"
                    }`}{" "}
                    of experience{" "}
                  </li>
                </ul>

                <div className="row">
                  <div className="col-6 col-lg-4 offset-4 offset-md-4 offset-lg-5 offset-xl-6">
                    <button
                      type="button"
                      data-text="remove"
                      onClick={() => {
                        if (_id) {
                          deleteSkill(_id);
                        }
                      }}
                      className="cursor-pointer float-end"
                    >
                      <span className="la la-trash"></span>
                    </button>
                  </div>
                  <div className="col-2 col-sm-2 col-lg-2">
                    <button
                      type="button"
                      data-text="edit"
                      className="cursor-pointer text-center"
                      onClick={() => {
                        if (_id) {
                          populateForm({ skill, icon, yearsOfExperience, _id });
                        }
                      }}
                    >
                      <span className="la la-edit"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SkillsBox;
