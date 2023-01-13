import {
  Center,
  Flex,
  Icon,
  IconButton,
  Select,
  Skeleton,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { NFTContract, useNFTs, useTotalCount } from "@web3sdks/react";
import { NFT } from "@web3sdks/sdk";
import { detectFeatures } from "components/contract-components/utils";
import { MediaCell } from "components/contract-pages/table/table-columns/cells/media-cell";
import { NFTDrawer } from "core-ui/nft-drawer/nft-drawer";
import { useNFTDrawerTabs } from "core-ui/nft-drawer/useNftDrawerTabs";
import { BigNumber } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { CellProps, Column, usePagination, useTable } from "react-table";
import { Card, Heading, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

interface ContractOverviewNFTGetAllProps {
  contract: NFTContract;
}
export const NFTGetAllTable: React.FC<ContractOverviewNFTGetAllProps> = ({
  contract,
}) => {
  const isErc721 = detectFeatures(contract, ["ERC721"]);
  const isErc1155 = detectFeatures(contract, ["ERC1155"]);

  const tableColumns = useMemo(() => {
    const cols: Column<NFT>[] = [
      {
        Header: "Token Id",
        accessor: (row) => row.metadata.id,
        Cell: (cell: CellProps<NFT, string>) => (
          <Text size="body.md" fontFamily="mono">
            {cell.value}
          </Text>
        ),
      },
      {
        Header: "Media",
        accessor: (row) => row.metadata,
        Cell: (cell: CellProps<NFT, NFT["metadata"]>) => (
          <MediaCell cell={cell} />
        ),
      },
      {
        Header: "Name",
        accessor: (row) => row.metadata.name,
        Cell: (cell: CellProps<NFT, string>) => (
          <Text size="label.md">{cell.value}</Text>
        ),
      },
      {
        Header: "Description",
        accessor: (row) => row.metadata.description,
        Cell: (cell: CellProps<NFT, string>) => (
          <Text
            noOfLines={4}
            size="body.md"
            fontStyle={!cell.value ? "italic" : "normal"}
          >
            {cell.value || "No description"}
          </Text>
        ),
      },
    ];
    if (isErc721) {
      cols.push({
        Header: "Owner",
        accessor: (row) => row.owner,
        Cell: (cell: CellProps<NFT, string>) => (
          <AddressCopyButton size="xs" address={cell.value} />
        ),
      });
    }
    if (isErc1155) {
      cols.push({
        Header: "Supply",
        accessor: (row) => row.supply,
        Cell: (cell: CellProps<NFT, number>) => (
          <Text noOfLines={4} size="body.md" fontFamily="mono">
            {cell.value}
          </Text>
        ),
      });
    }
    return cols;
  }, [isErc721, isErc1155]);

  const [queryParams, setQueryParams] = useState({ count: 50, start: 0 });
  const getAllQueryResult = useNFTs(contract, queryParams);
  const totalCountQuery = useTotalCount(contract);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: tableColumns,
      data: getAllQueryResult.data || [],
      initialState: {
        pageSize: queryParams.count,
        pageIndex: 0,
      },
      manualPagination: true,
      pageCount: Math.max(
        Math.ceil(
          BigNumber.from(totalCountQuery.data || 0).toNumber() /
            queryParams.count,
        ),
        1,
      ),
    },
    usePagination,
  );

  useEffect(() => {
    setQueryParams({ start: pageIndex * pageSize, count: pageSize });
  }, [pageIndex, pageSize]);

  const [tokenRow, setTokenRow] = useState<NFT | null>(null);

  const drawerTabs = useNFTDrawerTabs("evm", contract, tokenRow);

  return (
    <Flex gap={4} direction="column">
      <Card maxW="100%" overflowX="auto" position="relative" px={0} py={0}>
        {getAllQueryResult.isFetching && (
          <Spinner
            color="primary"
            size="xs"
            position="absolute"
            top={2}
            right={4}
          />
        )}
        <NFTDrawer
          data={tokenRow}
          isOpen={!!tokenRow}
          onClose={() => setTokenRow(null)}
          tabs={drawerTabs}
        />
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              // eslint-disable-next-line react/jsx-key
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // eslint-disable-next-line react/jsx-key
                  <Th {...column.getHeaderProps()} py={5}>
                    <Text as="label" size="label.md">
                      {column.render("Header")}
                    </Text>
                  </Th>
                ))}
                {/* // Need to add an empty header for the drawer button */}
                <Th />
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()} position="relative">
            {page.map((row) => {
              const failedToLoad = !row.original.metadata.uri;
              prepareRow(row);
              return (
                // eslint-disable-next-line react/jsx-key
                <Tr
                  {...row.getRowProps()}
                  role="group"
                  _hover={{ bg: "accent.100" }}
                  // this is a hack to get around the fact that safari does not handle position: relative on table rows
                  style={{ cursor: "pointer" }}
                  onClick={() => setTokenRow(row.original)}
                  // end hack
                  borderBottomWidth={1}
                  _last={{ borderBottomWidth: 0 }}
                  pointerEvents={failedToLoad ? "none" : "auto"}
                  opacity={failedToLoad ? 0.3 : 1}
                  cursor={failedToLoad ? "not-allowed" : "pointer"}
                >
                  {row.cells.map((cell) => (
                    // eslint-disable-next-line react/jsx-key
                    <Td {...cell.getCellProps()} borderBottomWidth="inherit">
                      {cell.render("Cell")}
                    </Td>
                  ))}
                  <Td borderBottomWidth="inherit">
                    {!failedToLoad && <Icon as={FiArrowRight} />}
                  </Td>
                </Tr>
              );
            })}
            {getAllQueryResult.isPreviousData && (
              <Flex
                zIndex="above"
                position="absolute"
                top={0}
                bottom={0}
                left={0}
                right={0}
                backdropFilter="blur(5px)"
                bg="blackAlpha.100"
                _dark={{ bg: "whiteAlpha.50" }}
                borderRadius="md"
                align="flex-end"
                justify="center"
                p={8}
              >
                <Flex align="center" gap={4}>
                  <Spinner size="sm" />
                  <Heading size="label.lg">Fetching new page</Heading>
                </Flex>
              </Flex>
            )}
          </Tbody>
        </Table>
      </Card>
      <Center w="100%">
        <Flex gap={2} direction="row" align="center">
          <IconButton
            isDisabled={!canPreviousPage || totalCountQuery.isLoading}
            aria-label="first page"
            icon={<Icon as={MdFirstPage} />}
            onClick={() => gotoPage(0)}
          />
          <IconButton
            isDisabled={!canPreviousPage || totalCountQuery.isLoading}
            aria-label="previous page"
            icon={<Icon as={MdNavigateBefore} />}
            onClick={() => previousPage()}
          />
          <Text whiteSpace="nowrap">
            Page <strong>{pageIndex + 1}</strong> of{" "}
            <Skeleton
              as="span"
              display="inline"
              isLoaded={totalCountQuery.isSuccess}
            >
              <strong>{pageCount}</strong>
            </Skeleton>
          </Text>
          <IconButton
            isDisabled={!canNextPage || totalCountQuery.isLoading}
            aria-label="next page"
            icon={<Icon as={MdNavigateNext} />}
            onClick={() => nextPage()}
          />
          <IconButton
            isDisabled={!canNextPage || totalCountQuery.isLoading}
            aria-label="last page"
            icon={<Icon as={MdLastPage} />}
            onClick={() => gotoPage(pageCount - 1)}
          />

          <Select
            onChange={(e) => {
              setPageSize(parseInt(e.target.value as string, 10));
            }}
            value={pageSize}
            isDisabled={totalCountQuery.isLoading}
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="500">500</option>
          </Select>
        </Flex>
      </Center>
    </Flex>
  );
};
