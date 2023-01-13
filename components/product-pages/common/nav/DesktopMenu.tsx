import { HoverMenu } from "./HoverMenu";
import { NavCardProps } from "./NavCard";
import { Flex, Icon, Stack } from "@chakra-ui/react";
import { SiDiscord } from "@react-icons/all-files/si/SiDiscord";
import { SiTwitter } from "@react-icons/all-files/si/SiTwitter";
import { SiYoutube } from "@react-icons/all-files/si/SiYoutube";
import { FiShoppingCart } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { LinkButton, TrackedIconButton, TrackedLink } from "tw-components";

export const DesktopMenu: React.FC = () => {
  return (
    <Flex gap={8}>
      <Stack
        display={["none", "none", "flex"]}
        direction="row"
        alignItems="center"
        color="gray.50"
        fontWeight="bold"
        spacing={10}
        as="nav"
      >
        <HoverMenu title="Products" items={PRODUCTS} columns={2} />
        <HoverMenu title="Resources" items={RESOURCES} />
      </Stack>

      <Flex
        display={{ base: "none", md: "flex" }}
        direction="row"
        align="center"
      >
        <TrackedIconButton
          as={LinkButton}
          isExternal
          noIcon
          href="https://twitter.com/web3sdksdev"
          color="gray.50"
          bg="transparent"
          aria-label="twitter"
          icon={<Icon boxSize="1rem" as={SiTwitter} />}
          category="topnav"
          label="twitter"
        />
        <TrackedIconButton
          as={LinkButton}
          isExternal
          noIcon
          href="https://discord.gg/KX2tsh9A"
          bg="transparent"
          color="gray.50"
          aria-label="discord"
          icon={<Icon boxSize="1rem" as={SiDiscord} />}
          category="topnav"
          label="discord"
        />
        <TrackedIconButton
          as={LinkButton}
          isExternal
          noIcon
          href="https://www.youtube.com/channel/UC7FwdKQ2H6uICx7HqwDGIjg"
          bg="transparent"
          color="gray.50"
          aria-label="YouTube"
          icon={<Icon boxSize="1rem" as={SiYoutube} />}
          category="topnav"
          label="youtube"
        />
      </Flex>
    </Flex>
  );
};

export const PRODUCTS: NavCardProps[] = [
  {
    name: "SDKs",
    label: "sdk",
    description: "Integrate web3 into your app",
    link: "/sdk",
    icon: require("public/assets/product-icons/sdks.png"),
  },
  {
    name: "Auth",
    label: "auth",
    description: "Decentralized login for your app",
    link: "/auth",
    icon: require("public/assets/product-icons/auth.png"),
  },
  {
    name: "Explore",
    label: "explore",
    description: "Ready-to-deploy contracts",
    link: "/smart-contracts",
    icon: require("public/assets/product-icons/contracts.png"),
  },
  {
    name: "Release",
    label: "release",
    description: "Publish your contracts on-chain",
    link: "/release",
    icon: require("public/assets/product-icons/release.png"),
  },
  {
    name: "ContractKit",
    label: "contractkit",
    description: "Building blocks for your contracts",
    link: "/contractkit",
    icon: require("public/assets/product-icons/extensions.png"),
  },
  {
    name: "Deploy",
    label: "deploy",
    description: "Seamless contract deployment",
    link: "/deploy",
    icon: require("public/assets/product-icons/deploy.png"),
  },
  {
    name: "Dashboards",
    label: "dashboards",
    description: "On-chain analytics and management",
    link: "/dashboards",
    icon: require("public/assets/product-icons/dashboards.png"),
  },
  {
    name: "Storage",
    label: "storage",
    description: "Fast, reliable, decentralized storage",
    link: "/storage",
    icon: require("public/assets/product-icons/storage.png"),
  },
  {
    name: "UI Components",
    label: "ui-components",
    description: "Plug-and-play frontend components",
    link: "/ui-components",
    icon: require("public/assets/product-icons/ui-components.png"),
  },
];

export const SOLUTIONS: NavCardProps[] = [
  {
    name: "CommerceKit",
    label: "commerce",
    description: "Integrate web3 into commerce apps",
    link: "/solutions/commerce",
    iconType: FiShoppingCart,
  },
  {
    name: "GamingKit",
    label: "gaming",
    description: "Integrate web3 into games",
    link: "/solutions/gaming",
    iconType: IoGameControllerOutline,
  },
];

export const RESOURCES: NavCardProps[] = [
  {
    name: "About",
    label: "about",
    description: "Learn more about our company",
    link: "/about",
    icon: require("public/assets/tw-icons/general.png"),
  },
  {
    name: "Docs",
    label: "docs",
    description: "Complete web3sdks documentation",
    link: "https://docs.web3sdks.com",
    icon: require("public/assets/tw-icons/pack.png"),
  },
];
