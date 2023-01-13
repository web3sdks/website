import { ContractId } from "./types";
import { isContractIdBuiltInContract } from "./utils";
import { contractKeys, networkKeys } from "@3rdweb-sdk/react";
import { useMutationWithInvalidate } from "@3rdweb-sdk/react/hooks/query/useQueryWithNetwork";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  useAddress,
  useChainId,
  useSDK,
  useSDKChainId,
} from "@web3sdks/react";
import { FeatureWithEnabled } from "@web3sdks/sdk/dist/declarations/src/evm/constants/contract-features";
import {
  Abi,
  ChainId,
  ContractInfoSchema,
  ContractType,
  ExtraPublishMetadata,
  ProfileMetadata,
  PublishedContract,
  SUPPORTED_CHAIN_ID,
  Web3sdksSDK,
  detectFeatures,
  extractConstructorParamsFromAbi,
  extractEventsFromAbi,
  extractFunctionParamsFromAbi,
  extractFunctionsFromAbi,
  fetchPreDeployMetadata,
} from "@web3sdks/sdk/evm";
import { BuiltinContractMap } from "constants/mappings";
import { utils } from "ethers";
import { isEnsName } from "lib/ens";
import { StorageSingleton, getEVMWeb3sdksSDK } from "lib/sdk";
import { StaticImageData } from "next/image";
import { useMemo } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";

export interface ContractPublishMetadata {
  image: string | StaticImageData;
  name: string;
  description?: string;
  abi?: Abi;
  bytecode?: string;
  deployDisabled?: boolean;
  info?: z.infer<typeof ContractInfoSchema>;
  licenses?: string[];
  compilerMetadata?: Record<string, any>;
  analytics?: Record<string, any>;
}

