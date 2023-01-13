import { SettingDetectedState } from "./detected-state";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { Flex, FormControl, Input, Textarea } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMetadata, useUpdateMetadata } from "@web3sdks/react";
import {
  CommonContractSchema,
  ValidContractInstance,
} from "@web3sdks/sdk/evm";
import { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FileInput } from "components/shared/FileInput";
import { useTrack } from "hooks/analytics/useTrack";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  FormErrorMessage,
  FormLabel,
  Heading,
  Text,
} from "tw-components";
import { z } from "zod";

export const SettingsMetadata = <
  TContract extends ValidContractInstance | undefined,
>({
  contract,
  detectedState,
}: {
  contract: TContract;
  detectedState: ExtensionDetectedState;
}) => {
  const trackEvent = useTrack();
  const metadata = useMetadata(contract);
  const metadataMutation = useUpdateMetadata(contract);
  const {
    setValue,
    register,
    watch,
    handleSubmit,
    formState,
    getFieldState,
    reset,
  } = useForm<z.input<typeof CommonContractSchema>>({
    resolver: zodResolver(CommonContractSchema),
  });
  useEffect(() => {
    if (metadata.data && !formState.isDirty) {
      reset(metadata.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.isDirty, metadata.data]);

  const { onSuccess, onError } = useTxNotifications(
    "Successfully updated metadata",
    "Error updating metadata",
  );

  return (
    <Card p={0} position="relative">
      <SettingDetectedState type="metadata" detectedState={detectedState} />
      <Flex
        as="form"
        onSubmit={handleSubmit((d) => {
          trackEvent({
            category: "settings",
            action: "set-metadata",
            label: "attempt",
          });
          metadataMutation.mutate(d, {
            onSuccess: () => {
              trackEvent({
                category: "settings",
                action: "set-metadata",
                label: "success",
              });
              onSuccess();
            },
            onError: (error) => {
              trackEvent({
                category: "settings",
                action: "set-metadata",
                label: "error",
                error,
              });
              onError(error);
            },
          });
        })}
        direction="column"
      >
        <Flex p={{ base: 6, md: 10 }} as="section" direction="column" gap={4}>
          <Flex direction="column">
            <Heading size="title.md">Metadata</Heading>
            <Text size="body.md" fontStyle="italic">
              Settings to organize and distinguish between your different
              contracts.
            </Text>
          </Flex>
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <Flex
              flexShrink={0}
              flexGrow={1}
              maxW={{ base: "100%", md: "160px" }}
            >
              <FormControl
                display="flex"
                flexDirection="column"
                isDisabled={metadata.isLoading || metadataMutation.isLoading}
                isInvalid={!!getFieldState("image", formState).error}
              >
                <FormLabel>Image</FormLabel>
                <FileInput
                  isDisabled={metadata.isLoading || metadataMutation.isLoading}
                  accept={{ "image/*": [] }}
                  value={useImageFileOrUrl(watch("image"))}
                  setValue={(file) =>
                    setValue("image", file, { shouldTouch: true })
                  }
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  transition="all 200ms ease"
                />
                <FormErrorMessage>
                  {getFieldState("image", formState).error?.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>

            <Flex
              direction="column"
              gap={4}
              flexGrow={1}
              justify="space-between"
            >
              <Flex gap={4} direction={{ base: "column", md: "row" }}>
                <FormControl
                  isDisabled={metadata.isLoading || metadataMutation.isLoading}
                  isInvalid={!!getFieldState("name", formState).error}
                >
                  <FormLabel>Name</FormLabel>
                  <Input variant="filled" {...register("name")} />
                  <FormErrorMessage>
                    {getFieldState("name", formState).error?.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>

              <FormControl
                isDisabled={metadata.isLoading || metadataMutation.isLoading}
                isInvalid={!!getFieldState("description", formState).error}
              >
                <FormLabel>Description</FormLabel>
                <Textarea variant="filled" {...register("description")} />
                <FormErrorMessage>
                  {getFieldState("description", formState).error?.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
          </Flex>
        </Flex>

        <AdminOnly contract={contract as ValidContractInstance}>
          <TransactionButton
            colorScheme="primary"
            transactionCount={1}
            isDisabled={metadata.isLoading || !formState.isDirty}
            type="submit"
            isLoading={metadataMutation.isLoading}
            loadingText="Saving..."
            size="md"
            borderRadius="xl"
            borderTopLeftRadius="0"
            borderTopRightRadius="0"
          >
            Update Metadata
          </TransactionButton>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
