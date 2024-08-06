"use client"
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState } from "react";
import { useAccount, useNetwork, useSignMessage, useSwitchNetwork } from "wagmi";
import { toast } from "react-toastify";
import { disconnect } from '@wagmi/core'
import NebulaiApi from "@/neb-api/NebulaiApi";
import useApiController from "@/hooks/useApiController";
import { addNewUserWallet, setUserWalletLinked } from "@/redux/auth/authSlice";
import { Address } from "viem";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setProfileStateWalletLinked } from "@/redux/getStartedSteps/getStartedStepsSlice";
import { setWalletConnected } from "@/redux/commonConstants/commonConstantsSlice";

interface LinkConnectBtnProps{
  btnLbl: string;
  lblIcon: string | React.ReactElement;
  refetchWallets?:() => void;
  floatClass?: string;
  connectAfterLink ?: boolean;
}

interface ValidateUserProfileReturn{
  profileCompleted: boolean;
  wallets: Address[];
  walletLinked: boolean;
  status?: string;
}

const LinkConnectButton = ({ btnLbl, lblIcon, refetchWallets, floatClass, connectAfterLink = false  }:LinkConnectBtnProps) => {
  const dispatch = useAppDispatch();
  const profileStat = useAppSelector(state => state.getStartedSteps.profileStat);
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;
  const { openConnectModal } = useConnectModal();
  const { linkWallet } = NebulaiApi();
  const {getSigMessage} = useApiController();
  const linkBtnClick = useRef(false);
  const [linkBtnConnected, setLinkBtnConnected] = useState(false);
  const { isConnected, isDisconnected, address } = useAccount();
  const { chain } = useNetwork();
  const {chains, switchNetworkAsync} = useSwitchNetwork();
  const [customSigMessage, setCustomSigMessage] = useState(null)
  const [walletName, setWalletName] = useState<string>('')
  const signMessage = useSignMessage({
    onSettled: async (signature, error: any) => {
      if (signature) {
          //link user wallet
          const linkResult = await linkWallet({message:customSigMessage, walletName, signature});
          if (linkResult && linkResult.status && linkResult.data) {
            const status = linkResult?.data?.status || "error";
            const msg = linkResult?.data?.message || "Something went wrong";
            const isSuccess = status === "success";
            const toastMsg = (isSuccess) ? `Address ${address} linked successfully` : msg;

            if(isSuccess){
              await dispatch(setUserWalletLinked(true));
              await dispatch(addNewUserWallet({address: address?.toLowerCase(), name: walletName}));
              setWalletName('');
              if(!profileStat?.walletLinked){
                dispatch(setProfileStateWalletLinked({address: address?.toLowerCase(), name: walletName}));
                //dispatch(validateGetStartedUserProfile());
              }
              if(connectAfterLink){
                localStorage.setItem('nebWalletConnected', "true");
                dispatch(setWalletConnected(true));
              }else{
               await disconnect();
              }
            }else{
              await disconnect();
            }
            toast(toastMsg, {type: status});
            refetchWallets?.();
          }
      }

      if(error){
        let errMsg = "Something went wrong"
        if(error?.code === 4001){
          errMsg = "User rejected signature"
        }
        await disconnect();
        toast.error(errMsg);
      }
      setCustomSigMessage(null);
    }
  });

  useEffect(() => {
    if (linkBtnConnected && address) {
      linkWalletAction();
    }
  }, [linkBtnConnected]);

  useEffect(() => {
    if(isConnected && address && linkBtnClick.current){
      if (!linkBtnConnected) {
        console.log('is connected true')
        setLinkBtnConnected(true);
      }
    }
  }, [isConnected]);

  useEffect(() => {
    if (linkBtnConnected) {
      console.log('Disconnecting LinkBtn')
      linkBtnClick.current = false;
      setLinkBtnConnected(false);
    }
  }, [isDisconnected]);

  const linkWalletAction = async () => {
    try {
      if(!isConnected || !address) return;
      const message = await getSigMessage({
        address,
        chainId: chains[0]?.id,
        link: true,
      });
      if (message) {
        setCustomSigMessage(message);
        signMessage.signMessage({
          message
        })
      }
      //setLinkBtnConnected(false);
    } catch (error: any) {
      console.log(error.message);
      let errMsg = "Something went wrong"
      if(error?.code === 4001){
        errMsg = "User rejected signature"
      }
      await disconnect();
      toast.error(errMsg);
    }
  }

  const linkWalletHandler = async() => {
    try {
      if(!walletName.length){
        toast.info("Wallet name is required");
        return;
      }
      if(chain && chain?.unsupported){
        await switchNetworkAsync?.(chains[0]?.id);
      }
      
      if (isConnected && address) {
        linkWalletAction();
      }else{
        linkBtnClick.current = true; 
        openConnectModal?.();
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }
  
  let btnClass = `theme-btn btn-style-one btn-small-group ${
    (typeof floatClass !== 'undefined' )? floatClass : "float-end"
  }`;

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        let connected: boolean = !!(ready && account && chain);
        if (linkBtnConnected) {
          connected = true;
        } else {
          connected = false;
        }

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
            className="d-flex justify-content-end"
          >
            {(() => {
              if (!connected) {
                return (
                    <div className="input-group flex-nowrap justify-content-end">
                      <input
                        type="text"
                        className="w-50 h-40"
                        placeholder="Name"
                        aria-label="Wallet Name"
                        onChange={(e) => {
                          if(walletName.length > 20) return;
                          setWalletName(e.target.value)
                        }}
                        value={walletName}
                      ></input>
                       <button
                        onClick={linkWalletHandler}
                        type="button"
                        className={btnClass}
                      >
                        <span className="me-2">{btnLbl}</span>
                        {lblIcon}
                      </button>
                    </div>
                );
              }

              return (
                <button
                  type="button"
                  className={btnClass}
                  disabled
                >
                  Waiting For Sig...{" "}
                  <span
                    className="spinner-border spinner-border-sm pl-4"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default LinkConnectButton;
