import { SourceFile } from "../types";
import { SourcesAccordion } from "./sources-accordion";
import { Flex } from "@chakra-ui/react";
import { Abi } from "@web3sdks/sdk";
import { Link, Text } from "tw-components";

interface SourcesPanelProps {
  sources?: SourceFile[];
  abi?: Abi;
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources, abi }) => {
  return (
    <Flex flexDir="column" gap={8}>
      <Flex flexDir="column" gap={4}>
        {sources && sources?.length > 0 ? (
          <SourcesAccordion sources={sources} abi={abi} />
        ) : (
          <Text>
            Contract source code not available. Try deploying with{" "}
            <Link
              href="https://docs.web3sdks.com/deploy"
              isExternal
              color="primary.500"
            >
              web3sdks CLI v0.5+
            </Link>
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
