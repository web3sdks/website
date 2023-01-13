import {
  SUPPORTED_CHAIN_ID,
  getDefaultTrustedForwarders,
} from "@web3sdks/sdk";
import type { SolidityType } from "lib/solidity-types";

interface ReplacementProps {
  connectedWallet?: string;
  chainId?: SUPPORTED_CHAIN_ID;
}

export interface TemplateValue {
  value: string;
  helperText: string;
  replacerFunction: (
    searchValue: string,
    replacers: ReplacementProps,
  ) => string;
}

const ADDRESS_TEMPLATE_VALUES: TemplateValue[] = [
  {
    value: "{{connected_wallet}}",
    helperText: "replaced with the address of the connected wallet",
    replacerFunction: (searchValue, replacers) => {
      return searchValue.replaceAll(
        "{{connected_wallet}}",
        replacers.connectedWallet || "",
      );
    },
  },
];

const ADDRESS_ARRAY_TEMPLATE_VALUES: TemplateValue[] = [
  {
    value: "{{trusted_forwarders}}",
    helperText:
      "replaced with the addresses of the trusted (gasless) forwarders for the selected network",
    replacerFunction: (searchValue, replacers) => {
      const trustedForwardersForChain = replacers.chainId
        ? getDefaultTrustedForwarders(replacers.chainId)
        : [];
      return searchValue.replaceAll(
        "{{trusted_forwarders}}",
        JSON.stringify(trustedForwardersForChain),
      );
    },
  },
];

export function getTemplateValuesForType(type: SolidityType): TemplateValue[] {
  switch (type) {
    case "address":
      return ADDRESS_TEMPLATE_VALUES;
    case "address[]":
      return ADDRESS_ARRAY_TEMPLATE_VALUES;
    default:
      return [];
  }
}

export function replaceTemplateValues(
  value: string,
  type: SolidityType,
  replacers: ReplacementProps,
): string {
  const templateValues = getTemplateValuesForType(type);

  return templateValues.reduce((acc, templateValue) => {
    return templateValue.replacerFunction(acc, replacers);
  }, value);
}
