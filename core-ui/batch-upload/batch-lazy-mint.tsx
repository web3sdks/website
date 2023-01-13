import { BatchTable } from "./batch-table";
import { SelectOption } from "./lazy-mint-form/select-option";
import { UploadStep } from "./upload-step";
import {
  Alert,
  AlertIcon,
  Box,
  Container,
  Flex,
  FormControl,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiFillEye } from "@react-icons/all-files/ai/AiFillEye";
import { AiFillEyeInvisible } from "@react-icons/all-files/ai/AiFillEyeInvisible";
import { DelayedRevealLazyMintInput } from "@web3sdks/react/evm";
import type { NFTMetadataInput } from "@web3sdks/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FileInput } from "components/shared/FileInput";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { IoChevronBack } from "react-icons/io5";
import {
  Button,
  Card,
  Checkbox,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
  TrackedLink,
} from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";
import { processInputData, shuffleData } from "utils/batch";
import { z } from "zod";

type DelayedSubmit = {
  revealType: "delayed";
  data: DelayedRevealLazyMintInput;
};
type InstantSubmit = {
  revealType: "instant";
  data: { metadatas: NFTMetadataInput[] };
};

type SubmitType = DelayedSubmit | InstantSubmit;

interface BatchLazyMintEVMProps {
  ecosystem: "evm";
  nextTokenIdToMint: number;
  isRevealable: boolean;
  onSubmit: (formData: SubmitType) => Promise<any>;
}

interface BatchLazyMintSolanaProps {
  ecosystem: "solana";
  onSubmit: (formData: InstantSubmit) => Promise<any>;
}

type BatchLazyMintProps = BatchLazyMintEVMProps | BatchLazyMintSolanaProps;

