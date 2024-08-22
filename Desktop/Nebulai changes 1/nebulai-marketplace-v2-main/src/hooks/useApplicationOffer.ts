import {
  ApplicantOffer,
  DummyFile,
  NewOffer,
  ShortlistOffer,
} from "@/components/company/shortlists/shortListTypes";
import JobsApi from "@/neb-api/JobsApi";
import OffersApi from "@/neb-api/OffersApi";
import { setIsOfferSent, updateSelectedOfferInfo } from "@/redux/jobOffer/jobOfferSlice";
import { useAppDispatch } from "@/redux/store";
import { getLastSegment, getTelegramURI, shortAddress } from "@/utils/helper";
import moment from "moment";

const useApplicationOffer = () => {
  const dispatch = useAppDispatch();
  const { getApplicationOffer } = OffersApi();
  const { sendJobOffer } = JobsApi();

  const getOffer = async (
    applicantInfo: JobShortlistedApplicant | TalentApplication,
    rawOffer=false
  ): Promise<ApplicantOffer | null | ShortlistOffer> => {
    try {
      const { jobId, applicationId } = applicantInfo;
      if (jobId) {
        const offerData: ShortlistOffer = await getApplicationOffer(
          applicationId,
          { jobId }
        );
        if (!offerData) return null;

        if(rawOffer){
            return offerData;
        }

        const linkedWalletOptions = offerData?.applicationInfo?.linkedWallets.map((l) => ({
            value: l.address,
            label: `${shortAddress(l.address)} (${l.name})`,
        }));

        const telegramUsername = offerData?.applicationInfo?.telegramUsername;
        const telegramUri = getTelegramURI(telegramUsername);

        let jobResources = offerData?.jobResources || [];
        let resources: DummyFile[] = [];
        if (jobResources.length) {
          resources = formatOfferResources(jobResources)
        }

        return {
          offerId: offerData?.offerId ?? null,
          applicationId: applicationId,
          companyName: offerData?.companyProfileId?.companyName ?? "",
          companyProfileImg: offerData?.companyImage ?? "",
          jobId: offerData?.jobId,
          mainJobTitle: offerData?.mainJobTitle,
          jobTitle: offerData?.jobTitle,
          jobIdentifier: offerData?.jobIdentifier,
          jobRequirementTxt: "",
          jobRequirements: offerData?.jobRequirements || [],
          jobResources: resources,
          compensation: offerData?.compensation,
          projectReviewPeriod: offerData?.projectReviewPeriod,
          currencyType: offerData?.currencyType,
          dueDate: offerData?.applicationDeadline,
          talentWalletAddress: offerData?.providerWalletAddress ?? "",
          providerStake: offerData?.providerStake ?? 0,
          existingOffer: offerData?.existingOffer ?? false,
          isOfferSent: offerData?.isOfferSent ?? false,
          offerStatus: offerData?.offerStatus ?? "",
          escrowProjectId: offerData?.escrowProjectId,
          telegramUsername,
          telegramUri,
          linkedWalletOptions,
        };
      }
    } catch (error) {}
    return null;
  };

  const formatOfferResources = (resources: string[]): DummyFile[] => {
    return resources.map((filePath) => {
        const fileName = getLastSegment(filePath);
        const dummyFile: DummyFile = {
            name: fileName,
            size: 0,
            type: "text/csv",
            dummy: true,
        };
        return dummyFile;
    });
  };

  const sendJobOfferAction = async (applicationId: string):Promise<boolean> => {
    try {
      const { status, data } = await sendJobOffer({
        applicationId,
      });
      if (status === 200 && data?.result) {
        await dispatch(
          setIsOfferSent(true)
        );
        return true
      }
    } catch (error) {}
    return false;
  };


  const updateJobOfferState = async (offerId: string, newOffer: NewOffer, sendOfferToTalent: boolean): Promise<void> => {
    let jResources = newOffer?.jobResources || [];
    let resources: DummyFile[] = [];
    if (jResources.length) {
      resources = formatOfferResources(jResources) ;
    }
    await dispatch(
      updateSelectedOfferInfo({
        offerId,
        isOfferSent: sendOfferToTalent,
        existingOffer: true,
        jobRequirementTxt: "",
        jobRequirements: newOffer?.jobRequirements || [],
        jobResources: resources,
        compensation: newOffer?.compensation,
        currencyType: newOffer?.currencyType,
        dueDate: newOffer?.dueDate
          ? moment(newOffer?.dueDate)?.format("MM/DD/YYYY")
          : "",
        talentWalletAddress: newOffer?.providerWalletAddress ?? "",
        providerStake: newOffer?.providerStake ?? 0,
      })
    );
  };


  return {
    getOffer,
    sendJobOfferAction,
    formatOfferResources,
    updateJobOfferState
  };
};

export default useApplicationOffer;
