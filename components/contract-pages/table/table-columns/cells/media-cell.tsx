import type { NFTMetadata } from "@web3sdks/sdk";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";

interface MediaCellProps {
  cell: {
    value: NFTMetadata;
  };
}

export const MediaCell: React.FC<MediaCellProps> = ({ cell }) => {
  const nftMetadata = cell.value;

  return (
    <NFTMediaWithEmptyState
      borderRadius="lg"
      pointerEvents="none"
      metadata={nftMetadata}
      requireInteraction
      flexShrink={0}
      boxSize={24}
      objectFit="contain"
    />
  );
};