const BatchLazyMintFormSchema = z
  .object({
    // delayed reveal placeholder
    placeHolder: z
      .object({
        name: z.string().min(1, "A name is required"),
        image: z.any().optional(),
        description: z.string().or(z.string().length(0)).optional(),
      })
      .optional(),
    // delayed reveal password logic
    password: z.string().min(1, "A password is required.").optional(),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password.")
      .optional(),

    // shared logic
    shuffle: z.boolean().default(false),
    revealType: z.literal("instant").or(z.literal("delayed")).optional(),

    // metadata
    metadatas: z.array(z.any()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type BatchLazyMintFormType = z.output<typeof BatchLazyMintFormSchema> & {
  metadatas: NFTMetadataInput[];
};

function useBatchLazyMintForm(ecosystem: "solana" | "evm") {
  return useForm<BatchLazyMintFormType>({
    resolver: zodResolver(BatchLazyMintFormSchema),
    defaultValues: {
      metadatas: [],
      revealType: ecosystem === "solana" ? "instant" : undefined,
      shuffle: false,
    },
  });
}

export const BatchLazyMint: ComponentWithChildren<BatchLazyMintProps> = (
  props,
) => {
  const [step, setStep] = useState(0);

  const form = useBatchLazyMintForm(props.ecosystem);

  const nftMetadatas = form.watch("metadatas");
  const hasError = !!form.getFieldState("metadatas", form.formState).error;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      try {
        await processInputData(acceptedFiles, (data) =>
          form.setValue("metadatas", data),
        );
      } catch (err) {
        form.setError("metadatas", {
          message: "Invalid metadata files",
          type: "validate",
        });
      }

      if (nftMetadatas.length === 0) {
        form.setError("metadatas", {
          message: "Invalid metadata files",
          type: "validate",
        });
      }
    },
  });

  const paginationPortalRef = useRef<HTMLDivElement>(null);

  return (
    <Container
      maxW="container.page"
      borderRadius={{ base: 0, md: "2xl" }}
      my={{ base: 0, md: 12 }}
      p={{ base: 0, md: 4 }}
      as="form"
      onSubmit={form.handleSubmit((data) => {
        // first shuffle
        const shuffledMetadatas = data.shuffle
          ? shuffleData(data.metadatas)
          : data.metadatas;
        // in solana there is only instant submit
        if (props.ecosystem === "solana") {
          return props.onSubmit({
            revealType: "instant",
            data: { metadatas: shuffledMetadatas },
          });
        } else {
          // check submit is instant
          if (data.revealType === "instant") {
            return props.onSubmit({
              revealType: "instant",
              data: { metadatas: shuffledMetadatas },
            });
          } else {
            // validate password
            if (!data.password) {
              form.setError("password", {
                message: "A password is required for delayed reveal.",
                type: "validate",
              });
              return;
            }
            // validate placeholder
            if (!data.placeHolder?.name) {
              form.setError("placeHolder.name", {
                message: "A name is required for delayed reveal.",
                type: "validate",
              });
            }
            // submit
            return props.onSubmit({
              revealType: "delayed",
              data: {
                metadatas: shuffledMetadatas,
                password: data.password,
                placeholder: {
                  name: data.placeHolder?.name,
                  description: data.placeHolder?.description,
                  image: data.placeHolder?.image,
                },
              },
            });
          }
        }
      })}
    >
      <Card bg="backgroundCardHighlight">
        <Flex flexDir="column" width="100%" p={4}>
          {step === 0 ? (
            <>
              <Flex
                align="center"
                justify="space-between"
                py={{ base: 2, md: 4 }}
                w="100%"
                mb={2}
              >
                <Heading size="title.md">Upload your NFTs</Heading>
              </Flex>
              <Flex direction="column" gap={6} h="100%">
                {nftMetadatas.length > 0 ? (
                  <BatchTable
                    portalRef={paginationPortalRef}
                    data={nftMetadatas}
                    {...(props.ecosystem === "evm"
                      ? { nextTokenIdToMint: props.nextTokenIdToMint }
                      : {})}
                  />
                ) : (
                  <UploadStep
                    getRootProps={getRootProps}
                    getInputProps={getInputProps}
                    hasFailed={hasError}
                    isDragActive={isDragActive}
                  />
                )}
                <Flex borderTop="1px solid" borderTopColor="borderColor">
                  <Container maxW="container.page">
                    <Flex
                      align="center"
                      justify="space-between"
                      p={{ base: 0, md: 4 }}
                      flexDir={{ base: "column", md: "row" }}
                      mt={{ base: 4, md: 0 }}
                    >
                      <Box ref={paginationPortalRef} />
                      <Flex
                        gap={2}
                        align="center"
                        mt={{ base: 4, md: 0 }}
                        w={{ base: "100%", md: "auto" }}
                      >
                        <Button
                          borderRadius="md"
                          isDisabled={nftMetadatas.length === 0 || !hasError}
                          onClick={() => {
                            form.reset();
                          }}
                          w={{ base: "100%", md: "auto" }}
                        >
                          Reset
                        </Button>
                        <Button
                          borderRadius="md"
                          colorScheme="primary"
                          isDisabled={nftMetadatas.length === 0}
                          onClick={() => setStep(1)}
                          w={{ base: "100%", md: "auto" }}
                        >
                          Next
                        </Button>
                      </Flex>
                    </Flex>
                  </Container>
                </Flex>
              </Flex>
            </>
          ) : (
            <>
              <Flex
                align="center"
                justify="space-between"
                py={4}
                w="100%"
                mb={2}
              >
                <HStack>
                  <Icon
                    boxSize={5}
                    as={IoChevronBack}
                    color="gray.600"
                    onClick={() => setStep(0)}
                    cursor="pointer"
                  />
                  <Heading size="title.md">
                    When will you reveal your NFTs?
                  </Heading>
                </HStack>
              </Flex>
              <SelectReveal
                form={form}
                ecosystem={props.ecosystem}
                isRevealable={
                  props.ecosystem === "evm" ? props.isRevealable : false
                }
              />
              {(form.watch("revealType") || props.ecosystem === "solana") && (
                <>
                  <Flex alignItems="center" gap={3} mt={3}>
                    <Checkbox {...form.register("shuffle")} />
                    <Flex gap={1} flexDir={{ base: "column", md: "row" }}>
                      <Text>
                        Shuffle the order of the NFTs before uploading.
                      </Text>
                      <Text fontStyle="italic">
                        This is an off-chain operation and is not provable.
                      </Text>
                    </Flex>
                  </Flex>
                  <Box maxW={{ base: "100%", md: "61%" }}>
                    <TransactionButton
                      ecosystem={props.ecosystem}
                      mt={4}
                      colorScheme="primary"
                      transactionCount={1}
                      isDisabled={!nftMetadatas.length}
                      type="submit"
                      isLoading={form.formState.isSubmitting}
                      loadingText={`Uploading ${nftMetadatas.length} NFTs...`}
                      w="full"
                    >
                      Upload {nftMetadatas.length} NFTs
                    </TransactionButton>
                    {props.children}
                  </Box>
                  <Text size="body.sm" mt={2}>
                    <TrackedLink
                      href="https://web3sdks.notion.site/Batch-Upload-Troubleshooting-dbfc0d3afa6e4d1b98b6199b449c1596"
                      isExternal
                      category="batch-upload"
                      label="issues"
                    >
                      Experiencing issues uploading your files?
                    </TrackedLink>
                  </Text>
                </>
              )}
            </>
          )}
        </Flex>
      </Card>
    </Container>
  );
};

