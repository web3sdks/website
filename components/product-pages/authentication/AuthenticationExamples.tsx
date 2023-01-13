import { Flex, LinkBox, LinkOverlay, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { useTrack } from "hooks/analytics/useTrack";
import { StaticImageData } from "next/image";
import { Badge, Heading } from "tw-components";

const EXAMPLES = [
  {
    title: "Login With Wallet",
    label: "login-with-wallet",
    href: "https://docs.web3sdks.com/auth/quickstart",
    image: require("/public/assets/product-pages/authentication/login-with-wallet.png"),
  },
  {
    title: "Token-Gated Content",
    label: "token-gated-content",
    href: "https://github.com/web3sdks-template/nft-gated-website",
    image: require("/public/assets/product-pages/authentication/discord-authentication.png"),
  },
  {
    title: "OAuth Integration",
    label: "oauth-integration",
    href: "https://docs.web3sdks.com/auth/integrations/next-auth",
    image: require("/public/assets/product-pages/authentication/link-accounts.png"),
  },
  {
    title: "Subscribe with Wallet",
    label: "stripe-for-wallets",
    href: "https://github.com/web3sdks-template/web3sdks-stripe",
    image: require("/public/assets/product-pages/authentication/stripe-subscriptions.png"),
  },
];

interface ExampleItemProps {
  title: string;
  label: string;
  href: string;
  image: StaticImageData;
}

const ExampleItem: React.FC<ExampleItemProps> = ({
  title,
  label,
  href,
  image,
}) => {
  const trackEvent = useTrack();

  if (!href) {
    return (
      <Flex
        flexDir="column"
        position="relative"
        gap={4}
        flexGrow={0}
        mt={{ base: "36px", md: 0 }}
      >
        <ChakraNextImage alt={label} src={image} />
        <Badge
          alignSelf="center"
          borderRadius="md"
          position="absolute"
          top="-36px"
        >
          Coming Soon
        </Badge>
        <Heading textAlign="center" size="subtitle.md" maxW="100%">
          {title}
        </Heading>
      </Flex>
    );
  }

  return (
    <Flex as={LinkBox} role="group" flexDir="column" gap={4} flexGrow={0}>
      <ChakraNextImage
        alt={label}
        src={image}
        borderRadius="21px"
        _groupHover={{
          border: "1px solid #C5D8FF",
        }}
      />
      <LinkOverlay
        href={href}
        isExternal
        onClick={() => {
          trackEvent({
            category: "example",
            action: "click",
            label,
          });
        }}
      >
        <Heading textAlign="center" size="subtitle.md" maxW="100%">
          {title}
        </Heading>
      </LinkOverlay>
    </Flex>
  );
};

export const AuthenticationExamples: React.FC = () => {
  return (
    <SimpleGrid
      w="100%"
      columns={{ base: 2, md: 4 }}
      spacing={{ base: 6, md: 24 }}
    >
      {EXAMPLES.map((data, index) => (
        <ExampleItem key={index} {...data} />
      ))}
    </SimpleGrid>
  );
};
