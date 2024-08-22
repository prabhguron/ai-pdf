import CommonButton from "@/components/common/CommonButton";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { ESCROW_STATUS } from "@/utils/constants";
import { ethers } from "ethers";
import { ProjectActionBtn } from "@/abi/contractTypes";
import { useAppSelector } from "@/redux/store";
import useMarketplaceActions from "@/hooks/useMarketplaceActions";

const EscrowProjectActions = ({
  actionBtn,
}: {
  actionBtn: ProjectActionBtn;
}) => {
  const { user } = useAppSelector((state) => state?.auth);
  const escrowData = useAppSelector(
    (state) => state.contractInfo.contractDetails
  );

  const projectId = escrowData?.projectId;
  const projectStatus = escrowData?.status;
  const paymentToken = escrowData?.paymentToken;
  const providerStakeRaw = escrowData?.providerStakeRaw;
  const actionKey =
    typeof projectStatus !== "undefined"
      ? ESCROW_STATUS[projectStatus].toLowerCase()
      : "";

  const [btnLoading, setBtnLoading] = useState<string | null>(null);
  const userRole = user?.role || "";
  const { isConnected } = useAccount();
  const { loadingText, isExecuting, usdtApprove, executeEscrowAction } =
    useMarketplaceActions();

  useEffect(() => {
    if (btnLoading !== null && !isExecuting) {
      setBtnLoading(null);
    }
  }, [isExecuting]);

  const createOnClickHandler = useCallback(
    (funcName: string, args: any[], eventName = "", payable = false) =>
      async () => {
        if (!isConnected) {
          toast.info("Please connect your wallet");
          return;
        }
        setBtnLoading(funcName);
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
        const result = await executeEscrowAction(
          funcName,
          args,
          eventName,
          value
        );
        if (result?.status === "success") {
          toast.success(`TX: ${result?.txHash}`);
        } else {
          const errorMessage = result?.revertErrorName
            ? `Tx Failed With: ${result?.revertErrorName}`
            : result?.errorMsg;
          toast.error(errorMessage);
        }
      },

    [executeEscrowAction, isConnected]
  );

  if (!escrowData) return null;

  const allActions = {
    approve: {
      label: "Approve Submission",
      onClickHandler: createOnClickHandler(
        "approveProject",
        [projectId],
        "ProjectApproved"
      ),
      customClasses: "btn-small w-100 mt-2",
      allowedRoles: ["company"],
      show: actionKey === "completed",
      btnKey: "approveProject",
    },
    activate: {
      label: "Activate Contract",
      onClickHandler: createOnClickHandler(
        "activateProject",
        [projectId],
        "ProjectActivated",
        true
      ),
      customClasses: "btn-small w-100 mt-2",
      allowedRoles: ["talent"],
      show: actionKey === "created",
      btnKey: "activateProject",
    },
    cancel: {
      label: "Cancel Contract",
      onClickHandler: createOnClickHandler(
        "cancelProject",
        [projectId],
        "ProjectCancelled"
      ),
      customClasses: "btn-small w-100 mt-2",
      allowedRoles: ["company"],
      show: actionKey === "created",
      btnKey: "cancelProject",
    },
    complete: {
      label: "Complete Contract",
      onClickHandler: createOnClickHandler(
        "completeProject",
        [projectId],
        "ProjectCompleted"
      ),
      customClasses: "btn-small w-100 mt-2",
      allowedRoles: ["talent"],
      show: actionKey === "active",
      btnKey: "completeProject",
    },
    delinquent: {
      label: "Delinquent Payment",
      onClickHandler: createOnClickHandler(
        "delinquentPayment",
        [projectId],
        "DelinquentPayment"
      ),
      customClasses: "btn-small w-100 mt-2",
      allowedRoles: ["talent"],
      show: actionKey !== "approved",
      btnKey: "delinquentPayment",
    },
  };

  if (!actionBtn || !allActions[actionBtn]) {
    return <></>;
  }

  if (
    !allActions[actionBtn]?.show ||
    !allActions[actionBtn]?.allowedRoles?.includes(userRole)
  ) {
    return <></>;
  }

  return (
    <>
      {allActions[actionBtn] && (
        <CommonButton
          loadingText={
            btnLoading === allActions[actionBtn]?.btnKey ? loadingText : ""
          }
          btnLabel={allActions[actionBtn]?.label}
          customClasses={allActions[actionBtn]?.customClasses}
          onClickHandler={allActions[actionBtn]?.onClickHandler}
          isLoading={btnLoading === allActions[actionBtn]?.btnKey}
        />
      )}
    </>
  );
};

export default EscrowProjectActions;
