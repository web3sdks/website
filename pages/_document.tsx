import chakraTheme from "../theme";
import { ColorModeScript } from "@chakra-ui/react";
import Document, { Head, Html, Main, NextScript } from "next/document";

class ConsoleDocument extends Document {
  render() {
    return (
      <Html lang="en-US">
        <Head>
          {/* preconnect to domains we know we'll be using */}
          <link rel="preconnect" href="https://a.web3sdks.com" />
          <link rel="dns-prefetch" href="https://a.web3sdks.com" />
          <link rel="preconnect" href="https://pl.web3sdks.com" />
          <link rel="dns-prefetch" href="https://pl.web3sdks.com" />
          {/* prefetch domains we are likely to use */}
          <link rel="dns-prefetch" href="https://ipfs.web3sdks.com" />
        </Head>
        <body id="tw-body-root">
          <ColorModeScript
            initialColorMode={chakraTheme.config.initialColorMode}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default ConsoleDocument;
