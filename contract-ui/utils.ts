import { RequiredParam } from "@web3sdks/react";
import {
  ContractType,
  EditionDrop,
  NFTDrop,
  ValidContractInstance,
} from "@web3sdks/sdk/evm";

export function isPrebuiltContract(
  contract: ValidContractInstance | null | undefined,
  contractType: RequiredParam<ContractType> | null,
): contract is ValidContractInstance {
  if (!contract || !contractType) {
    return false;
  }
  if (contractType === "custom") {
    return false;
  }
  return true;
}

export function isPaperSupportedContract(
  contract: ValidContractInstance | null | undefined,
  contractType: RequiredParam<ContractType> | null,
): contract is EditionDrop | NFTDrop {
  return (
    isPrebuiltContract(contract, contractType) &&
    (contractType === "edition-drop" || contractType === "nft-drop")
  );
}
