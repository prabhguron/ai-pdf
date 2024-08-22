"use client";
import React, { useEffect, useState } from "react";
import CompanyProfileApi from "@/neb-api/CompanyProfileApi";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import TeamMemberForm from "./TeamMemberForm";
import useConfirm from "@/context/ConfirmDialog";
import { fetchUserProfile } from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

const CompanyTeamMembers = () => {
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const { userProfile } = useAppSelector((state) => state.auth);
  const companyUserProfile = userProfile as CompanyUserProfile;

  const {
    createCompanyTeamMember,
    updateCompanyTeamMember,
    deleteCompanyTeamMember,
  } = CompanyProfileApi();
  const [editingTeamMemberInfo, setEditingTeamMemberInfo] =
    useState<TeamMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [savingTeamMember, setSavingTeamMember] = useState(false);

  useEffect(() => {
    if (companyUserProfile?.teamMembers) {
      const allMembers = companyUserProfile?.teamMembers;
      setTeamMembers(allMembers);
    }
  }, [userProfile]);

  const newTeamMemberHandler = async (
    teamMemberInfo: TeamMember,
    { resetForm }: any,
  ) => {
    setSavingTeamMember(true);
    try {
      const { status, data } = await createCompanyTeamMember(teamMemberInfo);
      if (status === 200) {
        const { id } = data?.teamMember;
        teamMemberInfo["_id"] = id;
        setTeamMembers((prevTeamMembers) => [
          ...prevTeamMembers,
          teamMemberInfo,
        ]);
        dispatch(fetchUserProfile());
        resetForm();
        setSavingTeamMember(false);
        return;
      }
    } catch (error) {}
    setSavingTeamMember(false);
    toast.error("Something went wrong");
  };

  const deleteTeamMemberHandler = async (memberId: string) => {
    const choice = await confirm({
      title: "Delete Team Member",
      description: "Are you sure you want to delete?",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice || !memberId) return;
    try {
      const { status } = await deleteCompanyTeamMember(memberId);
      if (status === 204) {
        toast.success("Deleted team member");
        const remainingMembers = teamMembers.filter((m) => m._id !== memberId);
        setTeamMembers(remainingMembers);
        dispatch(fetchUserProfile());
        return;
      }
    } catch (error) {}
    toast.error("Something went wrong");
  };

  const editTeamMemberHandler = async (
    memberInfo: TeamMember,
    { resetForm }: any,
  ) => {
    setSavingTeamMember(true);
    try {
      const { _id: teamMemberId, ...teamMemberUpdatedInfo } = memberInfo;
      if (typeof teamMemberId === "undefined") return;
      const { status, data } = await updateCompanyTeamMember(
        teamMemberId,
        teamMemberUpdatedInfo,
      );
      if (status === 200) {
        const { teamMember } = data;
        const teamMemberIdx = teamMembers.findIndex(
          (p) => p._id === teamMemberId,
        );
        if (teamMemberIdx !== -1) {
          let allMembersStudies = [...teamMembers];
          allMembersStudies[teamMemberIdx] = teamMember;
          setTeamMembers(allMembersStudies);
          dispatch(fetchUserProfile());
        }
        resetForm();
        setSavingTeamMember(false);
        toast.success("Updated Team Member Information");
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setSavingTeamMember(false);
    toast.error("Something went wrong");
  };

  const enableEditMemberInfo = (caseDetails: TeamMember) => {
    setEditingTeamMemberInfo(caseDetails);
  };

  return (
    <>
      <div className="mb-2">
        {!!editingTeamMemberInfo?.name?.length && (
          <span className="mb-3 h5">
            <em>
              You are now editing <strong>{editingTeamMemberInfo?.name}</strong>
            </em>
          </span>
        )}
      </div>
      <TeamMemberForm
        info={teamMembers}
        newInfoHandler={newTeamMemberHandler}
        defaultListIcon={<FaUserAlt className="defaultIcon" />}
        submitLoader={savingTeamMember}
        deleteInfoHandler={deleteTeamMemberHandler}
        editInfoHandler={editTeamMemberHandler}
        editModeCallBack={enableEditMemberInfo}
      />
    </>
  );
};

export default CompanyTeamMembers;

