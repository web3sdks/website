import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Code,
  Divider,
  Flex,
  FormControl,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { IoMdAdd } from "@react-icons/all-files/io/IoMdAdd";
import { IoMdRemove } from "@react-icons/all-files/io/IoMdRemove";
import type { SplitInitializer } from "@web3sdks/sdk/evm";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { constants } from "ethers";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, FormErrorMessage, Heading, Text } from "tw-components";
import { z } from "zod";

export const RecipientForm: React.FC = () => {
  const { register, control, getFieldState, formState, watch, setValue } =
    useFormContext<z.infer<typeof SplitInitializer["schema"]["deploy"]>>();
  const { fields, append, remove } = useFieldArray({
    name: "recipients",
    control,
  });
  useEffect(() => {
    if (fields.length === 0) {
      append({ address: "", sharesBps: 10000 }, { shouldFocus: false });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalShares =
    watch("recipients")?.reduce((a, b) => a + b.sharesBps, 0) || 0;

  return (
    <>
      <Divider />
      <Flex px={0} as="section" direction="column" gap={4}>
        <Flex direction="column">
          <Heading size="title.md">Split Settings</Heading>
          <Text size="body.md" fontStyle="italic">
            Define the recipients and share percentages for this Split contract.
          </Text>
        </Flex>

        <Flex direction="column" gap={2}>
          {fields.map((field, index) => {
            return (
              <Flex
                key={field.id}
                gap={2}
                direction={{ base: "column", md: "row" }}
              >
                <FormControl
                  isInvalid={
                    !!getFieldState(`recipients.${index}.address`, formState)
                      .error
                  }
                >
                  <Input
                    variant="filled"
                    placeholder={constants.AddressZero}
                    {...register(`recipients.${index}.address`)}
                  />
                  <FormErrorMessage>
                    {
                      getFieldState(`recipients.${index}.address`, formState)
                        .error?.message
                    }
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={
                    !!getFieldState(`recipients.${index}.sharesBps`, formState)
                      .error
                  }
                >
                  <BasisPointsInput
                    variant="filled"
                    value={watch(`recipients.${index}.sharesBps`)}
                    onChange={(value) =>
                      setValue(`recipients.${index}.sharesBps`, value, {
                        shouldTouch: true,
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  />
                  <FormErrorMessage>
                    {
                      getFieldState(`recipients.${index}.sharesBps`, formState)
                        .error?.message
                    }
                  </FormErrorMessage>
                </FormControl>
                <IconButton
                  borderRadius="md"
                  isDisabled={index === 0 || formState.isSubmitting}
                  colorScheme="red"
                  icon={<IoMdRemove />}
                  aria-label="remove row"
                  onClick={() => remove(index)}
                />
              </Flex>
            );
          })}
        </Flex>

        {/* then render high level controls */}
        <Flex align="center" gap={2}>
          <Box w="50%">
            <Button
              size="sm"
              leftIcon={<IoMdAdd />}
              onClick={() => append({ address: "", sharesBps: 0 })}
            >
              Add Recipient
            </Button>
          </Box>
          <Flex w="50%" direction="column">
            <Heading as="label" textTransform="uppercase" size="label.sm">
              Total Shares
            </Heading>
            <Code p={0} bg="transparent">
              {Math.round(totalShares / 100)}%
            </Code>
          </Flex>
          <Box flexShrink={0} boxSize={8} />
        </Flex>
      </Flex>
      {totalShares < 10000 ? (
        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          <AlertDescription>
            Total shares need to add up to 100%. Total shares currently add up
            to {totalShares / 100}%.
          </AlertDescription>
        </Alert>
      ) : totalShares > 10000 ? (
        <Alert status="warning">
          <AlertIcon />
          <AlertDescription>Total shares cannot go over 100%.</AlertDescription>
        </Alert>
      ) : null}
    </>
  );
};
