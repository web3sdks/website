import { VscQuestion } from "@react-icons/all-files/vsc/VscQuestion";
import Arbitrum from "@web3sdks/chain-icons/dist/arbitrum";
import Avalanche from "@web3sdks/chain-icons/dist/avalanche";
import BinanceCoin from "@web3sdks/chain-icons/dist/binance-coin";
import Ethereum from "@web3sdks/chain-icons/dist/ethereum";
import Fantom from "@web3sdks/chain-icons/dist/fantom";
import Optimism from "@web3sdks/chain-icons/dist/optimism";
import Polygon from "@web3sdks/chain-icons/dist/polygon";
import { ChainId, useNetwork } from "@web3sdks/react";
import { NATIVE_TOKENS, SUPPORTED_CHAIN_ID } from "@web3sdks/sdk/evm";
import { useCallback } from "react";

interface NetworkMetadata {
  chainName: string;
  icon: React.ComponentType;
  symbol: string;
  isTestnet: boolean;
  chainId: ChainId;
}

export const FAUCETS: Partial<Record<ChainId, string>> = {
  [ChainId.Goerli]: "https://faucet.paradigm.xyz/",
  [ChainId.Mumbai]: "https://mumbaifaucet.com",
  [ChainId.AvalancheFujiTestnet]: "https://faucet.avax.network/",
  [ChainId.FantomTestnet]: "https://faucet.fantom.network/",

  [ChainId.BinanceSmartChainTestnet]:
    "https://testnet.binance.org/faucet-smart",
  [ChainId.OptimismGoerli]: "https://app.optimism.io/bridge/deposit",
  [ChainId.ArbitrumGoerli]: "https://bridge.arbitrum.io/?l2ChainId=421613",
};

const defaultNetworkMetadata: Record<SUPPORTED_CHAIN_ID, NetworkMetadata> = {
  [ChainId.Mainnet]: {
    chainName: "Ethereum",
    icon: Ethereum,
    symbol: NATIVE_TOKENS[ChainId.Mainnet].symbol,
    isTestnet: false,
    chainId: ChainId.Mainnet,
  },

  [ChainId.Goerli]: {
    chainName: "Goerli",
    icon: Ethereum,
    symbol: NATIVE_TOKENS[ChainId.Goerli].symbol,
    isTestnet: true,
    chainId: ChainId.Goerli,
  },
  [ChainId.Polygon]: {
    chainName: "Polygon",
    icon: Polygon,
    symbol: NATIVE_TOKENS[ChainId.Polygon].symbol,
    isTestnet: false,
    chainId: ChainId.Polygon,
  },
  [ChainId.Mumbai]: {
    chainName: "Mumbai",
    icon: Polygon,
    symbol: NATIVE_TOKENS[ChainId.Mumbai].symbol,
    isTestnet: true,
    chainId: ChainId.Mumbai,
  },
  [ChainId.Fantom]: {
    chainName: "Fantom",
    icon: Fantom,
    symbol: NATIVE_TOKENS[ChainId.Fantom].symbol,
    isTestnet: false,
    chainId: ChainId.Fantom,
  },
  [ChainId.FantomTestnet]: {
    chainName: "Fantom Testnet",
    icon: Fantom,
    symbol: NATIVE_TOKENS[ChainId.FantomTestnet].symbol,
    isTestnet: true,
    chainId: ChainId.Fantom,
  },
  [ChainId.Avalanche]: {
    chainName: "Avalanche",
    icon: Avalanche,
    symbol: NATIVE_TOKENS[ChainId.Avalanche].symbol,
    isTestnet: false,
    chainId: ChainId.Avalanche,
  },
  [ChainId.AvalancheFujiTestnet]: {
    chainName: "Avalanche Fuji Testnet",
    icon: Avalanche,
    symbol: NATIVE_TOKENS[ChainId.AvalancheFujiTestnet].symbol,
    isTestnet: true,
    chainId: ChainId.AvalancheFujiTestnet,
  },
  [ChainId.Optimism]: {
    chainName: "Optimism",
    icon: Optimism,
    symbol: NATIVE_TOKENS[ChainId.Optimism].symbol,
    isTestnet: false,
    chainId: ChainId.Optimism,
  },

  [ChainId.OptimismGoerli]: {
    chainName: "Optimism Goerli",
    icon: Optimism,
    symbol: NATIVE_TOKENS[ChainId.OptimismGoerli].symbol,
    isTestnet: true,
    chainId: ChainId.OptimismGoerli,
  },
  [ChainId.Arbitrum]: {
    chainName: "Arbitrum",
    icon: Arbitrum,
    symbol: NATIVE_TOKENS[ChainId.Arbitrum].symbol,
    isTestnet: false,
    chainId: ChainId.Arbitrum,
  },

  [ChainId.ArbitrumGoerli]: {
    chainName: "Arbitrum Goerli",
    icon: Arbitrum,
    symbol: NATIVE_TOKENS[ChainId.ArbitrumGoerli].symbol,
    isTestnet: true,
    chainId: ChainId.ArbitrumGoerli,
  },
  [ChainId.BinanceSmartChainMainnet]: {
    chainName: "Binance Smart Chain",
    icon: BinanceCoin,
    symbol: NATIVE_TOKENS[ChainId.BinanceSmartChainMainnet].symbol,
    isTestnet: false,
    chainId: ChainId.BinanceSmartChainMainnet,
  },
  [ChainId.BinanceSmartChainTestnet]: {
    chainName: "Binance Smart Chain Testnet",
    icon: BinanceCoin,
    symbol: NATIVE_TOKENS[ChainId.BinanceSmartChainTestnet].symbol,
    isTestnet: true,
    chainId: ChainId.BinanceSmartChainTestnet,
  },
};

export function useWeb3() {
  const [network] = useNetwork();

  const getNetworkMetadata = useCallback(
    (chainId: SUPPORTED_CHAIN_ID) => {
      const cData: NetworkMetadata = {
        chainName: "Unsupported Chain",
        icon: VscQuestion,
        isTestnet: false,
        symbol: "",
        chainId,
      };
      const c = network.data.chains.find((chain) => chain.id === chainId);

      if (chainId in defaultNetworkMetadata) {
        cData.chainName = defaultNetworkMetadata[chainId].chainName;
        cData.isTestnet = defaultNetworkMetadata[chainId].isTestnet;
        cData.symbol = defaultNetworkMetadata[chainId].symbol;
        cData.icon = defaultNetworkMetadata[chainId].icon;
      } else if (c) {
        cData.chainName = c.name;
        cData.isTestnet = !!c.testnet;
        cData.symbol = c.nativeCurrency?.symbol || "";
      }
      return cData;
    },
    [network],
  );

  return {
    getNetworkMetadata,
  };
}
