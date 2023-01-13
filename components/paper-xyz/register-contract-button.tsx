import { usePaperRegisterContractMutation } from "./hooks";
import { ChainId, RequiredParam } from "@web3sdks/react";
import { Button, ButtonProps } from "tw-components";

export const PAPER_CHAIN_ID_MAP = {
  [ChainId.Mainnet]: "Ethereum",
  [ChainId.Goerli]: "Goerli",
  [ChainId.Polygon]: "Polygon",
  [ChainId.Mumbai]: "Mumbai",
  [ChainId.Avalanche]: "Avalanche",
} as const;

interface PaperRegisterContractButtonProps
  extends Omit<ButtonProps, "onClick"> {
  contractAddress: RequiredParam<string>;
  jwt: string;
}

export const PaperRegisterContractButton: React.FC<
  PaperRegisterContractButtonProps
> = ({ jwt, contractAddress, ...restButtonProps }) => {
  const mutation = usePaperRegisterContractMutation(
    jwt,
    contractAddress || undefined,
  );

  return (
    <Button
      {...restButtonProps}
      isLoading={mutation.isLoading}
      onClick={() => mutation.mutate()}
    >
      Register contract for paper checkout
    </Button>
  );
};
