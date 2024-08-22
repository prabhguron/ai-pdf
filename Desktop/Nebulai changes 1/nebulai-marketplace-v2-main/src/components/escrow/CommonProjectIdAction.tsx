"use client";
import CommonButton from "@/components/common/CommonButton";
import useWriteWaitContract from "@/hooks/useWriteWaitContract";
import marketPlaceABI from "@/abi/Marketplace.json";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { useAppSelector } from "@/redux/store";
import deployment from "@/abi/deployment.json";

const MARKETPLACE_CONTRACT = deployment?.MARKETPLACE_CONTRACT as Address;
const marketPlaceAddressABI = {
  address: MARKETPLACE_CONTRACT,
  abi: marketPlaceABI,
};

interface CommonProjectIdActionProps {
  btnLbl: string;
  funcName: string;
  eventName: string;
}

const CommonProjectIdAction = ({
  btnLbl,
  funcName,
  eventName,
}: CommonProjectIdActionProps) => {
  const projectId = useAppSelector((state) => state.contractInfo.contractId);
  const { address, isConnected } = useAccount();
  const { isExecuting, executeTransaction } = useWriteWaitContract();
  const appealRuleHandler = async () => {
    if (!isConnected) {
      toast.info("Please connect your wallet");
      return;
    }
    try {
      const createProjectArgs = {
        ...marketPlaceAddressABI,
        fromAddress: address as Address,
        functionName: funcName,
        args: [projectId],
        value: 0,
        eventNameToSearch: eventName,
      };

      const { status, txHash, errorMsg, revertErrorName } =
        await executeTransaction(createProjectArgs);
      if (status === "success") {
        toast.success(`TX: ${txHash}`);
      } else {
        const errorMessage = revertErrorName
          ? `Tx Failed With: ${revertErrorName}`
          : errorMsg;
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.log(error?.message);
      toast.error("Something went wrong");
    }
  };
  return (
    <div>
      <CommonButton
        btnLabel={btnLbl}
        customClasses={"btn-small w-100 mt-2"}
        isLoading={isExecuting}
        onClick={appealRuleHandler}
      />
    </div>
  );
};

export default CommonProjectIdAction;
