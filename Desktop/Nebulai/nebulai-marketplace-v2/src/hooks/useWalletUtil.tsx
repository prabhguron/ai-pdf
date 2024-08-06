import { useEffect, useRef } from "react";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { setWalletConnected } from "@/redux/commonConstants/commonConstantsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { disconnect } from '@wagmi/core'
import { toast } from "react-toastify";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Address } from "viem";

export type WalletInfo = {
  _id?: string;
  address: Address;
  name: string;
  isApproved?: boolean;
}

const useWalletUtil = ({key}:{
    key :string;
}) => {
  const dispatch = useAppDispatch();
  const walletConnected: boolean = useAppSelector(state => state.commonConstants.walletConnected) ?? false;
  const { isConnected, address } = useAccount();
  const { checkWalletLink } = NebulaiApi();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const wrongAccToastId = useRef<string | null>(null);
  const connectWalletClick = useRef<string | null>(null);

  useEffect(() => {
    if(!connectModalOpen && connectWalletClick.current === key && !walletConnected) {
      console.log('removing from localStorage util')
      connectWalletClick.current = null; 
      localStorage.removeItem('nebWalletConnected');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[connectModalOpen, walletConnected])

  useEffect(() => {
    if (isConnected && address && connectWalletClick.current === key) {
      checkWallet(address);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const checkWallet = async (addr: any) => {
    try {
      const res = await checkWalletLink(addr);
      if (res && res.status && res.data) {
        const { isLinked } = res.data;
        if (isLinked) {
          localStorage.setItem('nebWalletConnected', "true");
          dispatch(setWalletConnected(true));
        } else {
          wrongAccToastId.current = `${addr}-notLinked`;
          if (!toast.isActive(wrongAccToastId.current)) {
            toast.error(`Please link ${addr} wallet to your account`, {
              toastId: wrongAccToastId.current,
            });
          }
          await disconnect();
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const connectWallet = () => {
    if(isConnected) return;
    connectWalletClick.current = key;
    openConnectModal?.()
  }
  
  return {
    checkWallet,
    connectWallet
  };
};

export default useWalletUtil;
