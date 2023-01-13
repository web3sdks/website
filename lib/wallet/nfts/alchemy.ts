import { handleArbitraryTokenURI, shouldDownloadURI } from "./tokenUri";
import { WalletNFT } from "./types";
import type { NFTMetadata } from "@web3sdks/sdk";
import { ChainId } from "@web3sdks/sdk/evm";
import { StorageSingleton } from "lib/sdk";

const alchemyUrlMap = {
  // eth
  [ChainId.Mainnet]: `https://eth-mainnet.g.alchemy.com`,
  [ChainId.Goerli]: `https://eth-goerli.g.alchemy.com`,
  // polygon
  [ChainId.Polygon]: `https://polygon-mainnet.g.alchemy.com`,
  [ChainId.Mumbai]: `https://polygon-mumbai.g.alchemy.com`,

  // optimism
  [ChainId.Optimism]: `https://opt-mainnet.g.alchemy.com`,
  // new optimism testnet
  [ChainId.OptimismGoerli]: `https://opt-goerli.g.alchemy.com`,

  [ChainId.Arbitrum]: `https://arb-mainnet.g.alchemy.com`,
  // arbitrum testnet
  [ChainId.ArbitrumGoerli]: `https://arb-goerli.g.alchemy.com`,
} as const;

type AlchemySupportedChainId = keyof typeof alchemyUrlMap;

export function isAlchemySupported(
  chainId: number,
): chainId is AlchemySupportedChainId {
  return chainId in alchemyUrlMap;
}

export function generateAlchemyUrl(
  chainId: AlchemySupportedChainId,
  owner: string,
) {
  const url = new URL(
    `${alchemyUrlMap[chainId]}/nft/v2/${process.env.SSR_ALCHEMY_KEY}/getNFTs`,
  );
  url.searchParams.set("owner", owner);
  return url.toString();
}

export async function transformAlchemyResponseToNFT(
  alchemyResponse: AlchemyResponse,
  owner: string,
): Promise<WalletNFT[]> {
  return (
    await Promise.all(
      alchemyResponse.ownedNfts.map(async (alchemyNFT) => {
        const rawUri = alchemyNFT.tokenUri.raw;

        try {
          return {
            contractAddress: alchemyNFT.contract.address,
            tokenId: parseInt(alchemyNFT.id.tokenId, 16),
            metadata: shouldDownloadURI(rawUri)
              ? await StorageSingleton.downloadJSON(
                  handleArbitraryTokenURI(rawUri),
                )
              : rawUri,
            owner,
            supply: parseInt(alchemyNFT.balance || "1"),
            type: alchemyNFT.id.tokenMetadata.tokenType,
          } as WalletNFT;
        } catch (e) {
          return undefined as unknown as WalletNFT;
        }
      }),
    )
  ).filter(Boolean);
}

type AlchemyResponse = {
  ownedNfts: Array<{
    contract: {
      address: string;
    };
    id: {
      tokenId: string;
      tokenMetadata: {
        tokenType: "ERC721" | "ERC1155";
      };
    };
    balance: string;
    title: string;
    description: string;
    tokenUri: {
      raw: string;
      gateway: string;
    };
    media: Array<{
      raw: string;
      gateway: string;
    }>;
    metadata: NFTMetadata;
    timeLastUpdated: string;
    contractMetadata: {
      name: string;
      symbol: string;
      totalSupply: string;
      tokenType: "ERC721" | "ERC1155";
    };
  }>;
  pageKey: string;
  totalCount: number;
  blockHash: string;
};