interface SelectRevealProps {
  form: ReturnType<typeof useBatchLazyMintForm>;
  ecosystem: "evm" | "solana";
  isRevealable: boolean;
}

const SelectReveal: React.FC<SelectRevealProps> = ({
  form,
  ecosystem,
  isRevealable,
}) => {
  const [show, setShow] = useState(false);

  const imageUrl = useImageFileOrUrl(form.watch("placeHolder.image"));
  return (
    <Flex flexDir="column">
      <Flex
        gap={{ base: 3, md: 6 }}
        mb={6}
        flexDir={{ base: "column", md: "row" }}
      >
        <SelectOption
          name="Reveal upon mint"
          description="Collectors will immediately see the final NFT when they complete the minting"
          isActive={form.watch("revealType") === "instant"}
          onClick={() => form.setValue("revealType", "instant")}
        />
        <SelectOption
          name="Delayed Reveal"
          description="Collectors will mint your placeholder image, then you reveal at a later time"
          isActive={form.watch("revealType") === "delayed"}
          onClick={() => form.setValue("revealType", "delayed")}
          disabled={!isRevealable}
          disabledText={
            ecosystem === "evm"
              ? "This contract doesn't implement Delayed Reveal"
              : "Delayed Reveal is not yet supported on Solana"
          }
        />
      </Flex>
      <Flex>
        <Stack spacing={6}>
          <Stack spacing={3}>
            {form.watch("revealType") === "delayed" && (
              <>
                <Heading size="title.sm">Let&apos;s set a password</Heading>
                <Alert status="warning" borderRadius="lg">
                  <AlertIcon />
                  You&apos;ll need this password to reveal your NFTs. Please
                  save it somewhere safe.
                </Alert>

                <Flex
                  flexDir={{ base: "column", md: "row" }}
                  gap={{ base: 4, md: 0 }}
                >
                  <FormControl
                    isRequired
                    isInvalid={
                      !!form.getFieldState("password", form.formState).error
                    }
                    mr={4}
                  >
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        {...form.register("password")}
                        placeholder="Choose password"
                        type={show ? "text" : "password"}
                      />
                      <InputRightElement
                        cursor="pointer"
                        children={
                          <Icon
                            as={show ? AiFillEye : AiFillEyeInvisible}
                            onClick={() => setShow(!show)}
                          />
                        }
                      />
                    </InputGroup>

                    <FormErrorMessage>
                      {
                        form.getFieldState("password", form.formState).error
                          ?.message
                      }
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={
                      !!form.getFieldState("confirmPassword", form.formState)
                        .error
                    }
                  >
                    <FormLabel>Confirm password</FormLabel>
                    <Input
                      {...form.register("confirmPassword")}
                      placeholder="Confirm password"
                      type="password"
                    />
                    <FormErrorMessage>
                      {
                        form.getFieldState("confirmPassword", form.formState)
                          .error?.message
                      }
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
                <Stack spacing={5}>
                  <Heading size="title.sm">Placeholder</Heading>
                  <FormControl
                    isInvalid={
                      !!form.getFieldState("placeHolder.image", form.formState)
                        .error
                    }
                  >
                    <FormLabel>Image</FormLabel>
                    <Box width={{ base: "auto", md: "350px" }}>
                      <FileInput
                        accept={{ "image/*": [] }}
                        value={imageUrl}
                        showUploadButton
                        setValue={(file) =>
                          form.setValue("placeHolder.image", file)
                        }
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        transition="all 200ms ease"
                        _hover={{ shadow: "sm" }}
                      />
                    </Box>
                    <FormHelperText>
                      You can optionally upload an image as the placeholder.
                    </FormHelperText>
                    <FormErrorMessage>
                      {
                        form.getFieldState("placeHolder.image", form.formState)
                          .error?.message
                      }
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={
                      !!form.getFieldState("placeHolder.name", form.formState)
                        .error
                    }
                  >
                    <FormLabel>Name</FormLabel>
                    <Input
                      {...form.register("placeHolder.name")}
                      placeholder="eg. My NFT (Coming soon)"
                    />
                    <FormErrorMessage>
                      {
                        form.getFieldState("placeHolder.name", form.formState)
                          .error?.message
                      }
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={
                      !!form.getFieldState("placeHolder.name", form.formState)
                        .error
                    }
                  >
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      {...form.register("placeHolder.description")}
                      placeholder="eg. Reveal on July 15th!"
                    />
                    <FormErrorMessage>
                      {
                        form.getFieldState(
                          "placeHolder.description",
                          form.formState,
                        ).error?.message
                      }
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};
