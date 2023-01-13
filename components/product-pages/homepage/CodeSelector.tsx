import { CodeOptionButton, CodeOptions } from "../common/CodeOptionButton";
import { Box, Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import { SiReplDotIt } from "@react-icons/all-files/si/SiReplDotIt";
import { useTrack } from "hooks/analytics/useTrack";
import { useState } from "react";
import { Card, CodeBlock, LinkButton } from "tw-components";

const landingSnippets = {
  javascript: `import { Web3sdksSDK } from "@web3sdks/sdk";

const sdk = new Web3sdksSDK("mumbai");
const contract = await sdk.getContract("0xe68904F3018fF980b6b64D06d7f7fBCeFF4cB06c");

const nfts = await contract.erc721.getAll();
console.log(nfts);`,
  react: `import { Web3sdksNftMedia, useContract, useNFTs } from "@web3sdks/react";

export default function App() {
  const { contract: nftDrop } = useContract(
    "0xe68904F3018fF980b6b64D06d7f7fBCeFF4cB06c",
  );
  const { data: nfts } = useNFTs(nftDrop);

  return (nfts || []).map((nft) => (
    <Web3sdksNftMedia key={nft.metadata.id.toString()} metadata={nft.metadata} />
  ));
}`,
  python: `from web3sdks import Web3sdksSDK
from pprint import pprint

sdk = Web3sdksSDK("mumbai")

nftCollection = sdk.get_nft_drop("0xe68904F3018fF980b6b64D06d7f7fBCeFF4cB06c")

nfts = nftCollection.get_all()
pprint(nfts)`,
  go: `package main

import (
  "context"
  "encoding/json"
  "fmt"
  "github.com/web3sdks/go-sdk/v2/web3sdks"
)

func main() {
  sdk, _ := web3sdks.NewWeb3sdksSDK("mumbai", nil)

  // Add your NFT Drop contract address here
  address := "0xe68904F3018fF980b6b64D06d7f7fBCeFF4cB06c"
  nft, _ := sdk.GetNFTDrop(address)

  // Now you can use any of the read-only SDK contract functions
  nfts, _ := nft.GetAll(context.Background())

  b, _ := json.MarshalIndent(nfts, "", "  ")
  fmt.Printf(string(b))
}`,
  unity: `using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Web3sdks;

public class Example : MonoBehaviour {
  void Start() {
    Web3sdksSDK sdk = new Web3sdksSDK("goerli");
    string address = "0xb1c42E0C4289E68f1C337Eb0Da6a38C4c9F3f58e";
    NFTCollection nft = sdk.GetContract(address);
    List<NFT> nfts = await contract.ERC721.GetAll()
  }
}`,
};

const authSnippets = {
  javascript: `import { Web3sdksSDK } from "@web3sdks/sdk/evm";

const sdk = new Web3sdksSDK("goerli");

// Login with a single line of code
const payload = await sdk.auth.login();

// And verify the address of the logged in wallet
const address = await sdk.auth.verify(payload);`,
  react: `import { useSDK } from "@web3sdks/react";

export default function App() {
 const sdk = useSDK();

 async function login() {
  // Login with a single line of code
  const payload = await sdk.auth.login();

  // And verify the address of the logged in wallet
  const address = await sdk.auth.verify(payload);
 }
}`,
  python: `from web3sdks import Web3sdksSDK

sdk = Web3sdksSDK("goerli")

# Login with a single line of code
payload = sdk.auth.login();

# And verify the address of the logged in wallet
address = sdk.auth.verify(payload);`,
  go: `import "github.com/web3sdks/go-sdk/web3sdks"

func main() {
  sdk, err := web3sdks.NewWeb3sdksSDK("goerli", nil)

  // Login with a single line of code
  payload, err := sdk.Auth.Login()

  // And verify the address of the logged in wallet
  address, err := sdk.Auth.Verify(payload)
}`,
  unity: ``,
};

export interface CodeSelectorProps {
  defaultLanguage?: CodeOptions;
  snippets?: "landing" | "auth";
  docs?: string;
}

export const CodeSelector: React.FC<CodeSelectorProps> = ({
  defaultLanguage = "javascript",
  snippets = "landing",
  docs = "https://docs.web3sdks.com/",
}) => {
  const [activeLanguage, setActiveLanguage] =
    useState<CodeOptions>(defaultLanguage);
  const trackEvent = useTrack();

  const actualSnippets =
    snippets === "landing" ? landingSnippets : authSnippets;

  return (
    <>
      <SimpleGrid
        gap={{ base: 2, md: 3 }}
        columns={{ base: 2, md: snippets === "landing" ? 5 : 4 }}
        justifyContent={{ base: "space-between", md: "center" }}
      >
        {Object.keys(actualSnippets).map((key) =>
          key === "unity" && snippets === "auth" ? null : (
            <CodeOptionButton
              key={key}
              setActiveLanguage={setActiveLanguage}
              activeLanguage={activeLanguage}
              language={key as CodeOptions}
              textTransform="capitalize"
            >
              {key === "javascript" ? "JavaScript" : key}
            </CodeOptionButton>
          ),
        )}
      </SimpleGrid>

      <Card
        w={{ base: "full", md: "69%" }}
        borderWidth={0}
        p={0}
        outlineBorder={{
          gradient: "linear(147.15deg, #1D64EF 30.17%, #E0507A 100%)",
          width: "5px",
        }}
      >
        <CodeBlock
          borderWidth={0}
          w="full"
          py={4}
          code={actualSnippets[activeLanguage]}
          language={
            activeLanguage === "react"
              ? "jsx"
              : activeLanguage === "unity"
              ? "cpp"
              : activeLanguage
          }
          backgroundColor="#0d0e10"
        />
      </Card>

      <Flex
        gap={{ base: 4, md: 6 }}
        align="center"
        direction={{ base: "column", md: "row" }}
        w="100%"
        maxW="container.sm"
      >
        {snippets === "landing" && (
          <LinkButton
            role="group"
            borderRadius="md"
            p={6}
            variant="gradient"
            fromcolor="#1D64EF"
            tocolor="#E0507A"
            isExternal
            colorScheme="primary"
            w="full"
            href={`https://replit.com/@web3sdks/${activeLanguage}-sdk`}
            rightIcon={
              <Icon
                color="#E0507A"
                _groupHover={{ color: "#1D64EF" }}
                as={SiReplDotIt}
              />
            }
            onClick={() =>
              trackEvent({
                category: "code-selector",
                action: "click",
                label: "try-it",
              })
            }
          >
            <Box as="span">Try it on Replit</Box>
          </LinkButton>
        )}
        <LinkButton
          variant="outline"
          borderRadius="md"
          bg="#fff"
          color="#000"
          w="full"
          maxW="container.sm"
          _hover={{
            bg: "whiteAlpha.800",
          }}
          href={docs}
          isExternal
          p={6}
          onClick={() =>
            trackEvent({
              category: "code-selector",
              action: "click",
              label: "documentation",
            })
          }
        >
          Explore documentation
        </LinkButton>
      </Flex>
    </>
  );
};
