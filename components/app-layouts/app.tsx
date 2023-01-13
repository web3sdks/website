import { DashboardWeb3sdksProvider } from "./providers";
import { useWallet } from "@solana/wallet-adapter-react";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { DehydratedState, Hydrate, QueryClient } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
  Persister,
} from "@tanstack/react-query-persist-client";
import {
  shouldNeverPersistQuery,
  useAddress,
  useBalance,
  useChainId,
} from "@web3sdks/react";
import { useSDK } from "@web3sdks/react/solana";
import { AppShell, AppShellProps } from "components/layout/app-shell";
import { PrivacyNotice } from "components/notices/PrivacyNotice";
import { ErrorProvider } from "contexts/error-handler";
import { del, get, set } from "idb-keyval";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import React, { useEffect, useState } from "react";
import { ComponentWithChildren } from "types/component-with-children";
import { bigNumberReplacer } from "utils/bignumber";
import { isBrowser } from "utils/isBrowser";

const __CACHE_BUSTER = "v3.5.3";

interface AsyncStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

let currStorage: AsyncStorage | undefined;

function getStorage() {
  if (!isBrowser()) {
    return undefined;
  }
  if (currStorage) {
    return currStorage;
  }

  currStorage = {
    getItem: async (key) => {
      const i = await get(key);
      if (!i) {
        return null;
      }
      return i as string | null;
    },
    setItem: set,
    removeItem: del,
    // eslint-disable-next-line prettier/prettier
  } as AsyncStorage;
  return currStorage;
}

const persister: Persister = createAsyncStoragePersister({
  storage: getStorage(),
  serialize: (data) => {
    return JSON.stringify(
      {
        ...data,
        clientState: {
          ...data.clientState,
          queries: data.clientState.queries.filter(
            // covers solana as well as evm
            (q) => !shouldNeverPersistQuery(q.queryKey),
          ),
        },
      },
      bigNumberReplacer,
    );
  },
  key: `tw-query-cache`,
});

export interface AppLayoutProps extends AppShellProps {
  dehydratedState?: DehydratedState;
}

export const AppLayout: ComponentWithChildren<AppLayoutProps> = (props) => {
  // has to be constructed in here because it may otherwise share state between SSR'd pages
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 24 hours
            cacheTime: 1000 * 60 * 60 * 24,
            // 30 seconds
            staleTime: 1000 * 30,
          },
        },
      }),
  );

  const router = useRouter();
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        buster: __CACHE_BUSTER,
        dehydrateOptions: {
          shouldDehydrateQuery: (q) => !shouldNeverPersistQuery(q.queryKey),
        },
      }}
    >
      <Hydrate state={props.dehydratedState}>
        <ErrorProvider>
          <DashboardWeb3sdksProvider>
            <PHIdentifier />
            {router.pathname !== "/dashboard" && <PrivacyNotice />}

            <AppShell {...props} />
          </DashboardWeb3sdksProvider>
        </ErrorProvider>
      </Hydrate>
    </PersistQueryClientProvider>
  );
};

const PHIdentifier: React.FC = () => {
  const publicKey = useWallet().publicKey;
  const address = useAddress();
  const chainId = useChainId();
  const balance = useBalance();
  const solSDKNetwork = useSDK()?.network;

  useEffect(() => {
    if (address) {
      posthog.identify(address);
    } else if (publicKey) {
      posthog.identify(publicKey.toBase58());
    }
  }, [address, publicKey]);

  useEffect(() => {
    if (chainId) {
      posthog.unregister("network");
      posthog.register({ chain_id: chainId, ecosystem: "evm" });
    } else if (solSDKNetwork) {
      posthog.unregister("chain_id");
      posthog.register({
        network: solSDKNetwork || "unknown_network",
        ecosystem: "solana",
      });
    }
  }, [chainId, solSDKNetwork]);

  useEffect(() => {
    if (balance?.data?.displayValue) {
      posthog.register({ balance: balance.data.displayValue });
    }
  }, [balance]);

  return null;
};
