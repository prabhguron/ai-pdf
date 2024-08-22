import deployment from "@/abi/deployment.json";
import marketPlaceABI from "@/abi/Marketplace.json";
import erc20ABI from "@/abi/USDT.json";
import { Address, usePublicClient } from "wagmi";
import moment from "moment";
import { formatETHbalance } from "@/utils/helper";
import { ethers } from "ethers";
import { Abi } from "viem";
import { ChangeOrder, ChangeOrderFormatted, MarketContract, Project, ProjectFormatted } from "@/abi/contractTypes";
import { currencyImgMap } from "@/utils/formConstants";

const marketPlaceContract: MarketContract = {
  address: deployment.MARKETPLACE_CONTRACT as Address,
  abi: marketPlaceABI as Abi,
};
const useMarketplaceContract = () => {
  const publicClient = usePublicClient();

  const activeChangeOrder = async (projectId: string | null) => {
    if (!projectId) return false;
    try {
      const data = await publicClient.readContract({
        ...marketPlaceContract,
        functionName: "activeChangeOrder",
        args: [parseInt(projectId)],
      });
      return data as boolean;
    } catch (error) {}
    return false;
  };

  const getActiveChangeOrder = async (projectId: string | null) => {
    if (!projectId) return false;
    try {
      const data = await publicClient.readContract({
        ...marketPlaceContract,
        functionName: "getActiveChangeOrder",
        args: [parseInt(projectId)],
      });
      return data as ChangeOrder;
    } catch (error) {}
    return null;
  };

  const getDisputeId = async (projectId: string | null): Promise<BigInt | null> => {
    if (!projectId) return null;
    try {
      const data = await publicClient.readContract({
        address: marketPlaceContract?.address,
        abi: marketPlaceContract?.abi,
        functionName: "getDisputeId",
        args: [parseInt(projectId)],
      });
      return data as BigInt;
    } catch (error) {}
    return null;
  };

  const getProjectData = async (
    projectId: string | null,
    format = false
  ): Promise<ProjectFormatted | Project | null> => {
    if (!projectId) return null;
    try {
      const data = await publicClient.readContract({
        address: marketPlaceContract?.address,
        abi: marketPlaceContract?.abi,
        functionName: "getProject",
        args: [parseInt(projectId)],
      });

      const changeOrderPeriod = await publicClient.readContract({
        address: marketPlaceContract?.address,
        abi: marketPlaceContract?.abi,
        functionName: "CHANGE_ORDER_PERIOD",
        args: [],
      });

      if (!format) {
        return data as Project;
      }

      let projectFormatted = formatEscrowData(data as Project)
      projectFormatted.changeOrderPeriod = changeOrderPeriod as number;
      return projectFormatted;
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  const formatEscrowData = (data: Project): ProjectFormatted => {
    const duration = moment.duration(
      data?.reviewPeriodLength?.toString(),
      "seconds"
    );
    const days = duration.days();

    const formatted: ProjectFormatted = {
      buyer: data?.buyer,
      provider: data?.provider,
      status: data?.status,
      projectId: data?.projectId?.toString(),
      changeOrderPeriod: 0,
      changeOrderPeriodInitiatedRaw: data?.changeOrderPeriodInitiated?.toString(),
      changeOrderPeriodInitiated:
        data?.changeOrderPeriodInitiated?.toString() !== "0"
          ? moment
              .unix(parseInt(data?.changeOrderPeriodInitiated?.toString()))
              .format("MMM Do YYYY")
          : "-",
      dateCompleted: data?.dateCompleted?.toString(),
      dueDate: moment
        .unix(parseInt(data?.dueDate?.toString()))
        .format("MMM Do YYYY"),
      dueDateRaw: data?.dueDate?.toString(),
      projectFee: formatETHbalance(
        ethers.utils.formatEther(data?.projectFee?.toString() || "0")
      ), // Convert and format projectFee
      projectFeeRaw: data?.projectFee?.toString(),
      providerStake: formatETHbalance(
       
          ethers.utils.formatEther(data?.providerStake?.toString() || "0")
        
      ), // Convert and format providerStake
      providerStakeRaw: data?.providerStake?.toString(),
      nebulaiTxFee: formatETHbalance(
       
          ethers.utils.formatEther(data?.nebulaiTxFee?.toString() || "0")
        
      ), // Convert and format nebulaiTxFee
      nebulaiTxFeeRaw: data?.nebulaiTxFee?.toString(),
      currencyType:
        ethers.constants.AddressZero === data?.paymentToken ? "MATIC" : "NEBTT",
      detailsURI: data?.detailsURI,
      paymentToken: data?.paymentToken,
      reviewPeriodLength: `${days} Days`,
      reviewPeriodLengthRaw: data?.reviewPeriodLength?.toString(),
      escrow: data?.escrow,
    };

    return formatted;
  };

  const getChangeOrdersData = async (projectId: string | null, format = false) => {
    if (!projectId) return null;
    try {
      const data = await publicClient.readContract({
        address: marketPlaceContract?.address,
        abi: marketPlaceContract?.abi,
        functionName: "getChangeOrders",
        args: [parseInt(projectId)],
      });
      if (!format) {
        return data as ChangeOrder[];
      }
      return formatChangeOrdersData(data as ChangeOrder[]);
    } catch (error) {}
    return null;
  };

  const formatChangeOrdersData = (data: ChangeOrder[]):ChangeOrderFormatted[] => {
    const allChangeOrders:ChangeOrderFormatted[] = [];
    data.forEach((order) => {
      const formatted: ChangeOrderFormatted = {
        projectId: order?.projectId?.toString(),
        dateProposed : moment.unix(parseInt(order?.dateProposed?.toString())).format("MMM Do YYYY"),
        dateProposedRaw : order?.dateProposed?.toString(),
        proposedBy : order?.proposedBy,
        adjustedProjectFee : formatETHbalance(ethers.utils.formatEther(order?.adjustedProjectFee?.toString())),
        adjustedProjectFeeRaw : order?.adjustedProjectFee?.toString(),
        providerStakeForfeit : formatETHbalance(ethers.utils.formatEther(order?.providerStakeForfeit?.toString())),
        providerStakeForfeitRaw : order?.providerStakeForfeit?.toString(),
        buyerApproval : order?.buyerApproval,
        providerApproval : order?.providerApproval,
        detailsURI : order?.detailsURI,
        active : order?.active
      }
      allChangeOrders.push(formatted)
    });
    
    return allChangeOrders;
  };
  
  const getErc20Tokens = async (returnFormat = 'select'): Promise<TokenOption[]> => {
    try {
      let tokens: any = await publicClient.readContract({
        ...marketPlaceContract,
        functionName: "getErc20Tokens",
      });
      if (tokens) {
        let tokenData = await Promise.all(tokens.map(async (token: Address) => {
          const isApprovedToken = await publicClient.readContract({
            address: marketPlaceContract?.address,
            abi: marketPlaceContract?.abi,
            functionName: "isApprovedToken",
            args: [token],
          }) as boolean;

          if(isApprovedToken){
            const name = await publicClient.readContract({
              address: token,
              abi: erc20ABI,
              functionName: "name",
            }) as string;

            let symbol = await publicClient.readContract({
              address: token,
              abi: erc20ABI,
              functionName: "symbol",
            }) as string;
            symbol = symbol?.toLowerCase() ?? '';
            const tokenImg = currencyImgMap[symbol] ?? currencyImgMap['default'];
            switch (returnFormat) {
              case 'select':
                return {
                  value: symbol,
                  label: name,
                  imgSrc: tokenImg,
                  imgAlt: name
                };
              default:
                return {
                  value: symbol,
                  label: name,
                  imgSrc: '',
                  imgAlt: ''
                };
            }
          }

        }));
        tokenData.push({
          value: 'matic',
          label: 'Matic',
          imgSrc: currencyImgMap['matic'] ?? '',
          imgAlt: 'Matic'
        });
        return tokenData;
      }
    } catch (error: any) {
      console.log(error?.message);
    }
    return [];
  };


  return {
    getProjectData,
    activeChangeOrder,
    getActiveChangeOrder,
    getChangeOrdersData,
    getDisputeId,
    getErc20Tokens
  };
};

export default useMarketplaceContract;
