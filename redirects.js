/** @type {import('next').NextConfig['redirects']} */
function redirects() {
  return [
    {
      source: "/portal/:match*",
      destination: "https://docs.web3sdks.com/:match*",
      permanent: true,
    },
    {
      source: "/dashboard/publish/:path*",
      destination: "/contracts/publish/:path*",
      permanent: false,
    },
    {
      source: "/dashboard/mumbai/publish/:path*",
      destination: "/contracts/publish/:path*",
      permanent: false,
    },
    {
      source: "/privacy",
      destination: "/web3sdks_Privacy_Policy_May_2022.pdf",
      permanent: false,
    },
    {
      source: "/tos",
      destination: "/Web3sdks_Terms_of_Service.pdf",
      permanent: false,
    },
    {
      source: "/contracts/publish",
      destination: "/contracts/release",
      permanent: false,
    },
    {
      source: "/authentication",
      destination: "/auth",
      permanent: false,
    },
    {
      source: "/extensions",
      destination: "/contractkit",
      permanent: false,
    },
    //  old (deprecated) routes
    {
      source:
        "/:network/(edition|nft-collection|token|pack|nft-drop|signature-drop|edition-drop|token-drop|marketplace|split|vote)/:address",
      destination: "/:network/:address",
      permanent: false,
    },
    // prebuilt contract deploys
    {
      source: "/contracts/new/:slug*",
      destination: "/explore",
      permanent: false,
    },
    // deployer to non-deployer url
    // handled directly in SSR as well
    {
      source: "/deployer.web3sdks.eth",
      destination: "/web3sdks.eth",
      permanent: true,
    },
    {
      source: "/deployer.web3sdks.eth/:path*",
      destination: "/web3sdks.eth/:path*",
      permanent: true,
    },
  ];
}

module.exports = redirects;
