"use client";
import React, { useEffect, useRef, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { FaWallet } from "react-icons/fa";
import { disconnect } from "@wagmi/core";
import { useAccount } from "wagmi";
import useWalletSignIn from "@/hooks/useWalletSignIn";
import useLoginActions from "@/hooks/useLoginActions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setWalletLoading, setWalletLoadingMsg } from "@/redux/auth/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import SiewLoadingBtn from "./SiewLoadingBtn";
import { setWalletConnected } from "@/redux/commonConstants/commonConstantsSlice";

const SignInWithWalletBtn = () => {
  const dispatch = useAppDispatch();
  const {walletLoading , walletLoadingMsg, accessToken} = useAppSelector(state => state.auth);
  const router = useRouter();
  const { signInWithWalletSig } = useWalletSignIn();
  const { loginAction, fetchUserAndProfile } = useLoginActions();
  const { isConnected, address, isDisconnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [signInBtnConnected, setSignInBtnConnected] = useState(false);
  const signInBtnClick = useRef(false);

  useEffect(() => {
    if (isConnected && address && signInBtnClick.current) {
      if (!signInBtnConnected) {
        console.log("signIn is connected");
        setSignInBtnConnected(true);
      }
    }
  }, [isConnected]);

  useEffect(() => {
    if (signInBtnConnected && address) {
      signInWalletHandler();
    }
  }, [signInBtnConnected]);

  useEffect(() => {
    if (signInBtnConnected) {
      console.log("Disconnecting SignInBtn");
      signInBtnClick.current = false;
      setSignInBtnConnected(false);
    }
  }, [isDisconnected]);

  const signInWalletHandler = async () => {
    let errMsg = 'Something went wrong';
    try {
      if (isConnected && address) {
        const sigResult = await signInWithWalletSig(address);
        if (sigResult.status === "success" && sigResult?.signature && sigResult?.signedMsg) {
          dispatch(setWalletLoadingMsg('Please Wait...'));
          const authResult = await loginAction({
            message: sigResult?.signedMsg,
            signature: sigResult.signature,
            wallet: true,
          });
          dispatch(setWalletLoadingMsg(null));
          if (authResult?.status === "error") {
            dispatch(setWalletLoading(false));
            toast?.error(authResult?.msg);
            return;
          }

          const result = await fetchUserAndProfile();
          if (result !== null) {
            dispatch(setWalletLoading(false));
            if (result?.accessToken && result?.userRole) {
              dispatch(setWalletConnected(true));
              localStorage.setItem('nebWalletConnected', "true")
              router.push(`/${result?.userRole}/dashboard`);
              return;
            }
          }
        }else{
            errMsg = sigResult?.message
        }
      }
    } catch (error) {}
    dispatch(setWalletLoadingMsg(null));
    dispatch(setWalletLoading(false));
    toast.error(errMsg);
  };

  if(walletLoading && walletLoadingMsg){
    return <SiewLoadingBtn walletLoading={walletLoading} walletLoadingMsg={walletLoadingMsg}/>
  }

  return (
    <div className="form-group">
      <button
        className="btn siweBtn"
        type="button"
        name="sign-in-eth"
        onClick={async () => {
          await disconnect();
          signInBtnClick.current = true;
          openConnectModal?.();
        }}
        disabled={walletLoading}
      >
        SIGN IN WITH WALLET <FaWallet />
      </button>
    </div>
  );
};

export default SignInWithWalletBtn;
