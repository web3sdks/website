import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { Flex, Image, Skeleton } from "@chakra-ui/react";
import type { SUPPORTED_CHAIN_ID } from "@web3sdks/sdk/evm";
import { ContractBadge } from "components/badges/contract-badge";
import { NextSeo } from "next-seo";
import { StaticImageData } from "next/image";
import { useRouter } from "next/router";
import { ContractOG } from "og-lib/url-utils";
import { useMemo } from "react";
import { Heading, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

interface MetadataHeaderProps {
  isLoaded: boolean;
  address?: string;
  contractTypeImage?: StaticImageData;
  data?: {
    name?: string | number | null;
    description?: string | null;
    image?: string | null;
  };
}

const chainIdToHumanReadable: Record<
  Exclude<SUPPORTED_CHAIN_ID, 1337 | 31337>,
  string
> = {
  1: "Ethereum",
  5: "Goerli",
  137: "Polygon",
  80001: "Mumbai",
  250: "Fantom",
  4002: "Fantom Testnet",
  43114: "Avalanche",
  43113: "Avalanche Fuji",
  10: "Optimism",
  420: "Optimism Goerli",
  42161: "Arbitrum",
  421613: "Arbitrum Goerli",
  56: "Binance Smart Chain",
  97: "Binance Smart Chain Testnet",
};

function getChainIdToHumanReadable(chainId?: number) {
  return chainId && chainId in chainIdToHumanReadable
    ? chainIdToHumanReadable[chainId as keyof typeof chainIdToHumanReadable]
    : null;
}

export const MetadataHeader: React.FC<MetadataHeaderProps> = ({
  isLoaded,
  address,
  data,
}) => {
  const chainId = useDashboardEVMChainId();

  const router = useRouter();

  const displayName = useMemo(() => {
    const chainName = getChainIdToHumanReadable(chainId);
    const t = data?.name || "";
    if (t && chainName) {
      return `${t} | ${chainName}`;
    }
    return null;
  }, [data?.name, chainId]);

  const currentRoute = `https://web3sdks.com${router.asPath}`.replace(
    "deployer.web3sdks.eth",
    "web3sdks.eth",
  );

  const ogImage = useMemo(() => {
    if (!displayName || !address || !data) {
      return undefined;
    }

    return ContractOG.toUrl({
      displayName: displayName.split("|")[0].trim(),
      contractAddress: address,
      logo: data.image || "",
      description: data.description || "",
    });
  }, [address, data, displayName]);

  return (
    <>
      {isLoaded && displayName ? (
        <NextSeo
          title={displayName}
          canonical={currentRoute}
          openGraph={{
            title: displayName,
            images: ogImage
              ? [
                  {
                    url: ogImage.toString(),
                    alt: ``,
                    width: 1200,
                    height: 630,
                  },
                ]
              : undefined,
            url: currentRoute,
          }}
        />
      ) : null}
      <Flex align={{ base: "flex-start", md: "center" }} gap={4}>
        {data?.image || !isLoaded ? (
          <Skeleton
            isLoaded={isLoaded}
            flexShrink={0}
            borderRadius="lg"
            overflow="hidden"
            boxSize={{ base: 16, md: 32 }}
            position="relative"
          >
            {data?.image ? (
              <Image
                position="absolute"
                top={0}
                bottom={0}
                right={0}
                left={0}
                objectFit="contain"
                src={data.image}
                alt={data?.name?.toString() || ""}
              />
            ) : null}
          </Skeleton>
        ) : null}

        <Flex direction="column" gap={2} align="flex-start">
          <Skeleton isLoaded={isLoaded}>
            <Heading size="title.md">{data?.name ? data?.name : ""}</Heading>
          </Skeleton>
          <Skeleton isLoaded={isLoaded}>
            <Text
              maxW="2xl"
              title={data?.description || undefined}
              size="body.sm"
              noOfLines={3}
            >
              {isLoaded ? data?.description : ""}
            </Text>
          </Skeleton>

          <Flex gap={2} direction="row">
            <AddressCopyButton size="xs" address={address} />
            {address && <ContractBadge address={address} />}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
