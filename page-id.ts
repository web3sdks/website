export enum PageId {
  // unknown page id (default)
  Unknown = "unknown",

  // ---------------------------------------------------------------------------
  //  marketing / growth pages
  // ---------------------------------------------------------------------------

  // web3sdks.com
  Homepage = "homepage-landing",

  // web3sdks.com
  About = "about-page",

  // web3sdks.com/auth
  AuthenticationLanding = "auth-landing",

  // web3sdks.com/release
  ReleaseLanding = "release-landing",

  // web3sdks.com/deploy
  DeployLanding = "deploy-landing",

  // web3sdks.com/contract-extensions
  ContractExtensionsLanding = "contract-extensions-landing",

  // web3sdks.com/web3-sdk
  Web3SDKLanding = "web3-sdk-landing",

  // web3sdks.com/pre-built-contracts
  PreBuiltContractsLanding = "pre-built-contracts-landing",

  // web3sdks.com/web3-dashboard
  DashboardLanding = "dashboard-landing",

  // web3sdks.com/web3-storage
  StorageLanding = "storage-landing",

  // web3sdks.com/ui-components
  UIComponentsLanding = "ui-components-landing",

  // web3sdks.com/gas
  GasEstimator = "gas-estimator",

  // web3sdks.com/hackathon/solanathon
  SolanaHackathonLanding = "solanathon",

  // web3sdks.com/404
  PageNotFound = "page-not-found",

  // ---------------------------------------------------------------------------
  //  general product pages
  // ---------------------------------------------------------------------------

  // web3sdks.com/dashboard
  Dashboard = "dashboard",

  // thridweb.com/contracts
  Contracts = "contracts",

  // thridweb.com/explore
  Explore = "explore",

  // thridweb.com/explore/[category]
  ExploreCategory = "explore-category",

  // thridweb.com/contracts
  Programs = "programs",

  // ---------------------------------------------------------------------------
  //  solutions pages
  // ---------------------------------------------------------------------------

  SolutionsCommerce = "solutions-commerce",
  SolutionsGaming = "solutions-gaming",

  // ---------------------------------------------------------------------------
  //  network pages
  // ---------------------------------------------------------------------------

  NetworkSolana = "network-solana",

  // ---------------------------------------------------------------------------
  //  faucets pages
  // ---------------------------------------------------------------------------

  FaucetSolana = "faucet-solana",

  // ---------------------------------------------------------------------------
  //  "release" product pages
  // ---------------------------------------------------------------------------

  // web3sdks.com/contracts/release
  ReleaseMultiple = "release-multiple-contracts",

  // web3sdks.com/contracts/release/:id
  ReleaseSingle = "release-single-contract",

  // web3sdks.com/:wallet
  // example: web3sdks.com/jns.eth
  Profile = "profile",

  // web3sdks.com/:wallet/:contractId
  // example: web3sdks.com/jns.eth/PermissionedERC721A
  ReleasedContract = "released-contract",

  // ---------------------------------------------------------------------------
  //  "deploy" product pages
  // ---------------------------------------------------------------------------

  // web3sdks.com/contracts/deploy
  DeployMultiple = "deploy-multiple-contracts",

  // web3sdks.com/contracts/deploy/:id
  DeploySingle = "deploy-single-contract",

  // web3sdks.com/contracts/new
  NewContract = "new-contract",

  // web3sdks.com/contracts/custom
  NewCustomContract = "new-custom-contract",

  // web3sdks.com/contracts/new/pre-built
  PreBuiltContract = "new-pre-built-contract",

  // web3sdks.com/contracts/new/pre-built/:contractCategory
  // example: web3sdks.com/contracts/new/pre-built/drop/
  PreBuiltContractCategory = "new-pre-built-contract-category",

  // web3sdks.com/contracts/new/pre-built/:contractCategory/:contractType
  // example: web3sdks.com/contracts/new/pre-built/drop/nft-drop
  PreBuiltContractType = "new-pre-built-contract-type",

  // web3sdks.com/:network/:contractAddress (evm)
  // example: web3sdks.com/goerli/0x2eaDAa60dBB74Ead3E20b23E4C5A0Dd789932846
  DeployedContract = "deployed-contract",

  // web3sdks.com/:network/:contractAddress (solana)
  // example: web3sdks.com/solana/5GYspMpsfw3Vrf7FQ37Jbhpg4PeVZHEPrfPcXY9sGQzy
  DeployedProgram = "deployed-program",
}
