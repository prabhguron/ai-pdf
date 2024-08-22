import { useApi } from "@/hooks/useApi";

const JobsApi = () => {
  const axiosApi = useApi();

  const jobsApiBase = "/api/v1/jobs";

  interface AllJobsParams {
    forUser?: boolean;
    forMarket?: boolean;
    userId?: string;
    jobId?: string;
    limit?: number;
    skip: number;
    fields?: boolean;
    noListingCondition?: boolean;
    companyMeta?: boolean;
    companyProfileMeta?: boolean;
  }

  const getAllJobs = async (params: AllJobsParams) => {
    let result = {
      jobs: [],
      totalCount: 0,
      nextPage: null,
    };
    try {
      const limit = 10;
      const { status, data } = await axiosApi(
        `${jobsApiBase}/`,
        "GET",
        {},
        {
          limit,
          ...params,
        }
      );
      if (status === 200 && data) {
        const { data: jobs, count: totalCount, nextPage } = data;
        return {
          jobs,
          totalCount,
          nextPage,
        };
      }
      return result;
    } catch (error) {
      return result;
    }
  };


  const postNewJob = async (payload: any) => {
    try {
      const response = await axiosApi(`${jobsApiBase}/`, "POST", payload);
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateJob = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${jobsApiBase}/${payload?.jobId}`,
        "PATCH",
        payload?.data
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      const response = await axiosApi(`${jobsApiBase}/${jobId}`, "DELETE");
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const getJob = async (jobId: string, queryParams = {}) => {
    try {
      const { status, data } = await axiosApi(
        `${jobsApiBase}/${jobId}`,
        "GET",
        {},
        queryParams
      );
      if (status === 200 && data) {
        return data?.job || null;
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  const getShortListedJobs = async () => {
    try {
      const { status, data } = await axiosApi(
        `${jobsApiBase}/shortlist`,
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

  const getAllJobApplicants = async (jobId: string | null, params: any) => {
    let result = {
      jobs: [],
      totalCount: 0,
      nextPage: null,
    };
    if(!jobId) return result;
    try {
      const limit = 10;
      const { status, data } = await axiosApi(
        `${jobsApiBase}/applicants/${jobId}`,
        "GET",
        {},
        {
          limit,
          ...params,
        }
      );
      if (status === 200 && data) {
        const { data: jobs, count: totalCount, nextPage } = data;
        return {
          jobs,
          totalCount,
          nextPage,
        };
      }
    } catch (error) {}
    return result;
  };

  const sendJobOffer = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${jobsApiBase}/send-offer`,
        "POST",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const getAllApprovedOffers = async () => {
    try {
      const { status, data } = await axiosApi(
        `${jobsApiBase}/approved-offers`,
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

  const getJobStats = async (
    jobId: string
  ): Promise<{
    applicantCount: number;
    smartContractInitiatedCount: number;
  } | null> => {
    try {
      const { status, data } = await axiosApi(
        `${jobsApiBase}/job-stats/${jobId}`,
        "GET"
      );
      if (status === 200 && data) {
        return {
          applicantCount: data?.applicantCount ?? 0,
          smartContractInitiatedCount: data?.smartContractInitiatedCount ?? 0,
        };
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  return {
    postNewJob,
    getAllJobs,
    getAllJobApplicants,
    getJob,
    getShortListedJobs,
    getAllApprovedOffers,
    updateJob,
    deleteJob,
    sendJobOffer,
    getJobStats
  };
};

export default JobsApi;