function removeUndefinedFromObject(obj: Record<string, any>) {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

// metadata PRE release, only has the compiler output info (from CLI)
export async function fetchContractPublishMetadataFromURI(
  contractId: ContractId,
) {
  const contractIdIpfsHash = toContractIdIpfsHash(contractId);

  if (isContractIdBuiltInContract(contractId)) {
    const details = BuiltinContractMap[contractIdIpfsHash as ContractType];
    return {
      image: details.icon,
      name: details.title,
      deployDisabled: details.comingSoon,
      description: details.description,
    };
  }

  invariant(contractId !== "ipfs://undefined", "uri can't be undefined");
  let resolved;
  try {
    resolved = await fetchPreDeployMetadata(
      contractIdIpfsHash,
      StorageSingleton,
    );
  } catch (err) {
    console.error("failed to resolvePreDeployMetadata", err);
  }

  if (!resolved) {
    return {
      name: "",
      image: "custom",
    };
  }

  return {
    image: (resolved as any)?.image || "custom",
    name: resolved.name,
    description: resolved.info?.title || "",
    abi: resolved.abi,
    info: removeUndefinedFromObject(resolved.info),
    licenses: resolved.licenses,
    compilerMetadata: resolved.metadata,
    analytics: removeUndefinedFromObject(resolved.analytics),
  };
}

export function useContractPublishMetadataFromURI(contractId: ContractId) {
  return useQuery<ContractPublishMetadata>(
    ["publish-metadata", contractId],
    () => fetchContractPublishMetadataFromURI(contractId),
    {
      enabled: !!contractId,
    },
  );
}

// metadata PRE release, only contains the compiler output
// if passing an address, also fetches the latest version of the matching contract
export function useContractPrePublishMetadata(uri: string, address?: string) {
  const contractIdIpfsHash = toContractIdIpfsHash(uri);
  const sdk = getEVMWeb3sdksSDK(ChainId.Polygon);
  return useQuery(
    ["pre-publish-metadata", uri, address],
    async () => {
      invariant(
        !isContractIdBuiltInContract(uri),
        "Skipping publish metadata fetch for built-in contract",
      );
      invariant(address, "address is not defined");
      // TODO: Make this nicer.
      invariant(uri !== "ipfs://undefined", "uri can't be undefined");
      return await sdk
        ?.getPublisher()
        .fetchPrePublishMetadata(contractIdIpfsHash, address);
    },
    {
      enabled: !!uri && !!address,
    },
  );
}

async function fetchFullPublishMetadata(
  sdk: Web3sdksSDK,
  uri: string,
  queryClient: QueryClient,
) {
  const rawPublishMetadata = await sdk
    .getPublisher()
    .fetchFullPublishMetadata(uri);

  const ensResult = rawPublishMetadata.publisher
    ? await queryClient.fetchQuery(ensQuery(rawPublishMetadata.publisher))
    : undefined;

  return {
    ...rawPublishMetadata,
    publisher:
      ensResult?.ensName || ensResult?.address || rawPublishMetadata.publisher,
  };
}

// Metadata POST release, contains all the extra information filled in by the user
export function useContractFullPublishMetadata(uri: string) {
  const contractIdIpfsHash = toContractIdIpfsHash(uri);
  const sdk = getEVMWeb3sdksSDK(ChainId.Polygon);
  const queryClient = useQueryClient();

  return useQuery(
    ["full-publish-metadata", uri],
    async () => {
      invariant(
        !isContractIdBuiltInContract(uri),
        "Skipping publish metadata fetch for built-in contract",
      );

      invariant(sdk, "sdk is not defined");
      // TODO: Make this nicer.
      invariant(uri !== "ipfs://undefined", "uri can't be undefined");
      return await fetchFullPublishMetadata(
        sdk,
        contractIdIpfsHash,
        queryClient,
      );
    },
    {
      enabled: !!uri && !!sdk,
    },
  );
}

async function fetchReleaserProfile(publisherAddress?: string | null) {
  const sdk = getEVMWeb3sdksSDK(ChainId.Polygon);
  invariant(publisherAddress, "address is not defined");
  return await sdk.getPublisher().getPublisherProfile(publisherAddress);
}

export function releaserProfileQuery(releaserAddress?: string) {
  return {
    queryKey: ["releaser-profile", releaserAddress],
    queryFn: () => fetchReleaserProfile(releaserAddress),
    enabled: !!releaserAddress,
    // 24h
    cacheTime: 60 * 60 * 24 * 1000,
    // 1h
    staleTime: 60 * 60 * 1000,
    // default to the one we know already
  };
}

export function useReleaserProfile(publisherAddress?: string) {
  return useQuery(releaserProfileQuery(publisherAddress));
}

export function useLatestRelease(
  publisherAddress?: string,
  contractName?: string,
) {
  const sdk = getEVMWeb3sdksSDK(ChainId.Polygon);
  return useQuery(
    ["latest-release", publisherAddress, contractName],
    async () => {
      invariant(publisherAddress, "address is not defined");
      invariant(contractName, "contract name is not defined");
      invariant(sdk, "sdk not provided");

      const latestRelease = await sdk
        .getPublisher()
        .getLatest(publisherAddress, contractName);

      invariant(latestRelease, "latest release is not defined");

      const contractInfo = await sdk
        .getPublisher()
        .fetchPublishedContractInfo(latestRelease);

      return {
        ...latestRelease,
        version: contractInfo.publishedMetadata.version,
        name: contractInfo.publishedMetadata.name,
        displayName: contractInfo.publishedMetadata.displayName || "",
        description: contractInfo.publishedMetadata.description || "",
        releaser: contractInfo.publishedMetadata.publisher || "",
        audit: contractInfo.publishedMetadata.audit || "",
        logo: contractInfo.publishedMetadata.logo || "",
      };
    },
    {
      enabled: !!publisherAddress && !!contractName,
    },
  );
}

export async function fetchAllVersions(
  sdk?: Web3sdksSDK,
  publisherAddress?: string,
  contractName?: string,
) {
  invariant(publisherAddress, "address is not defined");
  invariant(contractName, "contract name is not defined");
  invariant(sdk, "sdk not provided");
  const allVersions = await sdk
    .getPublisher()
    .getAllVersions(publisherAddress, contractName);

  const releasedVersions = [];

  for (let i = 0; i < allVersions.length; i++) {
    const contractInfo = await sdk
      .getPublisher()
      .fetchPublishedContractInfo(allVersions[i]);

    releasedVersions.unshift({
      ...allVersions[i],
      version: contractInfo.publishedMetadata.version,
      name: contractInfo.publishedMetadata.name,
      displayName: contractInfo.publishedMetadata.displayName || "",
      description: contractInfo.publishedMetadata.description || "",
      releaser: contractInfo.publishedMetadata.publisher || "",
      audit: contractInfo.publishedMetadata.audit || "",
      logo: contractInfo.publishedMetadata.logo || "",
    });
  }

  return releasedVersions;
}

export function useAllVersions(
  publisherAddress?: string,
  contractName?: string,
) {
  const sdk = getEVMWeb3sdksSDK(ChainId.Polygon);
  return useQuery(
    ["all-releases", publisherAddress, contractName],
    () => fetchAllVersions(sdk, publisherAddress, contractName),
    {
      enabled: !!publisherAddress && !!contractName && !!sdk,
    },
  );
}

export function useReleasesFromDeploy(
  contractAddress?: string,
  chainId?: SUPPORTED_CHAIN_ID,
) {
  const activeChainId = useSDKChainId();
  const cId = chainId || activeChainId;
  return useQuery(
    (networkKeys.chain(cId) as readonly unknown[]).concat([
      "release-from-deploy",
      contractAddress,
    ]),
    async () => {
      invariant(contractAddress, "contractAddress is not defined");
      invariant(cId, "chain not defined");
      const sdk = getEVMWeb3sdksSDK(cId);

      const contractUri = await sdk
        .getPublisher()
        .resolveContractUriFromAddress(contractAddress);

      const polygonSdk = getEVMWeb3sdksSDK(ChainId.Polygon);

      return await polygonSdk
        .getPublisher()
        .resolvePublishMetadataFromCompilerMetadata(contractUri);
    },
    {
      enabled: !!contractAddress && !!cId,
    },
  );
}

export async function fetchReleasedContractInfo(
  sdk?: Web3sdksSDK,
  contract?: PublishedContract,
) {
  invariant(contract, "contract is not defined");
  invariant(sdk, "sdk not provided");
  return await sdk.getPublisher().fetchPublishedContractInfo(contract);
}

export function useReleasedContractInfo(contract: PublishedContract) {
  const sdk = getEVMWeb3sdksSDK(ChainId.Polygon);
  return useQuery(
    ["released-contract", contract],
    () => fetchReleasedContractInfo(sdk, contract),
    {
      enabled: !!contract,
    },
  );
}
export function useReleasedContractFunctions(contract: PublishedContract) {
  const { data: meta } = useContractPublishMetadataFromURI(
    contract.metadataUri,
  );
  return meta
    ? extractFunctionsFromAbi(meta.abi as Abi, meta?.compilerMetadata)
    : undefined;
}
export function useReleasedContractEvents(contract: PublishedContract) {
  const { data: meta } = useContractPublishMetadataFromURI(
    contract.metadataUri,
  );
  return meta
    ? extractEventsFromAbi(meta.abi as Abi, meta?.compilerMetadata)
    : undefined;
}

export function useReleasedContractCompilerMetadata(
  contract: PublishedContract,
) {
  return useContractPublishMetadataFromURI(contract.metadataUri);
}

export function useConstructorParamsFromABI(abi?: Abi) {
  return useMemo(() => {
    return abi ? extractConstructorParamsFromAbi(abi) : [];
  }, [abi]);
}

export function useFunctionParamsFromABI(abi?: any, functionName?: string) {
  return useMemo(() => {
    return abi && functionName
      ? extractFunctionParamsFromAbi(abi, functionName)
      : [];
  }, [abi, functionName]);
}

export function toContractIdIpfsHash(contractId: ContractId) {
  if (
    isContractIdBuiltInContract(contractId) ||
    contractId?.startsWith("ipfs://")
  ) {
    return contractId;
  }
  return `ipfs://${contractId}`;
}

interface PublishMutationData {
  predeployUri: string;
  extraMetadata: ExtraPublishMetadata;
  contractName?: string;
}

export function usePublishMutation() {
  // this has to actually have the signer!
  const sdk = useSDK();

  const address = useAddress();

  return useMutationWithInvalidate(
    async ({ predeployUri, extraMetadata }: PublishMutationData) => {
      invariant(
        sdk && "getPublisher" in sdk,
        "sdk is not ready or does not support publishing",
      );
      const contractIdIpfsHash = toContractIdIpfsHash(predeployUri);
      await sdk.getPublisher().publish(contractIdIpfsHash, extraMetadata);
    },
    {
      onSuccess: (_data, variables, _options, invalidate) => {
        return Promise.all([
          invalidate([["pre-publish-metadata", variables.predeployUri]]),
          fetch(
            `/api/revalidate/release?address=${address}&contractName=${variables.contractName}`,
          ).catch((err) => console.error("failed to revalidate", err)),
        ]);
      },
    },
  );
}

export function useEditProfileMutation() {
  const sdk = useSDK();
  const address = useAddress();

  return useMutationWithInvalidate(
    async (data: ProfileMetadata) => {
      invariant(sdk, "sdk not provided");
      await sdk.getPublisher().updatePublisherProfile(data);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return Promise.all([
          invalidate([["releaser-profile", address]]),
          fetch(`/api/revalidate/release?address=${address}`).catch((err) =>
            console.error("failed to revalidate", err),
          ),
        ]);
      },
    },
  );
}

