import { NextPage } from "next";
import { PageId } from "page-id";
import { ReactElement, ReactNode } from "react";

export type Web3sdksNextPage = NextPage<any> & {
  getLayout?: (page: ReactElement, pageProps?: any) => ReactNode;
  pageId: PageId | ((pageProps: any) => PageId);
};
