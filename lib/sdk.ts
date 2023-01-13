import {
  Web3sdksSDK as EVMWeb3sdksSDK,
  SUPPORTED_CHAIN_ID,
  ChainId,
} from "@web3sdks/sdk/evm";
import { Web3sdksSDK as SOLWeb3sdksSDK } from "@web3sdks/sdk/solana";
import { IpfsUploader, Web3sdksStorage } from "@web3sdks/storage";
import { getEVMRPC, getSOLRPC } from "constants/rpc";
import { DashboardSolanaNetwork } from "utils/network";

// use env var to set IPFS gateway or fallback to ipfscdn.io
const IPFS_GATEWAY_URL =
  (process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL as string) ||
  "https://gateway.ipfscdn.io/ipfs";

export const StorageSingleton = new Web3sdksStorage({
  gatewayUrls: {
    "ipfs://": [IPFS_GATEWAY_URL],
  },
});

export function replaceIpfsUrl(url: string) {
  return StorageSingleton.resolveScheme(url);
}

// EVM SDK
const EVM_SDK_MAP = new Map<SUPPORTED_CHAIN_ID, EVMWeb3sdksSDK>();

export function getEVMWeb3sdksSDK(chainId: SUPPORTED_CHAIN_ID): EVMWeb3sdksSDK {
  if (process.env.NEXT_PUBLIC_SDK_POLYGON_CHAIN_ID && chainId === ChainId.Polygon) {
    chainId = parseInt(process.env.NEXT_PUBLIC_SDK_POLYGON_CHAIN_ID);
  }
  if (EVM_SDK_MAP.has(chainId)) {
    return EVM_SDK_MAP.get(chainId) as EVMWeb3sdksSDK;
  }
  const rpcUrl = getEVMRPC(chainId);
  const sdk = new EVMWeb3sdksSDK(
    rpcUrl,
    {
      readonlySettings: {
        rpcUrl,
        chainId,
      },
    },
    StorageSingleton,
  );
  EVM_SDK_MAP.set(chainId, sdk);
  return sdk;
}

// SOLANA SDK
const SOL_SDK_MAP = new Map<DashboardSolanaNetwork, SOLWeb3sdksSDK>();

export function getSOLWeb3sdksSDK(
  network: DashboardSolanaNetwork,
): SOLWeb3sdksSDK {
  if (SOL_SDK_MAP.has(network)) {
    return SOL_SDK_MAP.get(network) as SOLWeb3sdksSDK;
  }
  const rpcUrl = getSOLRPC(network);
  const sdk = SOLWeb3sdksSDK.fromNetwork(
    rpcUrl,
    new Web3sdksStorage({
      uploader: new IpfsUploader({ uploadWithGatewayUrl: true }),
    }),
  );
  SOL_SDK_MAP.set(network, sdk);
  return sdk;
}
