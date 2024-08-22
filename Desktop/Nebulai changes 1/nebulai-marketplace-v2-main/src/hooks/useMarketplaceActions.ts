import marketPlaceABI from "@/abi/Marketplace.json";
import usdtABI from "@/abi/NebulaiTestTokenFaucet.json";
import useWriteWaitContract, { ExecuteTransactionResponse } from "./useWriteWaitContract";
import { useAccount } from "wagmi";
import { useCallback } from "react";
import { BigNumber } from "ethers";
import { Address } from "viem";
import deployment from "@/abi/deployment.json";

const MARKETPLACE_CONTRACT = deployment?.MARKETPLACE_CONTRACT as Address;
const marketPlaceAddressABI = {
  address: MARKETPLACE_CONTRACT,
  abi: marketPlaceABI,
};
const useMarketplaceActions = () => {
  const { address } = useAccount();
  const { loadingText, isExecuting, executeTransaction } =
    useWriteWaitContract();

  const usdtApprove = async (usdtAddress: Address, allowance: BigNumber) => {
    if (!address) return;
    const approveResult = await executeTransaction({
      fromAddress: address,
      address: usdtAddress,
      abi: usdtABI,
      functionName: "approve",
      args: [MARKETPLACE_CONTRACT, allowance],
    });
    return approveResult;
  };

  const executeEscrowAction = useCallback(
    async (
      funcName: string,
      args: any[] = [],
      eventNameToSearch: string | null = null,
      value?: BigNumber | number
    ): Promise<ExecuteTransactionResponse | null> => {
      try {
        const funcArgs = {
          ...marketPlaceAddressABI,
          fromAddress: address as Address,
          functionName: funcName,
          args,
          value,
          eventNameToSearch,
        };
        const { status, txHash, eventArgData, errorMsg, revertErrorName } = await executeTransaction(funcArgs);
        return  { status, txHash, eventArgData, errorMsg, revertErrorName }
      } catch (error) {}
      return null;
    },
    [address, executeTransaction]
  );
  

  return {
    loadingText, isExecuting,
    usdtApprove,
    executeEscrowAction
  };
};

export default useMarketplaceActions;
