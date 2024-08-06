"use client";

import "@/styles/index.scss";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";
import "aos/dist/aos.css";
import Aos from "aos";
import { ToastContainer } from "react-toastify";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import React from "react";
import $ from "jquery";
import Popper from "popper.js";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { defineChain } from "viem";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ConfirmDialogProvider } from "@/context/ConfirmDialog";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Lato } from "next/font/google";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { localhost } from "wagmi/chains";

const lato = Lato({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["100", "300"],
});

const alchemyApi = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string;
const providerId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROVIDER as string;

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
  window.Buffer = window.Buffer || Buffer;
  // Make Bootstrap and jQuery available to the global scope
  window.$ = $;
  window.jQuery = $;
  window.Popper = Popper;
}

const queryClient = new QueryClient();

const polygonAmoy = defineChain({
    id: 80002,
    name: "Polygon Amoy",
    network: "amoy",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpcUrls: {
      alchemy: {
         http:  ["https://polygon-amoy.g.alchemy.com/v2"],
         webSocket:  ["wss://polygon-amoy.g.alchemy.com/v2"]
      },
      public: {
        http: ["https://rpc-amoy.polygon.technology"]
      },
      default: {
        http: ["https://rpc-amoy.polygon.technology"]
      }
    },
    testnet: true,
    blockExplorers: {
      default: {
          name: "OK LINK",
          url: "https://www.oklink.com/amoy"
      }
    },
    contracts: {
      multicall3: {
          address: "0xca11bde05977b3631167028862be2a173976ca11",
          blockCreated: 3127388
      }
    }
})

const foundry = {
  ...localhost,
  id:31337,
  name: 'foundry'
}

let dAppChains:any = [polygon];
if(process.env.NEXT_PUBLIC_APP_ENV === 'development'){
  dAppChains = [foundry];
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  dAppChains,
  [alchemyProvider({ apiKey: alchemyApi }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Nebulai",
  projectId: providerId,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    Aos.init({
      duration: 1400,
      once: true,
    });
  }, []);
  return (
    <>
      <style jsx global>{`
        body {
          font-family: ${lato.style.fontFamily} !important;
        }
      `}</style>
      <Provider store={store}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            modalSize="compact"
            appInfo={{
              appName: "Nebulai DSTM",
            }}
            theme={darkTheme({
              accentColor: "#ab31ff",
              accentColorForeground: "white",
            })}
            coolMode
          >
            <QueryClientProvider client={queryClient}>
              <ConfirmDialogProvider>
                <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  closeOnClick={false}
                  draggable={false}
                  style={{
                    zIndex: 999999
                  }}
                />
                <ProgressBar
                  height="5px"
                  color="#ab31ff"
                  options={{ showSpinner: false }}
                  shallowRouting
                />
                {mounted && children}
              </ConfirmDialogProvider>
            </QueryClientProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </Provider>
    </>
  );
}

export default Providers;