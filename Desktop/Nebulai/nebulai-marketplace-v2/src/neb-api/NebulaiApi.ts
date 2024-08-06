import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";
import { resetAuthSlice } from "@/redux/auth/authSlice";
import { resetContractInfoSlice } from "@/redux/contractInfo/contractInfoSlice";
import { resetJobOfferSlice } from "@/redux/jobOffer/jobOfferSlice";
import { resetContractStepSlice } from "@/redux/contractSteps/contractStepsSlice";
import { resetJobFlowStepSlice } from "@/redux/jobFlowSteps/jobFlowStepsSlice";
import { resetTalentJobFlowStepSlice } from "@/redux/talentJobFlowSteps/talentJobFlowStepsSlice";
import { resetCommonConstantSlice } from "@/redux/commonConstants/commonConstantsSlice";
import { resetGStepSlice } from "@/redux/getStartedSteps/getStartedStepsSlice";
import { WalletInfo } from "@/hooks/useWalletUtil";

const NebulaiApi = () => {
  const axiosApi = useApi();
  const dispatch = useDispatch();

  const talentApiBase = "/api/v1/talent";
  const userApiBase = "/api/v1/users";
  const aiApiBase = "/api/v1/ai";

  const registerUser = async (payload: any) => {
    try {
      const response = await axiosApi(`${userApiBase}/signup`, "POST", payload);
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const verifyAccountEmail = async (params: any) => {
    try {
      const response = await axiosApi(
        `${userApiBase}/verify-email`,
        "GET",
        {},
        params
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const resendEmailVerification = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${userApiBase}/resend-verify-email`,
        "POST",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const generateSignatureMsg = async (payload: any) => {
    try {
      const response = await axiosApi("/api/v1/evm/sig-msg", "POST", payload);
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const linkWallet = async (payload: any) => {
    try {
      const response = await axiosApi(
        "/api/v1/evm/link-wallet",
        "POST",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const unLinkWallet = async (payload: any) => {
    try {
      const response = await axiosApi(
        "/api/v1/evm/unlink-wallet",
        "POST",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const checkWalletLink = async (address: any) => {
    try {
      const response = await axiosApi(
        `${userApiBase}/check-wallet/${address}`,
        "GET"
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const getUserWallets = async () => {
    try {
      const response = await axiosApi(`${userApiBase}/wallet-addresses`, "GET");
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateUserPersonalInfo = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${userApiBase}/personal-info`,
        "PATCH",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateUserPassword = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${userApiBase}/password`,
        "PUT",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const forgotPassword = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${userApiBase}/forgot-password`,
        "POST",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const resetPassword = async (payload: any, token: string) => {
    try {
      const response = await axiosApi(
        `${userApiBase}/reset-password/${token}`,
        "PATCH",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const logoutUser = async () => {
    try {
      const response = await axiosApi(`${userApiBase}/logout`, "POST", {});
      localStorage.removeItem("NEB_ACC");
      dispatch(resetAuthSlice());
      dispatch(resetContractInfoSlice());
      dispatch(resetJobOfferSlice());
      dispatch(resetContractStepSlice());
      dispatch(resetJobFlowStepSlice());
      dispatch(resetTalentJobFlowStepSlice());
      dispatch(resetCommonConstantSlice());
      dispatch(resetGStepSlice());
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateProfileInfo = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/profile`,
        "PATCH",
        payload,
        //{},
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const createTalentSkills = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/skills`,
        "POST",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateTalentSkills = async (skillId: string, payload: any) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/skills/${skillId}`,
        "PATCH",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const createTalentProjects = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/projects`,
        "POST",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateTalentProjects = async (projectId: string, payload: any) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/projects/${projectId}`,
        "PATCH",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const createTalentCertificates = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/certifications`,
        "POST",
        payload,
        //{},
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateTalentCertificates = async (certId: string, payload: any) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/certifications/${certId}`,
        "PATCH",
        payload,
        //{},
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateTalentWorkExperience = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/work-experiences`,
        "PATCH",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const deleteWorkExperience = async (expId: string) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/work-experiences/${expId}`,
        "DELETE"
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateTalentEducation = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/educations`,
        "PATCH",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const deleteTalentEducation = async (expId: string) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/educations/${expId}`,
        "DELETE"
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateTalentSocials = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/socials`,
        "PATCH",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const deleteTalentProject = async (projectId: string) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/projects/${projectId}`,
        "DELETE"
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const deleteTalentSkill = async (skillId: string) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/skills/${skillId}`,
        "DELETE"
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const deleteTalentCertificate = async (certId: string) => {
    try {
      const response = await axiosApi(
        `${talentApiBase}/certifications/${certId}`,
        "DELETE"
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const getTalent = async (talentId: string) => {
    try {
      const { status, data } = await axiosApi(
        `${talentApiBase}/${talentId}`,
        "GET"
      );
      if (status === 200 && data) {
        return data;
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  interface ValidateUserProfileReturn {
    profileCompleted: boolean;
    wallets: WalletInfo[];
    walletLinked: boolean;
    status?: string;
  }
  const validateUserProfile = async (): Promise<ValidateUserProfileReturn> => {
    try {
      const {
        data: { profileCompleted, wallets, walletLinked },
        status,
      } = await axiosApi(`${userApiBase}/validate-profile`, "GET", {});
      return { profileCompleted, wallets, walletLinked, status };
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const getUserStats = async () => {
    try {
      const {
        data: { userStats },
      } = await axiosApi(`${userApiBase}/stats`, "GET", {});
      return userStats;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  interface UserProfilesParams {
    limit?: number;
    skip: number;
  }

  const getUserProfiles = async (role: Role, params: UserProfilesParams) => {
    let result = {
      profiles: [],
      totalCount: 0,
      nextPage: null,
    };
    try {
      const limit = 10;
      const { status, data } = await axiosApi(
        `${userApiBase}/profiles/${role}`,
        "GET",
        {},
        {
          limit,
          ...params,
        }
      );
      if (status === 200 && data) {
        const { data: profiles, count: totalCount, nextPage } = data;
        return {
          profiles,
          totalCount,
          nextPage,
        };
      }
      return result;
    } catch (error) {
      return result;
    }
  };

  const submitUserKYC = async (payload: any, params = {}) => {
    try {
      const response = await axiosApi(
        `${userApiBase}/kyc`,
        "POST",
        payload,
        params,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const getRecommendedDashboardProfiles = async (userRole: Role) => {
    try {
      const response = await axiosApi(
        `${userApiBase}/recommended/${userRole}`,
        "GET"
      );
      return response?.data?.data ?? [];
    } catch (error: any) {}
    return [];
  };

  const getProfileRating = async (userId: string) => {
    try {
      const response = await axiosApi(
        `${aiApiBase}/getTalentRating?talentId=${userId}`,
        "POST",
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  return {
    registerUser,
    verifyAccountEmail,
    resendEmailVerification,
    generateSignatureMsg,
    linkWallet,
    unLinkWallet,
    checkWalletLink,
    getUserWallets,
    updateUserPersonalInfo,
    updateUserPassword,
    resetPassword,
    forgotPassword,
    logoutUser,
    createTalentProjects,
    updateProfileInfo,
    createTalentSkills,
    updateTalentSkills,
    updateTalentProjects,
    createTalentCertificates,
    updateTalentCertificates,
    updateTalentWorkExperience,
    updateTalentEducation,
    updateTalentSocials,
    deleteTalentProject,
    deleteTalentSkill,
    deleteTalentCertificate,
    deleteWorkExperience,
    deleteTalentEducation,
    getTalent,
    validateUserProfile,
    getUserStats,
    getUserProfiles,
    submitUserKYC,
    getRecommendedDashboardProfiles,
    getProfileRating,
  };
};

export default NebulaiApi;
