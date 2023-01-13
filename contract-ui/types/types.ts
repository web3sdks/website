import { ValidContractInstance } from "@web3sdks/sdk/evm";

// We're using it everywhere.
export type PotentialContractInstance =
  | ValidContractInstance
  | null
  | undefined;
