"use client";
import React, { useEffect, useState } from "react";
import CompanyProfileApi from "@/neb-api/CompanyProfileApi";
import { GoProject } from "react-icons/go";
import { toast } from "react-toastify";
import CompanyProjectForm from "./CompanyProjectForm";
import useConfirm from "@/context/ConfirmDialog";
import { getFormData } from "@/utils/helper";
import { fetchUserProfile } from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

const projectImageKey = "projectsImages";

const CompanyProjects = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { userProfile } = useAppSelector((state) => state.auth);
  const companyUserProfile = userProfile as CompanyUserProfile;

  const { createCompanyProjects, updateCompanyProjects, deleteCompanyProject } =
    CompanyProfileApi();
  const [editingProject, setEditingProject] = useState<CompanyProject | null>(
    null,
  );
  const [projects, setProjects] = useState<CompanyProject[]>([]);
  const [savingProject, setSavingProject] = useState(false);

  useEffect(() => {
    if (companyUserProfile?.projects) {
      const allProjects = companyUserProfile?.projects;
      setProjects(allProjects);
    }
  }, [userProfile]);

  const newProjectHandler = async (
    projectValues: CompanyProject,
    { resetForm }: any,
  ): Promise<any> => {
    setSavingProject(true);
    try {
      const formData = getFormData(projectValues, projectImageKey);
      const { status, data } = await createCompanyProjects(formData);
      if (status === 200) {
        const { id, images } = data?.project;
        projectValues["_id"] = id;
        projectValues[projectImageKey] = images;
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
      const { status } = await deleteCompanyProject(projectId);
      if (status === 204) {
        toast.success("Deleted project");
        const remainingPrj = projects.filter((c) => c._id !== projectId);
        setProjects(remainingPrj);
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    toast.error("Something went wrong");
  };

  const editProjectHandler = async (
    projectInfo: CompanyProject,
    { resetForm }: any,
  ) => {
    setSavingProject(true);
    try {
      const { _id: projectId, ...projectUpdatedInfo } = projectInfo;
      if (typeof projectId === "undefined") return;
      const formData = getFormData(projectUpdatedInfo, projectImageKey);
      const { status, data } = await updateCompanyProjects(projectId, formData);
      if (status === 200) {
        const { project } = data;
        const projectIdx = projects.findIndex((p) => p._id === projectId);
        if (projectIdx !== -1) {
          let allProjects = [...projects];
          allProjects[projectIdx] = project;
          setProjects(allProjects);
        }
        resetForm();
        setSavingProject(false);
        dispatch(fetchUserProfile());
        toast.success("Updated project");
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setSavingProject(false);
    toast.error("Something went wrong");
  };

  const enableEditProject = (projectInfo: CompanyProject) => {
    setEditingProject(projectInfo);
  };

  return (
    <>
      <div className="mb-2">
        {!!editingProject?.name?.length && (
          <span className="mb-3 h5">
            <em>
              You are now editing <strong>{editingProject?.name}</strong>
            </em>
          </span>
        )}
      </div>
      <CompanyProjectForm
        info={projects}
        newInfoHandler={newProjectHandler}
        defaultListIcon={<GoProject className="defaultIcon" />}
        submitLoader={savingProject}
        deleteInfoHandler={deleteProjectHandler}
        editInfoHandler={editProjectHandler}
        editModeCallBack={enableEditProject}
      />
    </>
  );
};

export default CompanyProjects;
