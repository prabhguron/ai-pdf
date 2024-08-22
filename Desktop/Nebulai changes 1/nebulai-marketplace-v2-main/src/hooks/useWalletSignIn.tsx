import { Address } from "viem";
import useApiController from "./useApiController";
import { useSignMessage, useSwitchNetwork } from "wagmi";
import { disconnect } from "@wagmi/core";
import { useAppDispatch } from "@/redux/store";
import { setWalletLoading, setWalletLoadingMsg } from "@/redux/auth/authSlice";

interface SignActionInput {
    signature: string | null;
    signedMsg: string | null;
    message: string;
    status: 'error' | 'success'
}

const useWalletSignIn = () => {
  const dispatch = useAppDispatch();
  const { getSigMessage } = useApiController();
  const { signMessageAsync } = useSignMessage();
  const { chains } = useSwitchNetwork();

  const signInWithWalletSig = async (address: Address): Promise<SignActionInput> => {
    dispatch(setWalletLoading(true));
    dispatch(setWalletLoadingMsg('Preparing Signature...'));
    let response:SignActionInput =  {
        signedMsg: null,
        signature: null,
        status: 'error',
        message: 'Something went wrong'
    }
    try {
      if (!address) {
        response.message = 'Please connect your wallet';
        return response
      };
      const message = await getSigMessage({
        address,
        chainId: chains[0]?.id,
      });
      if (message) {
        dispatch(setWalletLoadingMsg('Waiting For Wallet Signature...'));
        const signature = await signMessageAsync({
          message,
        });
        response.status = 'success';
        response.message = 'Signed Message';
        response.signedMsg = message;
        response.signature  = signature;
      }
    } catch (error: any) {
      console.log(error.message);
      let errMsg = "Something went wrong";
      if (error?.code === 4001) {
        errMsg = "User rejected signature";
      }
      await disconnect();
      response.message = errMsg;
      response.status = 'error';
    }
    return response;
  };

  return {
    signInWithWalletSig,
  }
};

export default useWalletSignIn;
