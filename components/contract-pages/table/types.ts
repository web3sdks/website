import type {
  AuctionListing,
  DirectListing,
  Marketplace,
  ValidContractInstance,
} from "@web3sdks/sdk/evm";

type ListingMetadata = AuctionListing | DirectListing;

export type TTableType<TContract extends ValidContractInstance> =
  TContract extends Marketplace ? ListingMetadata : never;
