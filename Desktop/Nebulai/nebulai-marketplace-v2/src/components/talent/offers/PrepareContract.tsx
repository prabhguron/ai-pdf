"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import OffersApi from "@/neb-api/OffersApi";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Address, useAccount, useBalance } from "wagmi";
import marketPlaceABI from "@/abi/Marketplace.json";
import usdtABI from "@/abi/NebulaiTestTokenFaucet.json";
import useWriteWaitContract, {
  ExecuteTransactionPayload,
} from "@/hooks/useWriteWaitContract";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { setOfferEscrow } from "@/redux/jobOffer/jobOfferSlice";
import useConfirm from "@/context/ConfirmDialog";
import { Hash } from "viem";
import deployedContracts from "@/abi/deployment.json";
import { useAppSelector } from "@/redux/store";
import NebConnectButton from "@/components/wallet/NebConnectButton";
import TransakBox from "@/components/transak/TransakBox";
import { VscNewFile } from "react-icons/vsc";

type UpdateTxInfoPayload = {
  transactionHash: Hash;
  escrowProjectId: string;
  buyer?: Address;
  provider?: Address;
};

const PrepareContract = ({ offerId }: { offerId: string }) => {
  const MARKETPLACE_CONTRACT = deployedContracts["MARKETPLACE_CONTRACT"];
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();
  const { data } = useBalance({
    address: address ?? undefined,
  });
  const walletBalance =
    address && data?.formatted ? parseInt(data?.formatted ?? "0") : null;
  const projectCompensation =
    useAppSelector((state) => state.jobOffer.selectedOfferInfo?.compensation) ??
    null;
  const showTransakBox: boolean =
    walletBalance !== null && projectCompensation !== null
      ? walletBalance < projectCompensation
      : false;

  const [loadingText, setLoadingText] = useState("Please wait...");
  const { prepareOfferContract, updateOfferTxInfo } = OffersApi();
  const { isExecuting, executeTransaction } = useWriteWaitContract();
  const jobId = useAppSelector((state) => state.jobFlowSteps.jobData?._id);

  const { mutate: saveTxInfo, isLoading: savingTxInfo } = useMutation({
    mutationFn: (mutationData: UpdateTxInfoPayload) => {
      return updateOfferTxInfo(offerId, mutationData);
    },
    onSuccess: async (response) => {
      const { status, config } = response;
      if (status === 200) {
        const requestData = JSON.parse(config?.data);
        queryClient.setQueryData(["offerMetadata", offerId], (prev: any) => {
          return {
            ...prev,
            txData: {
              transactionHash: requestData?.transactionHash,
              escrowProjectId: requestData?.escrowProjectId,
            },
          };
        });
        //const escrowData = await getProjectData(requestData?.escrowProjectId, true);
        //if (escrowData) {
        await dispatch(setOfferEscrow(requestData?.escrowProjectId ?? null));
        //}
        queryClient.invalidateQueries({
          queryKey: ["shortListedApplicants", jobId],
        });
      }
    },
    onError: (error) => {
      console.log("Something went wrong");
    },
  });

  const usdtApprove = async (
    payTokenAddress: Address,
    projectFeeWithTxFee: number,
  ) => {
    console.log(
      "Approve -> ",
      payTokenAddress,
      projectFeeWithTxFee,
      MARKETPLACE_CONTRACT,
    );
    const approveResult = await executeTransaction({
      fromAddress: address as Address,
      address: payTokenAddress,
      abi: usdtABI,
      functionName: "approve",
      args: [MARKETPLACE_CONTRACT, projectFeeWithTxFee],
    });
    return approveResult;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: (mutationData: { offerId: string }) => {
      return prepareOfferContract(offerId, mutationData);
    },
    onSuccess: async (response) => {
      const { status, data } = response;
      if (status === 200) {
        try {
          const { contractArgs } = data;
          let {
            provider,
            paymentToken,
            projectFee,
            projectFeeWithTxFee,
            providerStake,
            dueDate,
            reviewPeriodLength,
            detailsURI,
          } = contractArgs;

          projectFee = ethers.BigNumber.from(projectFee);
          projectFeeWithTxFee = ethers.BigNumber.from(projectFeeWithTxFee);

          const createProjectArgs: ExecuteTransactionPayload = {
            fromAddress: address as Address,
            address: MARKETPLACE_CONTRACT as Address,
            abi: marketPlaceABI,
            functionName: "createProject",
            args: [
              provider,
              paymentToken,
              projectFee,
              providerStake,
              dueDate,
              reviewPeriodLength,
              detailsURI,
            ],
            value: projectFeeWithTxFee,
            eventNameToSearch: "ProjectCreated",
          };
          //Approve USDT
          if (ethers.constants.AddressZero !== paymentToken) {
            setLoadingText("Waiting For Token Approval...");
            const { status: approvalTxStatus } = await usdtApprove(
              paymentToken,
              projectFeeWithTxFee,
            );
            if (approvalTxStatus === "error") {
              toast.error("Approval Transaction Failed");
              return;
            }
            setLoadingText("Please wait...");
            createProjectArgs.value = 0;
          }

          const { status, txHash, eventArgData, errorMsg, revertErrorName } =
            await executeTransaction(createProjectArgs);
          if (status === "success") {
            toast.success(`Project Created: TX: ${txHash}`);
            if (eventArgData) {
              let {
                projectId,
                buyer,
                provider,
              }: {
                projectId: string;
                buyer: Address;
                provider: Address;
              } = eventArgData;
              projectId = projectId.toString();
              setLoadingText("Saving Project Info Please Wait...");
              saveTxInfo({
                transactionHash: txHash as Hash,
                escrowProjectId: projectId,
                buyer,
                provider,
              });
            }
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
      }
    },
    onError: (error) => {
      toast.error("Something went wrong");
    },
  });

  const prepareOfferContractHandler = async () => {
    if (!isConnected) {
      toast.info("Please connect your wallet");
      return;
    }
    const choice = await confirm({
      title: "Create Contract",
      description: `Are you sure you want to create a new contract?`,
      btnLabel: "Yes",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
      zIndexCustom: true,
    });
    if (!choice) return;
    try {
      mutate({
        offerId,
      });
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="w-100">
        <NebConnectButton btnLbl={"Connect Wallet"} btnCustomClass="w-100" />
      </div>
    );
  }

  return (
    <div className="row">
      {showTransakBox && (
        <div className="col-12 col-md-6 col-lg-6 col-xl-6">
          <TransakBox customClass="w-100" />
        </div>
      )}

      <div
        className={`${
          showTransakBox ? "col-12 col-md-6 col-lg-6 col-xl-6" : "col-12"
        }`}
      >
        <button
          type="button"
          className="theme-btn btn-style-one btn-small fw-bold w-100 gap-2"
          onClick={prepareOfferContractHandler}
          disabled={isLoading || isExecuting || savingTxInfo}
        >
          {isLoading || isExecuting || savingTxInfo ? (
            <>
              {loadingText}{" "}
              <span
                className="spinner-border spinner-border-sm pl-4"
                role="status"
                aria-hidden="true"
              ></span>
            </>
          ) : (
            <>
              <VscNewFile />
              <span>Create Contract</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PrepareContract;