interface ContractDeployMutationParams {
  constructorParams: unknown[];
  addToDashboard?: boolean;
}

export function useCustomContractDeployMutation(
  ipfsHash: string,
  forceDirectDeploy?: boolean,
) {
  const sdk = useSDK();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  const chainId = useChainId();

  return useMutation(
    async (data: ContractDeployMutationParams) => {
      invariant(
        sdk && "getPublisher" in sdk,
        "sdk is not ready or does not support publishing",
      );
      const contractAddress = await sdk.deployer.deployContractFromUri(
        ipfsHash.startsWith("ipfs://") ? ipfsHash : `ipfs://${ipfsHash}`,
        data.constructorParams,
        {
          forceDirectDeploy,
        },
      );
      if (data.addToDashboard) {
        const registry = await sdk?.deployer.getRegistry();
        await registry?.addContract(contractAddress);
      }
      return contractAddress;
    },
    {
      onSuccess: async () => {
        return await queryClient.invalidateQueries([
          ...networkKeys.chain(chainId),
          ...contractKeys.list(walletAddress),
        ]);
      },
    },
  );
}

export async function fetchPublishedContracts(
  sdk: Web3sdksSDK,
  queryClient: QueryClient,
  address?: string | null,
) {
  invariant(sdk, "sdk not provided");
  invariant(address, "address is not defined");
  const tempResult = ((await sdk.getPublisher().getAll(address)) || []).filter(
    (c) => c.id,
  );
  return await Promise.all(
    tempResult.map(async (c) => ({
      ...c,
      metadata: await fetchFullPublishMetadata(sdk, c.metadataUri, queryClient),
    })),
  );
}

