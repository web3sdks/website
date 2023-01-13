import type { RequiredParam } from "@web3sdks/react";
import type { DropContract } from "@web3sdks/react/evm";
import { detectFeatures } from "components/contract-components/utils";

export function hasMultiphaseClaimConditions(
  contract: RequiredParam<DropContract>,
): boolean {
  return detectFeatures(contract, [
    // erc721
    "ERC721ClaimPhasesV1",
    "ERC721ClaimPhasesV2",
    // erc1155
    "ERC1155ClaimPhasesV1",
    "ERC1155ClaimPhasesV2",
    // erc 20
    "ERC20ClaimPhasesV1",
    "ERC20ClaimPhasesV2",
  ]);
}

export function hasSinglePhaseClaimConditions(
  contract?: DropContract,
): boolean {
  return detectFeatures(contract, [
    // erc721
    "ERC721ClaimConditionsV1",
    "ERC721ClaimConditionsV2",
    // erc1155
    "ERC1155ClaimConditionsV1",
    "ERC1155ClaimConditionsV2",
    // erc20
    "ERC20ClaimConditionsV1",
    "ERC20ClaimConditionsV2",
  ]);
}

export function hasLegacyClaimConditions(contract?: DropContract): boolean {
  return detectFeatures(contract, [
    // erc721
    "ERC721ClaimConditionsV1",
    "ERC721ClaimPhasesV1",
    // erc1155
    "ERC1155ClaimConditionsV1",
    "ERC1155ClaimPhasesV1",
    // erc20
    "ERC20ClaimConditionsV1",
    "ERC20ClaimPhasesV1",
  ]);
}

export function hasNewClaimConditions(contract?: DropContract): boolean {
  return detectFeatures(contract, [
    // erc721
    "ERC721ClaimConditionsV2",
    "ERC721ClaimPhasesV2",
    // erc1155
    "ERC1155ClaimConditionsV2",
    "ERC1155ClaimPhasesV2",
    // erc20
    "ERC20ClaimConditionsV2",
    "ERC20ClaimPhasesV2",
  ]);
}
