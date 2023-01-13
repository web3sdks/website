import { useQuery } from "@tanstack/react-query";
import { useContractType } from "@web3sdks/react";
import { ContractType } from "@web3sdks/sdk/evm";
import { BuiltinContractMap } from "constants/mappings";

export function usePrebuiltSource(contractAddress: string | undefined) {
  const { data: contractType } = useContractType(contractAddress);
  const prebuilt = BuiltinContractMap[contractType as ContractType];
  return useQuery(["prebuilt-source", contractType], async () => {
    if (contractType === "custom") {
      return null;
    }

    const res = await fetch(prebuilt?.sourceUrl);
    const code = await res.text();
    const filename = prebuilt?.sourceUrl.split("/").pop();
    const source = { filename, source: code };

    return source;
  });
}
