import { useQueryClient } from "@tanstack/react-query";
import { Web3sdksSDKProvider, useSigner } from "@web3sdks/react";
import { ChainId, SDKOptions, SUPPORTED_CHAIN_ID } from "@web3sdks/sdk/evm";
import { getEVMRPC } from "constants/rpc";
import { StorageSingleton } from "lib/sdk";
import { ComponentWithChildren } from "types/component-with-children";
import { useProvider } from "wagmi";

export const CustomSDKContext: ComponentWithChildren<{
  desiredChainId?: SUPPORTED_CHAIN_ID | -1;
  options?: SDKOptions;
}> = ({ desiredChainId, options, children }) => {
  const signer = useSigner();
  const provider = useProvider();
  const queryClient = useQueryClient();

  return (
    <Web3sdksSDKProvider
      desiredChainId={desiredChainId}
      signer={signer}
      provider={provider}
      queryClient={queryClient}
      sdkOptions={{
        gasSettings: {
          maxPriceInGwei: 650,
        },
        readonlySettings:
          desiredChainId && desiredChainId !== -1
            ? {
                chainId: desiredChainId,
                rpcUrl: getEVMRPC(desiredChainId),
              }
            : undefined,
        ...options,
      }}
      storageInterface={StorageSingleton}
    >
      {children}
    </Web3sdksSDKProvider>
  );
};

export const PublisherSDKContext: ComponentWithChildren = ({ children }) => (
  <CustomSDKContext
    desiredChainId={ChainId.Polygon}
    options={{
      gasless: {
        openzeppelin: {
          relayerUrl:
            "https://api.defender.openzeppelin.com/autotasks/230183c3-2528-4f30-959d-b83d296f37c6/runs/webhook/1fb04295-e74b-44cb-86fe-bf19f5b23642/XMCee4Jc5zwVeSgdB6NYGG",
          relayerForwarderAddress: "0x6b02587486FE607a13d6cE3A1b846736a095DA03",
        },
        experimentalChainlessSupport: true,
      },
    }}
  >
    {children}
  </CustomSDKContext>
);
