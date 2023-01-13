export interface FooterLinkInfo {
  label: string;
  name: string;
  link: string;
}

export const SOLUTIONS: FooterLinkInfo[] = [
  {
    name: "CommerceKit",
    label: "commerce",
    link: "/solutions/commerce",
  },
  {
    link: "/solutions/gaming",
    name: "GamingKit",
    label: "gaming",
  },
];

export const RESOURCES: FooterLinkInfo[] = [
  {
    label: "about",
    name: "About",
    link: "/about",
  },
  {
    link: "https://web3sdks.typeform.com/to/ZV3gUhiP",
    name: "Partner with us",
    label: "sales-form",
  },
  {
    name: "Docs",
    link: "https://docs.web3sdks.com",
    label: "portal",
  },
  {
    name: "Guides",
    label: "guides",
    link: "https://blog.web3sdks.com/guides",
  },
  {
    name: "Blog",
    label: "blog",
    link: "https://blog.web3sdks.com/",
  },
  {
    name: "Careers",
    label: "careers",
    link: "https://careers.web3sdks.com/",
  },
];

export const SDKs: FooterLinkInfo[] = [
  {
    label: "javascript",
    name: "JavaScript",
    link: "https://docs.web3sdks.com/typescript",
  },
  {
    label: "react",
    name: "React",
    link: "https://docs.web3sdks.com/react",
  },
  {
    label: "python",
    name: "Python",
    link: "https://docs.web3sdks.com/python",
  },
  {
    label: "contracts",
    name: "Contracts",
    link: "https://docs.web3sdks.com/contracts",
  },
];

export const NETWORKS: FooterLinkInfo[] = [
  {
    name: "Solana",
    label: "network-solana",
    link: "/network/solana",
  },
];

export const FAUCETS: FooterLinkInfo[] = [
  {
    name: "Solana",
    label: "faucet-solana",
    link: "/faucet/solana",
  },
];

export const LEGAL: FooterLinkInfo[] = [
  {
    name: "Privacy Policy",
    label: "privacy",
    link: "https://web3sdks.com/privacy",
  },
  {
    name: "Terms of Service",
    label: "terms",
    link: "https://web3sdks.com/tos",
  },
];
