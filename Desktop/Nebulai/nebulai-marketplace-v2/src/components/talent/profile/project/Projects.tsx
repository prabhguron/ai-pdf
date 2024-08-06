"use client";
import React, { useEffect, useState } from "react";
import CommonInfoCard from "@/components/common/CommonInfoCard";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { toast } from "react-toastify";
import useConfirm from "@/context/ConfirmDialog";
import { fetchUserProfile } from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
const ProjectsNew = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { userProfile } = useAppSelector((state) => state.auth);
  const talentProfile = userProfile as TalentUserProfile;

  const { createTalentProjects, updateTalentProjects, deleteTalentProject } =
    NebulaiApi();
  const [projects, setProjects] = useState<TalentProject[]>([]);
  const [editingProjectInfo, setEditingProjectInfo] =
    useState<TalentProject | null>(null);
  const [savingProject, setSavingProject] = useState(false);

  useEffect(() => {
    if (talentProfile?.projects) {
      const allProjects = talentProfile?.projects;
      setProjects(allProjects);
    }
  }, [userProfile]);

  const newProjectHandler = async (
    projectValues: TalentProject,
    { resetForm }: any,
  ) => {
    setSavingProject(true);
    try {
      const { status, data } = await createTalentProjects(projectValues);
      if (status === 200) {
        const { id } = data?.project;
        projectValues["_id"] = id;
        setProjects((prevProjects) => [...prevProjects, projectValues]);
        resetForm();
        setSavingProject(false);
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    setSavingProject(false);
    toast.error("Something went wrong");
  };

  const deleteProjectHandler = async (projectId: string) => {
    const choice = await confirm({
      title: "Delete Project",
      description: "Are you sure you want to delete?",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice || !projectId) return;
    try {
      const { status } = await deleteTalentProject(projectId);
      if (status === 204) {
        toast.success("Deleted Project");
        const remainingProjects = projects.filter((p) => p._id !== projectId);
        setProjects(remainingProjects);
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    toast.error("Something went wrong");
  };

  const editProjectHandler = async (
    pInfo: TalentProject,
    { resetForm }: any,
  ) => {
    setSavingProject(true);
    try {
      const { _id: projectId, ...projectUpdatedInfo } = pInfo;
      if (typeof projectId === "undefined") return;
      const { status, data } = await updateTalentProjects(
        projectId,
        projectUpdatedInfo,
      );
      if (status === 200) {
        const { project } = data;
        const projectIdx = projects.findIndex((p) => p._id === projectId);
        if (projectIdx !== -1) {
          let allMembersStudies = [...projects];
          allMembersStudies[projectIdx] = project;
          setProjects(allMembersStudies);
        }
        resetForm();
        setSavingProject(false);
        toast.success("Updated Project Information");
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setSavingProject(false);
    toast.error("Something went wrong");
  };

  const enableEditProjectInfo = (caseDetails: TalentProject) => {
    setEditingProjectInfo(caseDetails);
  };

  return (
    <>
      <div className="mb-2">
        {!!editingProjectInfo?.name?.length && (
          <span className="mb-3 h5">
            <em>
              You are now editing <strong>{editingProjectInfo?.name}</strong>
            </em>
          </span>
        )}
      </div>
      <CommonInfoCard
        info={projects}
        newInfoHandler={newProjectHandler}
        deleteInfoHandler={deleteProjectHandler}
        defaultListIcon={
          <AiOutlineFundProjectionScreen className="defaultIcon" />
        }
        submitLoader={savingProject}
        editInfoHandler={editProjectHandler}
        editModeCallBack={enableEditProjectInfo}
      />
    </>
  );
};

export default ProjectsNew;
