import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { Address, BaseError, ContractFunctionRevertedError, Hash, TransactionExecutionError, UserRejectedRequestError, parseEther } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

export interface ExecuteTransactionPayload{
  address: Address;
  abi: any;
  functionName: string;
  args: any[];
  value?: any;
  eventNameToSearch?: string | null;
  fromAddress: Address
}

type ExecutionStatus = "success" | "error"
export interface ExecuteTransactionResponse{
    status: ExecutionStatus;
    txHash?: Hash;
    eventArgData?: any;
    errorMsg?: string;
    revertError?: any;
    revertErrorName?: string | null;
}

const useWriteWaitContract = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [isExecuting, setIsExecuting] = useState(false);
  const [loadingText, setLoadingText] = useState('Please Wait...');

  const executeTransaction = async (payload: ExecuteTransactionPayload): Promise<ExecuteTransactionResponse> => {
    if (typeof payload !== 'object' || payload === null) {
        return {
            status : 'error',
            errorMsg: 'Invalid or missing payload.'
        };
    }
    const {
        address,
        abi,
        functionName,
        args,
        value = 0,
        eventNameToSearch = null,
        fromAddress
    } = payload
    if (!address || !abi || !functionName || !args || !fromAddress) {
        return {
            status : 'error',
            errorMsg: 'Missing required fields in payload.'
        };
    }
    setIsExecuting(true);

    const contractPayableValue = parseEther(ethers.utils.formatEther(value.toString()));
    try {
      const { request } = await publicClient.simulateContract({
        address,
        abi,
        functionName,
        args,
        value: contractPayableValue,
        account: fromAddress,
      });

      setLoadingText('Waiting for wallet...')
      const txHash = await walletClient?.writeContract(request);
      if(!txHash){
        return {
          status : 'error',
          errorMsg: 'Tx Hash not found'
       };
      }
      const hash: Hash = txHash;
      setLoadingText('Please Wait...');
      const transaction = await publicClient.waitForTransactionReceipt({
        hash
      });
      const contractInterface = new ethers.utils.Interface(abi);
      let eventArgData = null;
      if(eventNameToSearch){
        transaction.logs.forEach((log) => {
            try {
              let parsedLog = contractInterface.parseLog(log);
              if (parsedLog && parsedLog.name === eventNameToSearch) {
                eventArgData = parsedLog.args || null;
              }
            } catch (e) {}
          });
      }
      setIsExecuting(false);
      return {
        status: "success",
        txHash,
        eventArgData,
      };
    } catch (err: any) {
      console.log(err?.message);
      setIsExecuting(false);
      let revertErrorName = null;
      let errorMsg = err?.message || 'Something went wrong';
      let revertError: any = err;
      if (err instanceof BaseError) {
        revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          revertErrorName = revertError.data?.errorName ?? "";
        }
        errorMsg = revertError?.shortMessage ?? errorMsg;
      }

      if(err instanceof TransactionExecutionError){
        revertError = err.walk(
            (err) => err instanceof UserRejectedRequestError
        );
        if (revertError instanceof UserRejectedRequestError) {
          errorMsg = revertError?.shortMessage ?? "User rejected request";
        }
      }
      return {
        status: "error",
        errorMsg,
        revertError,
        revertErrorName,
      };
    }
  };

  return {
    loadingText,
    isExecuting,
    executeTransaction
  }
};

export default useWriteWaitContract;
