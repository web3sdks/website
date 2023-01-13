import { Flex } from "@chakra-ui/react";
import { useProgram } from "@web3sdks/react/solana";
import { NFTCollection, NFTDrop } from "@web3sdks/sdk/solana";
import { SettingsCreators } from "program-ui/settings/creators";
import { SettingsRoyalties } from "program-ui/settings/royalties";

export const ProgramSettingsTab: React.FC<{ address: string }> = ({
  address,
}) => {
  const { program } = useProgram(address);

  return (
    <Flex direction="column" height="100%">
      {program instanceof NFTDrop || program instanceof NFTCollection ? (
        <Flex gap={8} direction="column">
          <SettingsCreators program={program} />
          <SettingsRoyalties program={program} />
        </Flex>
      ) : null}
    </Flex>
  );
};
