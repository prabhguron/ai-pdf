"use client"
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef } from "react";
import { useAccount} from "wagmi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setWalletConnected } from "@/redux/commonConstants/commonConstantsSlice";
import useWalletUtil from "@/hooks/useWalletUtil";


interface NebBtn {
  btnLbl: string;
  lblIcon?: string | React.ReactElement | null;
  btnCustomClass?: string;
}

const NebConnectButton = (props:NebBtn) => {
  const {btnLbl, lblIcon, btnCustomClass} = props
  const dispatch = useAppDispatch();
  const walletConnected: boolean = useAppSelector(state => state.commonConstants.walletConnected) ?? false;
  const {checkWallet} = useWalletUtil({key: 'neb-main-connect'});
  const { isConnected, isDisconnected, address,connector: activeConnector  } = useAccount();
  const { openConnectModal, connectModalOpen } = useConnectModal();

  const walletBtnClick = useRef<boolean>(false);

  useEffect(() => {
    if(!walletBtnClick.current && localStorage.getItem('nebWalletConnected')){
      walletBtnClick.current = true;
    }
  },[])

  useEffect(() => {
    if (walletConnected && address && walletBtnClick.current) {
      checkWallet(address);
    }
  }, [walletConnected]);

  useEffect(() => {
    if(isConnected && address && walletBtnClick.current){
      if (!walletConnected) {
        console.log('nebBtn is connected true')
        dispatch(setWalletConnected(true));
      }
    }
  }, [isConnected]);

  useEffect(() => {
    if(isConnected && address){
      dispatch(setWalletConnected(true));
    }
  },[]);

  useEffect(() => {
    if (walletConnected) {
      console.log('Disconnecting NebBtn')
      walletBtnClick.current = false;
      dispatch(setWalletConnected(false));
      localStorage.removeItem('nebWalletConnected');
    }
  }, [isDisconnected]);


  useEffect(() => {
    if(!connectModalOpen && walletBtnClick.current && !walletConnected) {
      console.log('removing from localStorage')
      walletBtnClick.current = false; 
      localStorage.removeItem('nebWalletConnected');
    }
  },[connectModalOpen, walletConnected])

  useEffect(() => {
	  const handleConnectorUpdate = async ({account, chain}: any) => {
      if (account && walletBtnClick.current) {
        console.log('new account', account)
        await checkWallet(account);
      }
    }

    if (activeConnector) {
        activeConnector.addListener('change', handleConnectorUpdate)
    }

	return () => {
        if(activeConnector){
            activeConnector.removeAllListeners('change');
        }
    }
  }, [activeConnector])


  const walletHandler = async () => {
    if (isConnected && address) {
      await checkWallet(address);
    }else{
      walletBtnClick.current = true; 
      localStorage.setItem('nebWalletConnected', walletBtnClick.current.toString());
      openConnectModal?.();
    }
  }

  const btnClass = `theme-btn btn-style-one btn-small float-end ${btnCustomClass??''}`

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
        let connected:boolean = ready && account!==null && chain !== null
        if (walletConnected) {
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
          >
            {(() => {
              if (!connected) {
                return (
                  <span
                    onClick={walletHandler}
                    className={btnClass}
                  >
                    {btnLbl} {lblIcon}
                  </span>
                );
              }


              if (chain?.unsupported) {
                return (
                  <span onClick={openChainModal} className="iekbcc0 iekbcc9 ju367v71 ju367v7m ju367v86 ju367v6f ju367v4 ju367va0 ju367vn ju367vec ju367vfr ju367vb ju367va ju367v11 ju367v1c ju367v1k ju367v8o _12cbo8i3 ju367v8m _12cbo8i4 _12cbo8i6">
                    <div className="iekbcc0 ju367v6x ju367v7i ju367v4 ju367va ju367v25">Wrong network</div>
                  </span>
                );
              }
              

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <span onClick={openAccountModal} className={btnClass}>
                    {account?.displayName}
                    {account?.displayBalance
                      ? ` (${account?.displayBalance})`
                      : ''}
                  </span>
                </div>
              );

            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default NebConnectButton;
