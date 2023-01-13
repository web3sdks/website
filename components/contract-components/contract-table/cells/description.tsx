import { useContractPrePublishMetadata, useEns } from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { Skeleton } from "@chakra-ui/react";
import { useAddress } from "@web3sdks/react";
import { BuiltinContractMap } from "constants/mappings";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { Text } from "tw-components";

export const ContractDescriptionCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const address = useAddress();
  const wallet = useSingleQueryParam("networkOrAddress");

  const ensQuery = useEns(wallet);

  const fullPublishMetadata = useContractPrePublishMetadata(
    value,
    ensQuery.data?.address || wallet || address,
  );

  const description =
    BuiltinContractMap[value as keyof typeof BuiltinContractMap]?.description;

  return (
    <Skeleton
      isLoaded={
        fullPublishMetadata.isSuccess ||
        !fullPublishMetadata.isFetching ||
        !!description
      }
    >
      <Text size="body.md" noOfLines={1}>
        {fullPublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata.description ||
          description ||
          (!fullPublishMetadata.isFetching ? "First Release" : "None")}
      </Text>
    </Skeleton>
  );
};
