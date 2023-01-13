import type { NFT } from "@web3sdks/sdk";

export type WalletNFT = NFT & {
  contractAddress: string;
  tokenId: number;
};
