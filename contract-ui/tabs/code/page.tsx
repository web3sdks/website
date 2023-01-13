import { CodeOverview } from "./components/code-overview";
import { Flex } from "@chakra-ui/react";
import { useContract, useContractType } from "@web3sdks/react";
import { Abi } from "@web3sdks/sdk";
import { ContractCode } from "components/contract-tabs/code/ContractCode";

interface ContractCodePageProps {
  contractAddress?: string;
}

export const ContractCodePage: React.FC<ContractCodePageProps> = ({
  contractAddress,
}) => {
  const contractQuery = useContract(contractAddress);
  const { data: contractType, isLoading } = useContractType(contractAddress);

  const useCustomCodeTab =
    contractType === "custom" ||
    contractType === "multiwrap" ||
    contractType === "pack";

  if (contractQuery.isLoading || isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={6}>
      {contractQuery?.contract && useCustomCodeTab ? (
        <CodeOverview
          abi={contractQuery.contract?.abi as Abi}
          contractAddress={contractQuery.contract?.getAddress()}
        />
      ) : (
        contractType && (
          <ContractCode
            contractAddress={contractQuery.contract?.getAddress()}
            contractType={contractType}
            ecosystem="evm"
          />
        )
      )}
    </Flex>
  );
};
