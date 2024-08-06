"use client";
import { useEffect, useState } from "react";
import CommonButton from "@/components/common/CommonButton";
import SuccessTick from "@/components/common/SuccessTick";
import useWriteWaitContract from "@/hooks/useWriteWaitContract";
import React from "react";
import escrowABI from "@/abi/Escrow.json";
import { toast } from "react-toastify";
import { Address, useAccount } from "wagmi";
import useEscrowContract from "@/hooks/useEscrowContract";
import { useQuery } from "@tanstack/react-query";
import { formatETHbalance } from "@/utils/helper";
import { ethers } from "ethers";
import { useAppSelector } from "@/redux/store";

interface AmountDueCommissionFeeData {
  amount: string;
  commissionFee: string;
}

const EscrowWithdraw = ({escrowAddress}:{escrowAddress: Address}) => {
  const [withdrawn, setWithdrawn] = useState(false);
  const contractCurrency = useAppSelector(state => state?.contractInfo?.contractDetails?.currencyType);
  const { address, isConnected } = useAccount();
  const { loadingText, isExecuting, executeTransaction } =
    useWriteWaitContract();
  const { isReleasableFunds, hasWithdrawn, amountDueAndCommissionFee } = useEscrowContract(escrowAddress);

  const {
    data: isReleasable,
    isLoading: isReleasableLoading,
    isError: isReleasableError,
  } = useQuery({
    queryKey: ["isReleasableFunds", escrowAddress], // queryKey
    queryFn: () => isReleasableFunds(), // queryFn
    cacheTime: Infinity,
    onError: (error: any) => {
      console.error(error?.message);
    },
  });

  const {
    data: checkWithdrawn,
    isLoading: hasWithdrawnLoading,
    isError: hasWithdrawnError,
  } = useQuery({
    queryKey: ["hasWithdrawn", escrowAddress], // queryKey
    queryFn: () => hasWithdrawn(address ?? null), // queryFn
    cacheTime: Infinity,
    onError: (error: any) => {
      console.error(error?.message);
    },
  });
  
  useEffect(() => {
    if (isConnected && address) {
      setWithdrawn(checkWithdrawn ?? false);
    }
  }, [checkWithdrawn]);

  const {
    data: amountDueW,
    isLoading: amountDueLoading,
    isError: amountDueError,
  } = useQuery({
    queryKey: ["amountDue", escrowAddress], // queryKey
    queryFn: () => amountDueAndCommissionFee(address ?? null), // queryFn
    cacheTime: Infinity,
    onError: (error: any) => {
      console.error(error?.message);
    },
  });

  const amountResult = amountDueW as AmountDueCommissionFeeData;
  const amountDue = amountResult?.amount ?? "0";
  //const commissionFee = amountResult?.commissionFee ?? "0";
  
  const withdrawAmount = formatETHbalance(
      ethers.utils.formatEther(ethers.BigNumber.from(amountDue))
  );

  const withdrawHandler = async () => {
    if (!isConnected) {
      toast.info("Please connect your wallet");
      return;
    }
    try {
      const withdrawArgs = {
        address: escrowAddress,
        abi: escrowABI,
        fromAddress: address as Address,
        functionName: "withdraw",
        args: [],
        value: 0,
        eventNameToSearch: "EscrowReleased",
      };

      const { status, txHash, errorMsg, revertErrorName } =
        await executeTransaction(withdrawArgs);
      if (status === "success") {
        toast.success(`TX: ${txHash}`);
        setWithdrawn(true);
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

  if (withdrawn) {
    return (
      <button
        type="button"
        className={`theme-btn btn-style-one btn-small my-2 disabled-btn gap-1`}
      >
        <SuccessTick height="25" width="25" />
        Withdrawn ({withdrawAmount} {contractCurrency})
      </button>
    );
  }

  if (!isReleasable || withdrawAmount === "0") {
    return <></>;
  }

  return (
    <div>
      <CommonButton
        btnLabel={`WITHDRAW ( ${withdrawAmount} ${contractCurrency})`}
        customClasses={"btn-small mt-2"}
        isLoading={isExecuting}
        loadingText={loadingText}
        onClick={withdrawHandler}
      />
    </div>
  );
};

export default EscrowWithdraw;
