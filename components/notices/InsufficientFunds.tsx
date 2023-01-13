import { FAUCETS, useWeb3 } from "@3rdweb-sdk/react";
import { ButtonGroup, Container, Icon, Stack } from "@chakra-ui/react";
import { AiOutlineWarning } from "@react-icons/all-files/ai/AiOutlineWarning";
import {
  useAddress,
  useBalance,
  useChainId,
  useNetworkMismatch,
} from "@web3sdks/react";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card, Heading, LinkButton, Text } from "tw-components";

export const InsufficientFunds: React.FC = () => {
  const router = useRouter();
  const mismatchExists = useNetworkMismatch();
  const address = useAddress();
  const chainId = useChainId();
  const { getNetworkMetadata } = useWeb3();
  const balanceQuery = useBalance();
  const [dismissed, setDismissed] = useState(false);
  const [delayExpired, setDelayExpired] = useState(false);

  useEffect(() => {
    if (!chainId || !address) {
      setDelayExpired(false);
      return;
    }
    const t = setTimeout(() => {
      setDelayExpired(true);
    }, 1000);

    return () => {
      clearTimeout(t);
    };
  }, [chainId, address]);

  useEffect(() => {
    if (address) {
      setDismissed(false);
    }
  }, [chainId, address]);

  if (mismatchExists) {
    return null;
  }

  if (!delayExpired) {
    return null;
  }
  if (BigNumber.from(balanceQuery?.data?.value || 0)?.gt(0)) {
    return null;
  }

  if (dismissed) {
    return null;
  }

  // if we're on the dashboard overview page do not show the warning, as it is confusing
  if (
    router.pathname === "/[wallet]" ||
    router.pathname === "/contracts" ||
    router.pathname === "/explore" ||
    router.pathname === "/explore/[category]"
  ) {
    return null;
  }

  const { symbol, isTestnet } = getNetworkMetadata(chainId || 0);

  return (
    <Card zIndex="sticky" pb={6} position="fixed" m={4} bottom={0} right={0}>
      <Container as={Stack} spacing={4}>
        <Heading size="label.lg">
          <Stack direction="row" align="center">
            <Icon boxSize={6} as={AiOutlineWarning} />
            <span>Insufficient Funds</span>
          </Stack>
        </Heading>

        <Text>
          You don&apos;t have any funds on this network. You&apos;ll need some{" "}
          {symbol} to pay for gas.
          {isTestnet && " You can get some from the faucet below."}
        </Text>

        <ButtonGroup size="sm">
          {isTestnet && FAUCETS[chainId as keyof typeof FAUCETS] && (
            <LinkButton
              colorScheme="orange"
              href={FAUCETS[chainId as keyof typeof FAUCETS] || ""}
              isExternal
            >
              Get {symbol} from faucet
            </LinkButton>
          )}
          <Button
            variant="outline"
            colorScheme="orange"
            onClick={() => setDismissed(true)}
          >
            Dismiss warning
          </Button>
        </ButtonGroup>
      </Container>
    </Card>
  );
};
