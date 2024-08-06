"use client";
import { setChangeOrderAvailable, setChangeOrders, setChangeOrdersCount, setContractDetails, setDisputeID } from "@/redux/contractInfo/contractInfoSlice";
import useMarketplaceContract from "./useMarketplaceContract";
import { useAppDispatch } from "@/redux/store";

const useStateUtil = () => {
  const dispatch = useAppDispatch();
  const { activeChangeOrder, getChangeOrdersData, getProjectData, getDisputeId } =
    useMarketplaceContract();

  const refetchContractInfo = async (projectId: string) => {
    if (projectId) {
        const projectData = await getProjectData(projectId, true);
        dispatch(setContractDetails(projectData));
      }
  }

  const refetchContractChangeOrderInfo = async (projectId: string) => {
    if (projectId) {
      const projectData = await getProjectData(projectId, true);
      const changeOrdersInfo = await getChangeOrdersData(projectId, true);
      const hasActiveChangeOrder = await activeChangeOrder(projectId);
      dispatch(setContractDetails(projectData));
      dispatch(setChangeOrdersCount(changeOrdersInfo?.length ?? 0));
      dispatch(setChangeOrderAvailable(hasActiveChangeOrder ?? false));
      dispatch(setChangeOrders(changeOrdersInfo));
    }
  };

  const refetchContractDisputeId = async (projectId: string) => {
    if(!projectId) return null;
    const disputeId = await getDisputeId(projectId);
    await dispatch(setDisputeID(disputeId?.toString())); 
  }

  return {
    refetchContractInfo,
    refetchContractChangeOrderInfo,
    refetchContractDisputeId
  };
};

export default useStateUtil;
