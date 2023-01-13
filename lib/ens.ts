import { getEVMWeb3sdksSDK } from "./sdk";
import { ChainId } from "@web3sdks/sdk/evm";
import { utils } from "ethers";
import invariant from "tiny-invariant";

export interface ENSResolveResult {
  ensName: string | null;
  address: string | null;
}

export function isEnsName(name: string): boolean {
  return name.endsWith(".eth");
}

export async function resolveAddressToEnsName(
  address: string,
): Promise<ENSResolveResult> {
  invariant(utils.isAddress(address), "address must be a valid address");

  const provider = getEVMWeb3sdksSDK(
    process.env.ENS_CHAIN_ID
      ? parseInt(process.env.ENS_CHAIN_ID)
      : ChainId.Mainnet,
  ).getProvider();

  return {
    ensName: await provider.lookupAddress(address),
    address,
  };
}

export async function resolveEnsNameToAddress(
  ensName: string,
): Promise<ENSResolveResult> {
  invariant(isEnsName(ensName), "ensName must be a valid ens name");

  const provider = getEVMWeb3sdksSDK(
    process.env.ENS_CHAIN_ID
      ? parseInt(process.env.ENS_CHAIN_ID)
      : ChainId.Mainnet,
  ).getProvider();

  return {
    ensName,
    address: await provider.resolveName(ensName),
  };
}

export async function resolveEns(
  ensNameOrAddress: string,
): Promise<ENSResolveResult> {
  if (utils.isAddress(ensNameOrAddress)) {
    return resolveAddressToEnsName(ensNameOrAddress);
  }

  return resolveEnsNameToAddress(ensNameOrAddress);
}
