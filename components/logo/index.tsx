import {
  AspectRatio,
  AspectRatioProps,
  Stack,
  VisuallyHidden,
} from "@chakra-ui/react";
import { Text } from "tw-components";

export const IconLogo: React.FC<Omit<AspectRatioProps, "ratio">> = ({
  color,
  ...props
}) => {
  return (
    <AspectRatio ratio={516 / 321} {...props}>
      <img src="https://www.web3sdks.com/logo.png" />
    </AspectRatio>
  );
};

export const Wordmark: React.FC<Omit<AspectRatioProps, "ratio">> = ({
  color = "var(--chakra-colors-wordmark)",
  ...props
}) => {
  return (
    <AspectRatio ratio={1377 / 267} {...props}>
      <Text style={{ fontSize: "22px", fontWeight: "bold", color: "#FFFFFF", width: "112px" }}>web3sdks</Text>
    </AspectRatio>
  );
};

interface ILogoProps {
  hideIcon?: boolean;
  hideWordmark?: boolean;
  forceShowWordMark?: boolean;
  color?: string;
}

export const Logo: React.FC<ILogoProps> = ({
  hideIcon,
  hideWordmark,
  forceShowWordMark,
  color,
}) => {
  return (
    <Stack as="h2" align="center" direction="row">
      {hideIcon ?? <IconLogo w={[9, 9, 10]} flexShrink={0} />}
      {(hideWordmark && !forceShowWordMark) ?? (
        <Wordmark
          display={forceShowWordMark ? "block" : { base: "none", md: "block" }}
          color={color}
          w={[24, 24, 28]}
          flexShrink={0}
        />
      )}
      <VisuallyHidden>web3sdks</VisuallyHidden>
    </Stack>
  );
};
