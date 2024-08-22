import { useAppSelector } from "@/redux/store";
import { Address, useAccount } from "wagmi";
import useMarketplaceActions from "./useMarketplaceActions";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const useContractAction = () => {
  const paymentToken = useAppSelector(
    (state) => state.contractInfo.contractDetails?.paymentToken
  );
  const providerStakeRaw = useAppSelector(
    (state) => state.contractInfo.contractDetails?.providerStakeRaw
  );

  const { isConnected } = useAccount();
  const { loadingText, isExecuting, usdtApprove, executeEscrowAction } =
    useMarketplaceActions();

  const actionHandler = async (
    funcName: string,
    args: any[],
    eventName = "",
    payable = false
  ) => {
    if (!isConnected) {
      toast.info("Please connect your wallet");
      return null;
    }
    let txHash = null;
    let value = ethers.BigNumber.from(0);
    if (payable) {
      value = ethers.BigNumber.from(providerStakeRaw);
      if (ethers.constants.AddressZero !== paymentToken) {
        const result = await usdtApprove(paymentToken as Address, value);
        if (result?.status === "error") {
          toast.error("Approval Transaction Failed");
          return;
        }
        value = ethers.BigNumber.from(0);
      }
    }
    const result = await executeEscrowAction(funcName, args, eventName, value);
    if (result?.status === "success") {
      toast.success(`TX: ${result?.txHash}`);
      txHash = result?.txHash;
    } else {
      const errorMessage = result?.revertErrorName
        ? `Tx Failed With: ${result?.revertErrorName}`
        : result?.errorMsg;
      toast.error(errorMessage);
    }
    return txHash;
  };

  return {
    loadingText,
    actionHandler,
    actionLoading: isExecuting,
  };
};

export default useContractAction;