export type ReleasedContractDetails = Awaited<
  ReturnType<typeof fetchPublishedContracts>
>[number];

export function usePublishedContractsQuery(address?: string) {
  const sdk = getEVMWeb3sdksSDK(ChainId.Polygon);
  const queryClient = useQueryClient();
  return useQuery<ReleasedContractDetails[]>(
    ["published-contracts", address],
    () => {
      invariant(sdk, "sdk not provided");
      return fetchPublishedContracts(sdk, queryClient, address);
    },
    {
      enabled: !!address && !!sdk,
    },
  );
}

const ALWAYS_SUGGESTED = ["ContractMetadata", "Permissions"];

export function extractExtensions(
  input: ReturnType<typeof detectFeatures>,
  enabledExtensions: FeatureWithEnabled[] = [],
  suggestedExtensions: FeatureWithEnabled[] = [],
  parent = "__ROOT__",
) {
  if (!input) {
    return {
      enabledExtensions,
      suggestedExtensions,
    };
  }
  for (const extensionKey in input) {
    const extension = input[extensionKey];
    // if extension is enabled, then add it to enabledFeatures
    if (extension.enabled) {
      enabledExtensions.push(extension);
    }
    // otherwise if it is disabled, but it's parent is enabled or suggested, then add it to suggestedFeatures
    else if (
      enabledExtensions.findIndex((f) => f.name === parent) > -1 ||
      ALWAYS_SUGGESTED.includes(extension.name)
    ) {
      suggestedExtensions.push(extension);
    }
    // recurse
    extractExtensions(
      extension.features,
      enabledExtensions,
      suggestedExtensions,
      extension.name,
    );
  }

  return {
    enabledExtensions,
    suggestedExtensions,
  };
}

