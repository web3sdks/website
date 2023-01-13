import {
  AspectRatio,
  Box,
  Center,
  Container,
  Flex,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { ProductButton } from "components/product-pages/common/ProductButton";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { ProductSection } from "components/product-pages/common/ProductSection";
import { DashboardCard } from "components/product-pages/homepage/DashboardCard";
import { PageId } from "page-id";
import { Heading, LinkButton } from "tw-components";
import { Web3sdksNextPage } from "utils/types";

const SOLANA_GUIDES = [
  {
    title: "How to Create an NFT Drop on Solana",
    image:
      "https://blog.web3sdks.com/content/images/size/w2000/2022/10/This-is-the-one--12-.png",
    link: "https://blog.web3sdks.com/guides/how-to-create-an-nft-collection-on-solana-without-code/",
  },
  {
    title: "How to Create a Phantom Wallet and Get Devnet Tokens",
    image:
      "https://blog.web3sdks.com/content/images/size/w2000/2022/09/Getting-started-with-solana-web3sdks.png",
    link: "https://blog.web3sdks.com/guides/getting-started-with-solana/",
  },
  {
    title: "Why You Should Build on Solana: Pros and Cons",
    image:
      "https://blog.web3sdks.com/content/images/size/w2000/2022/09/This-is-the-one-5.png",
    link: "https://blog.web3sdks.com/guides/solana-development-pros-and-cons/",
  },
];

const Solana: Web3sdksNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Web3 Solana Smart Contracts, APIs, and Developer Tools",
        description:
          "Deploy Solana smart contracts, build web3 apps, and manage it all using our developer tools, SDKs, and more. Start building with web3sdks now.",
        openGraph: {
          images: [
            {
              url: "https://web3sdks.com/web3sdksxsolana.png",
              width: 1200,
              height: 630,
              alt: "web3sdks x solana",
            },
          ],
        },
      }}
    >
      <Center
        w="100%"
        as="section"
        flexDirection="column"
        bg="#030A1A"
        padding={{ base: 0, md: "64px" }}
      >
        <SimpleGrid
          as={Container}
          maxW="container.page"
          borderRadius={{ base: 0, md: 24 }}
          columns={{ base: 1, md: 9 }}
          padding={0}
          margin={{ base: "0px", md: "40px" }}
          mb={0}
          minHeight="578px"
        >
          <Flex
            gridColumnEnd={{ base: undefined, md: "span 6" }}
            padding={{ base: "24px", md: "48px" }}
            pt={{ base: "36px", md: undefined }}
            borderLeftRadius={{ base: 0, md: 24 }}
            flexDir="column"
            gap={{ base: 6, md: "32px" }}
            align={{ base: "initial", md: "start" }}
            justify={{ base: "start", md: "center" }}
          >
            <Heading
              pt={{ base: "100px", md: "0px" }}
              as="h1"
              size="title.2xl"
              textAlign={{ base: "center", md: "left" }}
            >
              Bringing engineering excellence to Solana
            </Heading>
            <Heading
              as="h3"
              size="subtitle.md"
              color="white"
              opacity={0.8}
              textAlign={{ base: "center", md: "left" }}
            >
              <strong>Building on Solana has never been easier.</strong> A
              simplified Solana development workflow. Intuitive dashboard and
              SDKs to deploy and interact with your programs.
            </Heading>
            <Stack
              spacing={5}
              direction={{ base: "column", lg: "row" }}
              align={"center"}
              mt="24px"
            >
              <ProductButton
                maxW="260px"
                title="Start building"
                href="/programs"
                color="blackAlpha.900"
                bg="white"
              />
              <LinkButton
                variant="outline"
                href="https://docs.web3sdks.com/solana"
                px={"64px"}
                py={"28px"}
                fontSize="20px"
                maxW="260px"
                fontWeight="bold"
                isExternal
              >
                Explore docs
              </LinkButton>
            </Stack>
          </Flex>

          <Center
            display={{ base: "none", md: "block" }}
            gridColumnEnd={{ base: undefined, md: "span 3" }}
          >
            <Flex justifyContent={{ base: "center", md: "flex-end" }} w="100%">
              <AspectRatio ratio={1} w="100%">
                <ChakraNextImage
                  alt=""
                  src={require("public/assets/network-pages/solana/hero.png")}
                  objectFit="contain"
                  priority
                />
              </AspectRatio>
            </Flex>
          </Center>
        </SimpleGrid>
      </Center>

      <ProductSection>
        <Flex
          flexDir="column"
          py={{ base: 24, lg: 36 }}
          align="center"
          gap={{ base: 12, lg: 24 }}
        >
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            <DashboardCard
              headingTitle="Build"
              title={"Powerful Solana SDKs"}
              subtitle="Create frontend and backend applications with Solana using our fully-featured SDKs."
              rightImage={require("public/assets/landingpage/web3sdks-teams.png")}
              gradientBGs={{
                topGradient: "#8752F3",
                bottomGradient: "#28E0B9",
                rightGradient: "#9945FF",
                leftGradient: "#19FB9B",
              }}
              href="https://docs.web3sdks.com/solana"
            />
            <DashboardCard
              headingTitle="Launch"
              title={"Easily Deploy Programs"}
              subtitle="Deploy NFT Collections, Drops, and Tokens in a single click or single line of code."
              rightImage={require("public/assets/landingpage/contracts.png")}
              gradientBGs={{
                rightGradient: "#8752F3",
                leftGradient: "#28E0B9",
                bottomGradient: "#9945FF",
                topGradient: "#19FB9B",
              }}
              href="https://docs.web3sdks.com/solana/creating-programs"
            />
            <DashboardCard
              headingTitle="Manage"
              title={"Intuitive Dashboard"}
              subtitle="Monitor, configure, and interact with your programs from an intuitive admin dashboard."
              rightImage={require("public/assets/landingpage/analytics.png")}
              gradientBGs={{
                bottomGradient: "#8752F3",
                topGradient: "#28E0B9",
                leftGradient: "#9945FF",
                rightGradient: "#19FB9B",
              }}
              href="/dashboard"
            />
          </SimpleGrid>
        </Flex>
      </ProductSection>

      <GuidesShowcase
        title="Learn how to build on Solana"
        description="Check out our comprehensive guides to get you started building on
        Solana with web3sdks."
        solution="Solana"
        guides={SOLANA_GUIDES}
      />

      <Box
        h="1px"
        bg="linear-gradient(93.96deg, rgba(25, 26, 27, 0.8) 17.14%, rgba(24, 67, 78, 0.8) 36.78%, rgba(108, 47, 115, 0.8) 61%, rgba(25, 26, 27, 0.8) 79.98%)"
        opacity="0.8"
      />
      <Box
        h="1px"
        bg="linear-gradient(93.96deg, rgba(25, 26, 27, 0.8) 17.14%, rgba(24, 67, 78, 0.8) 36.78%, rgba(108, 47, 115, 0.8) 61%, rgba(25, 26, 27, 0.8) 79.98%)"
        opacity="0.8"
      />
    </ProductPage>
  );
};

Solana.pageId = PageId.NetworkSolana;

export default Solana;
