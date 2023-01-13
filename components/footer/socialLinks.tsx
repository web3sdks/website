import { SiDiscord } from "@react-icons/all-files/si/SiDiscord";
import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { SiInstagram } from "@react-icons/all-files/si/SiInstagram";
import { SiLinkedin } from "@react-icons/all-files/si/SiLinkedin";
import { SiTiktok } from "@react-icons/all-files/si/SiTiktok";
import { SiTwitter } from "@react-icons/all-files/si/SiTwitter";
import { SiYoutube } from "@react-icons/all-files/si/SiYoutube";

interface socialLinkInfo {
  link: string;
  icon: JSX.Element;
  ariaLabel: string;
  label?: string;
}

const socialIconSize = "1.25rem";

export const SOCIALS: socialLinkInfo[] = [
  {
    link: "https://twitter.com/web3sdksdev",
    icon: <SiTwitter fontSize={socialIconSize} />,
    ariaLabel: "Twitter",
  },
  {
    icon: <SiDiscord fontSize={socialIconSize} />,
    ariaLabel: "Discord",
    label: "discord",
    link: "https://discord.gg/KX2tsh9A",
  },
  {
    link: "https://www.youtube.com/channel/UC7FwdKQ2H6uICx7HqwDGIjg",
    ariaLabel: "YouTube",
    label: "youtube",
    icon: <SiYoutube fontSize={socialIconSize} />,
  },
  {
    link: "https://www.linkedin.com/company/third-web/",
    ariaLabel: "LinkedIn",
    label: "linkedin",
    icon: <SiLinkedin fontSize={socialIconSize} />,
  },
  {
    link: "https://www.instagram.com/web3sdks/",
    ariaLabel: "Instagram",
    label: "instagram",
    icon: <SiInstagram fontSize={socialIconSize} />,
  },
  {
    link: "https://www.tiktok.com/@web3sdks",
    ariaLabel: "TikTok",
    label: "tiktok",
    icon: <SiTiktok fontSize={socialIconSize} />,
  },
  {
    link: "https://github.com/web3sdks",
    ariaLabel: "GitHub",
    label: "gitHub",
    icon: <SiGithub fontSize={socialIconSize} />,
  },
];
