import { getAbsoluteUrl } from "lib/vercel-utils";

interface OGImageRelease {
  name: string;
  version: string;
  publishDate: string;
  publisher: string;
  logo?: string;
  description?: string;
  publisherAvatar?: string;
  extension?: string | string[];
  license?: string | string[];
}

interface OgImageProfile {
  displayName: string;
  bio?: string;
  avatar?: string;
  releaseCnt?: string;
}

interface OgImageContract {
  displayName: string;
  contractAddress: string;
  description?: string;
  logo?: string;
  deployer?: string;
  erc?: string;
  // maybe later add release metadata
  // releaseMeta?: Pick<
  //   OGImageRelease,
  //   "name" | "version" | "publishDate" | "logo"
  // >;
}

type OgProps = {
  release: OGImageRelease;
  profile: OgImageProfile;
  contract: OgImageContract;
};

function toUrl<TOgType extends keyof OgProps>(
  type: TOgType,
  props: OgProps[TOgType],
): URL {
  const url = new URL(`${getAbsoluteUrl()}/api/og/${type}`);
  Object.entries(props).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item) => url.searchParams.append(key, item));
      } else {
        url.searchParams.append(key, value);
      }
    }
  });
  url.searchParams.sort();
  return url;
}

function fromUrl(type: keyof OgProps, url: URL): OgProps[typeof type] {
  switch (type) {
    case "release":
      return {
        name: url.searchParams.get("name") || "",
        version: url.searchParams.get("version") || "",
        publishDate: url.searchParams.get("publishDate") || "",
        publisher: url.searchParams.get("publisher") || "",
        logo: url.searchParams.get("logo") || undefined,
        description: url.searchParams.get("description") || undefined,
        publisherAvatar: url.searchParams.get("publisherAvatar") || undefined,
        extension: url.searchParams.getAll("extension"),
        license: url.searchParams.getAll("license"),
      };
    case "profile":
      return {
        displayName: url.searchParams.get("displayName") || "",
        bio: url.searchParams.get("bio") || undefined,
        avatar: url.searchParams.get("avatar") || undefined,
        releaseCnt: url.searchParams.get("releaseCnt") || undefined,
      } as OgProps["profile"];
    case "contract":
      return {
        displayName: url.searchParams.get("displayName") || "",
        contractAddress: url.searchParams.get("contractAddress") || "",
        description: url.searchParams.get("description") || undefined,
        logo: url.searchParams.get("logo") || undefined,
        deployer: url.searchParams.get("deployer") || undefined,
        erc: url.searchParams.get("erc") || undefined,
      } as OgProps["contract"];
    default:
      throw new Error(`Unknown OG type: ${type}`);
  }
}

export const ReleaseOG = {
  toUrl: (props: OgProps["release"]) => toUrl("release", props),
  fromUrl: (url: URL) => fromUrl("release", url) as OgProps["release"],
};

export const ProfileOG = {
  toUrl: (props: OgProps["profile"]) => toUrl("profile", props),
  fromUrl: (url: URL) => fromUrl("profile", url) as OgProps["profile"],
};

export const ContractOG = {
  toUrl: (props: OgProps["contract"]) => toUrl("contract", props),
  fromUrl: (url: URL) => fromUrl("contract", url) as OgProps["contract"],
};
