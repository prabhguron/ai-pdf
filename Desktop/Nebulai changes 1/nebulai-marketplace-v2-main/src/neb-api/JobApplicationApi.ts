import { useApi } from "@/hooks/useApi";
import { isAxiosError } from "axios";

const JobApplicationApi = () => {
  const axiosApi = useApi();

  const applicationsApiBase = "/api/v1/applications";

  const applyJob = async (jobId: string) => {
    try {
      const response = await axiosApi(
        `${applicationsApiBase}/job/${jobId}`,
        "POST"
      );
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response;
      }
      return error;
    }
  };

  /* 
    This API Call is used to get applications for both company and talent
  */
  const getTalentAllAppliedJobs = async (
    params: TalentAllAppliedJobsParams
  ): Promise<TalentAllAppliedReturn> => {
    let result: TalentAllAppliedReturn = {
      allApplications: [],
      totalCount: 0,
      nextPage: null,
    };
    try {
      const limit = 10;
      const { status, data } = await axiosApi(
        `${applicationsApiBase}/`,
        "GET",
        {},
        {
          limit,
          ...params,
        }
      );
      if (status === 200 && data) {
        const { data: allApplications, count: totalCount, nextPage } = data;
        return {
          allApplications: allApplications,
          totalCount: totalCount || 0,
          nextPage: nextPage,
        };
      }
      return result;
    } catch (error: any) {
      throw error.response ?? error;
    }
  };

  const updateApplicationStatus = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      const response = await axiosApi(
        `${applicationsApiBase}/${applicationId}`,
        "PATCH",
        { status: newStatus }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const getJobNamesTalentOffer = async () => {
    try {
      const { status, data } = await axiosApi(
        `${applicationsApiBase}/talent/offers`,
        "GET"
      );
      if (status === 200 && data) {
        return data?.jobs || null;
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  return {
    applyJob,
    getTalentAllAppliedJobs,
    getJobNamesTalentOffer,
    updateApplicationStatus,
  };
};

export default JobApplicationApi;