export function useContractDetectedExtensions(abi?: any) {
  const features = useMemo(() => {
    if (abi) {
      return extractExtensions(detectFeatures(abi));
    }
    return undefined;
  }, [abi]);
  return features;
}

export function useContractEnabledExtensions(abi?: any) {
  const extensions = useContractDetectedExtensions(abi);
  return extensions ? extensions.enabledExtensions : [];
}

export function ensQuery(addressOrEnsName?: string) {
  // if the address is `web3sdks.eth` we actually want `deployer.web3sdks.eth` here...
  if (addressOrEnsName === "web3sdks.eth") {
    addressOrEnsName = "deployer.web3sdks.eth";
  }
  const placeholderData = {
    address: utils.isAddress(addressOrEnsName || "")
      ? addressOrEnsName || null
      : null,
    ensName: isEnsName(addressOrEnsName || "")
      ? addressOrEnsName || null
      : null,
  };
  return {
    queryKey: ["ens", addressOrEnsName],
    queryFn: async () => {
      if (!addressOrEnsName) {
        return placeholderData;
      }
      // if it is neither an address or an esn name then return the placeholder data only
      if (!utils.isAddress(addressOrEnsName) && !isEnsName(addressOrEnsName)) {
        return placeholderData;
      }
      const ethProvider = getEVMWeb3sdksSDK(process.env.ENS_CHAIN_ID ? parseInt(process.env.ENS_CHAIN_ID) : ChainId.Mainnet).getProvider();
      const ensName = isEnsName(addressOrEnsName)
        ? addressOrEnsName
        : await ethProvider.lookupAddress(addressOrEnsName);
      const address = utils.isAddress(addressOrEnsName)
        ? addressOrEnsName
        : await ethProvider.resolveName(addressOrEnsName);

      return {
        address,
        ensName,
      };
    },
    enabled:
      !!addressOrEnsName &&
      (utils.isAddress(addressOrEnsName) || isEnsName(addressOrEnsName)),
    // 24h
    cacheTime: 60 * 60 * 24 * 1000,
    // 1h
    staleTime: 60 * 60 * 1000,
    // default to the one we know already
    placeholderData,
  } as const;
}

export function useEns(addressOrEnsName?: string) {
  return useQuery(ensQuery(addressOrEnsName));
}

export function useContractFunctions(abi: Abi) {
  return abi ? extractFunctionsFromAbi(abi) : undefined;
}
