import { useApi } from "@/hooks/useApi";
import { Address, Hash } from "viem";

const OffersApi = () => {
  const axiosApi = useApi();

  const offersApiBase = "/api/v1/offers";

  const getApplicationOffer = async (applicationId: string, queryParams={}) => {
    try {
      const {status, data} = await axiosApi(
        `${offersApiBase}/${applicationId}`,
        "GET",{},
        queryParams
      );
      if(status === 200 && data){
        return data?.offer || null
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  const createJobOffer = async (applicationId: string, payload: any) => {
    try {
      const response = await axiosApi(
        `${offersApiBase}/${applicationId}`,
        "POST",
        payload,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const prepareOfferContract = async (offerId: string, payload: any) => {
    try {
      const response = await axiosApi(
        `${offersApiBase}/prepare/${offerId}`,
        "POST",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const prepareChangeOrder = async (offerId: string | null, payload: any) => {
    if(!offerId) return null;
    try {
      const response = await axiosApi(
        `${offersApiBase}/prepare-change-order/${offerId}`,
        "POST",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const prepareEvidence = async (offerId:string|null, payload: any) => {
    if(!offerId) return null;
    try {
      const response = await axiosApi(
        `${offersApiBase}/prepare-evidence/${offerId}`,
        "POST",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

 type UpdateTxInfoPayload = {
    transactionHash: Hash;
    escrowProjectId: string;
    buyer?: Address;
    provider?:Address;
  }

  const updateOfferTxInfo = async (offerId: string, payload: UpdateTxInfoPayload) => {
    try {
      const response = await axiosApi(
        `${offersApiBase}/tx-info/${offerId}`,
        "PATCH",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateJobOffer = async (offerId: string, payload: any) => {
    try {
      const response = await axiosApi(
        `${offersApiBase}/update/${offerId}`,
        "PATCH",
        payload,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const getAllJobOffers = async (jobId: string | null, params: any) => {
    let result = {
        jobs: [],
        totalCount: 0,
        nextPage: null,
    };
    if(!jobId) return result;
    try {
      const limit = 10
      const {status, data} = await axiosApi(`${offersApiBase}/get-all/${jobId}`, "GET", {}, {
        limit,
        ...params
      });
      if(status === 200 && data){
        const { data:jobs, count:totalCount, nextPage} = data;
        return {
          jobs,
          totalCount,
          nextPage
        }
      }
    } catch (error) {
    }
    return result;
  };

  const acceptJobOfferTalent = async (offerId: string | null, status:OfferStatus) => {
    try {
      if(!offerId) return;
      const response = await axiosApi(
        `${offersApiBase}/talent/accept-reject`,
        "PATCH",
        {offerId, status}
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  interface getOfferMetaParams{
    jobId ?: string,
    matchApplicationId ?: boolean
  }
  const getOfferMetadata = async (offerId: string, queryParams:getOfferMetaParams={}) => {
    if(!offerId.length) return null;
    try {
      const {status, data} = await axiosApi(
        `${offersApiBase}/metadata/${offerId}`,
        "GET",{},
        queryParams
      );
      if(status === 200 && data){
        return {
          meta: data?.metadata || null,
          txData: data?.txData || null,
          offerDetails: data?.offerDetails || null,
          companyJobInfo: data?.companyJobInfo || null,
        }
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  return {
    getApplicationOffer,
    createJobOffer,
    prepareOfferContract,
    prepareChangeOrder,
    prepareEvidence,
    updateJobOffer,
    getAllJobOffers,
    acceptJobOfferTalent,
    getOfferMetadata,
    updateOfferTxInfo,
  };
};

export default OffersApi;
