import { Flex, SimpleGrid } from "@chakra-ui/react";
import { GuidesShowcase } from "components/product-pages/common/GuideShowcase";
import { Hero } from "components/product-pages/common/Hero";
import { ProductCard } from "components/product-pages/common/ProductCard";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { SolutionsTextImage } from "components/product-pages/common/SolutionsTextImage";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { LinkButton, Text, TrackedLink } from "tw-components";
import { Web3sdksNextPage } from "utils/types";

const RELEASE_GUIDES = [
  {
    title: "Introducing web3sdks Release",
    image:
      "https://blog.web3sdks.com/content/images/size/w2000/2022/09/Blog-thumbnail_tw-release.png",
    link: "https://blog.web3sdks.com/web3sdks-release/",
  },
  {
    title: "Register Your Contracts Using Release",
    image:
      "https://blog.web3sdks.com/content/images/size/w2000/2022/09/register-your-smart-contracts-using-web3sdks-release.png",
    link: "https://blog.web3sdks.com/guides/register-your-contract-using-web3sdks-release/",
  },
];

const Release: Web3sdksNextPage = () => {
  return (
    <ProductPage
      seo={{
        title: "Release",
        description:
          "Accelerate your protocol's growth. Publishing your contract is the best way to get your contracts in front of 60k+ web3 developers.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/product-pages/pre-builts/solution.png`,
              width: 1200,
              height: 630,
              alt: "web3sdks Explore",
            },
          ],
        },
      }}
    >
      <Hero
        trackingCategory="release"
        name="Release"
        title="Share your contracts with the world."
        description="Accelerate your protocol's growth. Publishing your contract is the best way to get your contracts in front of 60k+ web3 developers."
        buttonText="Get started"
        buttonLink="https://docs.web3sdks.com/release"
        image={require("public/assets/product-pages/release/hero.png")}
        gradient="linear-gradient(147.15deg, #410AB6 30.17%, #FBFF5C 100.01%)"
      >
        <Flex direction="column" gap={24}>
          <SimpleGrid
            justifyContent="flex-start"
            w="100%"
            columns={{ base: 1, md: 3 }}
            gap={{ base: 12, md: 6 }}
          >
            <ProductCard
              title="Save development time"
              icon={require("/public/assets/product-pages/release/hero-icon-1.png")}
            >
              Focus on protocol development and save time by not having to build
              middleware layer yourself.
            </ProductCard>
            <ProductCard
              title="Unlock powerful tooling"
              icon={require("/public/assets/product-pages/release/hero-icon-2.png")}
            >
              When your end users deploy your contracts from Explore, they
              unlock access to web3sdks tools that makes it easier to build on
              top of your contracts.
            </ProductCard>
            <ProductCard
              title="Shareable landing page"
              icon={require("/public/assets/product-pages/release/hero-icon-3.png")}
            >
              By creating a release, your contracts become shareable with an
              elegant landing page for your contract. E.g.{" "}
              <TrackedLink
                category="release-page"
                label="unlock-protocol"
                href="/unlock-protocol.eth/PublicLock"
                textDecoration="underline"
              >
                Unlock Protocol
              </TrackedLink>
              .
            </ProductCard>
          </SimpleGrid>

          <SolutionsTextImage
            image={require("/public/assets/product-pages/pre-builts/solution-cut.png")}
            title="Accelerate your protocol's growth."
          >
            <Text color="white" size="body.lg">
              Do you want to feature your contracts alongside world-class
              protocols & engineers? Get your contract in front of the 60k+ web3
              devs that visit this page every month. Get in touch!
            </Text>
            <Flex gap="12px" direction={{ base: "column", md: "row" }}>
              <LinkButton
                as={TrackedLink}
                {...{
                  category: "releases_get_deploys",
                  label: "contact_us",
                }}
                bg="white"
                color="black"
                href="https://form.typeform.com/to/FAwehBFl"
                isExternal
                noIcon
                _hover={{ bg: "rgba(255,255,255,.8)" }}
                boxShadow="0px 4px 4px rgba(0, 0, 0, 0.05)"
              >
                Contact us
              </LinkButton>
              <LinkButton
                as={TrackedLink}
                {...{
                  category: "releases_get_deploys",
                  label: "explore",
                }}
                href="/explore"
                color="#fff"
                bg="transparent"
                border="1px solid rgba(255, 255, 255, 0.15)"
                filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.05))"
                _hover={{ bg: "rgba(255,255,255,.1)" }}
              >
                Explore contracts
              </LinkButton>
            </Flex>
          </SolutionsTextImage>

          <GuidesShowcase
            title="Learn how to release contracts"
            description="Check out our guides on how to release contracts"
            solution="Release"
            guides={RELEASE_GUIDES}
          />
        </Flex>
      </Hero>
    </ProductPage>
  );
};

Release.pageId = PageId.ReleaseLanding;

export default Release;
