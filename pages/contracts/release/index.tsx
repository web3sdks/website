import { Flex, Link } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { DeployableContractTable } from "components/contract-components/contract-table";
// import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { useMemo } from "react";
import { Heading, Text } from "tw-components";
import { Web3sdksNextPage } from "utils/types";

const ContractsReleasePage: Web3sdksNextPage = () => {
  const router = useRouter();

  const ipfsHashes = useMemo(() => {
    const ipfs = router.query.ipfs;
    return Array.isArray(ipfs) ? ipfs : [ipfs || ""];
  }, [router.query]);

  return (
    <Flex gap={8} direction="column">
      <Flex gap={2} direction="column">
        <Heading size="title.md">Release Contracts</Heading>
        <Text fontStyle="italic" maxW="container.md">
          Welcome to the new web3sdks contract deployment flow.
          <br />
          <Link
            color="blue.500"
            isExternal
            href="https://docs.web3sdks.com/release"
          >
            Learn more about releasing your contracts.
          </Link>
        </Text>
      </Flex>

      <DeployableContractTable
        contractIds={ipfsHashes}
        context="create_release"
      />
    </Flex>
  );
};

// const AppLayout = dynamic(
//   async () => (await import("components/app-layouts/app")).AppLayout,
// );

ContractsReleasePage.getLayout = function getLayout(page, props) {
  return <AppLayout {...props}>{page}</AppLayout>;
};

ContractsReleasePage.pageId = PageId.ReleaseMultiple;

export default ContractsReleasePage;