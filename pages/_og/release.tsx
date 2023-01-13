import { Box, Flex, Icon, Image, List, ListItem } from "@chakra-ui/react";
import { OgBrandIcon } from "components/og/og-brand-icon";
import {
  BASE_URL,
  OG_IMAGE_BASE_URL,
  OG_IMAGE_CACHE_VERSION,
  TWEMOJI_OPTIONS,
} from "lib/constants";
import { correctAndUniqueLicenses } from "lib/licenses";
import { replaceIpfsUrl } from "lib/sdk";
import { useRouter } from "next/router";
import {
  VscBook,
  VscCalendar,
  VscExtensions,
  VscVersions,
} from "react-icons/vsc";
import Twemoji from "react-twemoji";
import { Heading, Text } from "tw-components";
import { MaskedAvatar } from "tw-components/masked-avatar";
import { z } from "zod";

const OGReleaseMetadataSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  releaser: z.string(),
  releaserAvatar: z.string().optional(),
  extension: z.array(z.string()).or(z.string()).optional(),
  license: z.array(z.string()).or(z.string()).optional(),
  releaseLogo: z.string().optional(),
  version: z.string(),
  releaseDate: z.string(),
});

export function createReleaseOGUrl(
  metadata: z.infer<typeof OGReleaseMetadataSchema>,
) {
  const ogUrl = new URL(`${OG_IMAGE_BASE_URL}/api`);

  const url = new URL(`${BASE_URL}/_og/release`);

  Object.entries(metadata).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item) => url.searchParams.append(key, item));
      } else {
        url.searchParams.append(key, value);
      }
    }
  });

  url.searchParams.sort();

  ogUrl.searchParams.append("url", url.toString());
  ogUrl.searchParams.append("ogv", OG_IMAGE_CACHE_VERSION);

  return ogUrl.toString();
}

export default function OGReleaseImage() {
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  let metadata;

  try {
    metadata = OGReleaseMetadataSchema.parse(router.query);
  } catch (err) {
    console.error("failed to render", err);
    return null;
  }

  return (
    <Box
      position="fixed"
      top={0}
      bottom={0}
      right={0}
      left={0}
      bg="black"
      overflow="hidden"
    >
      <Box
        position="absolute"
        left={0}
        bottom={0}
        top={0}
        w="50%"
        bg="url(/assets/og-image/purple-gradient.png)"
        bgSize="contain"
        bgRepeat="no-repeat"
        bgPosition="left bottom"
        zIndex={-1}
      />
      <Box
        position="absolute"
        right={0}
        bottom={0}
        top={0}
        w="50%"
        bg="url(/assets/og-image/blue-gradient.png)"
        bgSize="contain"
        bgRepeat="no-repeat"
        bgPosition="right top"
        zIndex={-1}
      />
      <Flex
        p="70px"
        w="100%"
        height="100%"
        direction="column"
        justify="space-between"
      >
        <Flex
          direction="row"
          justify="space-between"
          align="flex-start"
          w="100%"
        >
          <Flex
            flexGrow={0}
            w="calc(1200px - 140px - 70px - 100px)"
            direction="column"
            gap="18px"
          >
            <Flex direction="row" align="center" gap="14px">
              {metadata.releaseLogo && (
                <Image
                  alt={metadata.name}
                  src={replaceIpfsUrl(metadata.releaseLogo)}
                  borderRadius="full"
                  boxSize="64px"
                />
              )}
              <Heading
                noOfLines={1}
                size="title.lg"
                fontSize="64px"
                fontWeight={700}
              >
                <Twemoji options={TWEMOJI_OPTIONS}>{metadata.name}</Twemoji>
              </Heading>
            </Flex>
            {metadata.description && (
              <Text
                noOfLines={2}
                size="body.2xl"
                fontSize="32px"
                lineHeight={1.5}
              >
                <Twemoji options={TWEMOJI_OPTIONS}>
                  {metadata.description}
                </Twemoji>
              </Text>
            )}
          </Flex>
          <Flex
            flexGrow={0}
            flexShrink={0}
            direction="column"
            gap="16px"
            align="center"
            textAlign="center"
          >
            <MaskedAvatar
              boxSize={128}
              src={
                metadata.releaserAvatar ||
                `https://source.boringavatars.com/marble/120/${metadata.releaser}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51&square=true`
              }
            />
            <Heading size="subtitle.lg">
              <Twemoji options={TWEMOJI_OPTIONS}>{metadata.releaser}</Twemoji>
            </Heading>
          </Flex>
        </Flex>
        <Flex direction="row" justify="space-between" align="flex-end">
          <List>
            {metadata.extension && (
              <Flex as={ListItem} gap="12px" align="center">
                <Icon
                  color="rgba(255,255,255,.5)"
                  as={VscExtensions}
                  boxSize="24px"
                />
                <Heading
                  noOfLines={1}
                  maxW="50vw"
                  color="rgba(255,255,255,.8)"
                  fontFamily="mono"
                  size="subtitle.lg"
                >
                  {Array.isArray(metadata.extension)
                    ? metadata.extension.join(", ")
                    : metadata.extension}
                </Heading>
              </Flex>
            )}
            <Flex as={ListItem} gap="12px" align="center">
              <Icon color="rgba(255,255,255,.5)" as={VscBook} boxSize="24px" />
              <Heading
                color="rgba(255,255,255,.8)"
                fontFamily="mono"
                size="subtitle.lg"
              >
                {correctAndUniqueLicenses(
                  Array.isArray(metadata.license)
                    ? metadata.license
                    : metadata.license
                    ? [metadata.license]
                    : [],
                ).join(", ")}
              </Heading>
            </Flex>
            <Flex as={ListItem} gap="12px" align="center">
              <Icon
                color="rgba(255,255,255,.5)"
                as={VscVersions}
                boxSize="24px"
              />
              <Heading
                color="rgba(255,255,255,.8)"
                fontFamily="mono"
                size="subtitle.lg"
              >
                {metadata.version}
              </Heading>
            </Flex>
            <Flex as={ListItem} gap="12px" align="center">
              <Icon
                color="rgba(255,255,255,.5)"
                as={VscCalendar}
                boxSize="24px"
              />
              <Heading
                color="rgba(255,255,255,.8)"
                fontFamily="mono"
                size="subtitle.lg"
              >
                {metadata.releaseDate}
              </Heading>
            </Flex>
          </List>
          <OgBrandIcon />
        </Flex>
      </Flex>
    </Box>
  );
}
