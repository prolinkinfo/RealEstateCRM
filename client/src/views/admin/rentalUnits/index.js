import { DeleteIcon, EditIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import CommonCheckTable from "components/reactTable/checktable";
import { useEffect, useMemo, useRef, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import {
  FiDollarSign,
  FiHash,
  FiHome,
  FiPlus,
  FiTool,
  FiUsers,
} from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";
import { toast } from "react-toastify";
import { deleteManyApi, getApi } from "services/api";
import RentalUnitForm from "./components/RentalUnitForm";

const formatLabel = (value) => {
  if (!value) return "-";
  return value
    ?.split("_")
    ?.map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    ?.join(" ");
};

const getFriendlyError = (error, fallback) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;

  if (
    message?.toLowerCase()?.includes("network") ||
    message?.toLowerCase()?.includes("request failed") ||
    message?.toLowerCase()?.includes("500")
  ) {
    return fallback;
  }

  return message;
};

const getOwnerName = (unit) =>
  unit?.owner?.name || unit?.ownerName || unit?.owner || "No owner assigned";

const formatAmount = (value, currency) => {
  if (value === undefined || value === null || value === "") return "-";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return value;
  const amount = numericValue?.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  return currency ? `${currency} ${amount}` : amount;
};

const getStatusLabel = (status) => {
  if (status === "active") return "Available";
  return formatLabel(status);
};

const getStatusColor = (status) => {
  if (status === "active") return "green";
  if (status === "maintenance") return "orange";
  if (status === "inactive") return "red";
  return "gray";
};

const RentalUnits = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const subtleText = useColorModeValue("secondaryGray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const softBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const mutedBorder = useColorModeValue("gray.100", "whiteAlpha.100");
  const cancelRef = useRef();
  const [rentalUnits, setRentalUnits] = useState([]);
  const [owners, setOwners] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const [error, setError] = useState("");
  const [action, setAction] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [formMode, setFormMode] = useState("add");
  const [deleteModel, setDeleteModel] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const access = {
    create: true,
    update: true,
    delete: true,
    view: true,
    export: true,
  };

  const fetchRentalUnits = async () => {
    try {
      setIsLoding(true);
      setError("");
      const response = await getApi("api/rental-unit");
      if (response?.status === 200) {
        setRentalUnits(response?.data || []);
      } else {
        const message = getFriendlyError(
          response,
          "We could not load rental units. Please try again."
        );
        setError(message);
        toast.error(message);
      }
    } catch (e) {
      const message = getFriendlyError(
        e,
        "We could not load rental units. Please try again."
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsLoding(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await getApi("api/owner");
      if (response?.status === 200) {
        setOwners(response?.data || []);
      } else {
        toast.error("Owner dropdown could not be loaded.");
      }
    } catch (e) {
      toast.error("Owner dropdown could not be loaded.");
    }
  };

  const openAdd = () => {
    setSelectedId();
    setFormMode("add");
    onOpen();
  };

  const openEdit = (id) => {
    setSelectedId(id);
    setFormMode("edit");
    onOpen();
  };

  const handleDeleteRentalUnits = async (ids) => {
    try {
      setIsLoding(true);
      setError("");
      const deleteIds = Array.isArray(ids) ? ids : selectedValues;
      const response = await deleteManyApi("api/rental-unit/deleteMany", deleteIds);
      if (response?.status === 200) {
        setSelectedValues([]);
        setDeleteModel(false);
        toast.success(
          deleteIds?.length > 1
            ? "Selected rental units were deleted."
            : "Rental unit deleted."
        );
        setAction((pre) => !pre);
      } else {
        const message = getFriendlyError(
          response,
          "We could not delete the selected rental unit. Please try again."
        );
        setError(message);
        toast.error(message);
      }
    } catch (e) {
      const message = getFriendlyError(
        e,
        "We could not delete the selected rental unit. Please try again."
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsLoding(false);
    }
  };

  const availableUnits = rentalUnits?.filter(
    (unit) => unit?.status === "active"
  )?.length;
  const inactiveUnits = rentalUnits?.filter(
    (unit) => unit?.status === "inactive"
  )?.length;
  const maintenanceUnits = rentalUnits?.filter(
    (unit) => unit?.status === "maintenance"
  )?.length;
  const averageNightlyRate =
    rentalUnits?.length > 0
      ? rentalUnits?.reduce(
          (sum, unit) => sum + Number(unit?.baseNightlyRate || 0),
          0
        ) / rentalUnits?.length
      : 0;

  const kpiCards = [
    {
      label: "Total Units",
      value: rentalUnits?.length || 0,
      helper: "Rentable inventory records",
      icon: LuBuilding2,
      color: "brand.500",
    },
    {
      label: "Available Units",
      value: availableUnits,
      helper: "Units currently marked available",
      icon: FiHome,
      color: "green.500",
    },
    {
      label: "Inactive Units",
      value: inactiveUnits,
      helper: "Units hidden from active operations",
      icon: FiTool,
      color: "red.500",
    },
    {
      label: "Average Nightly Rate",
      value: formatAmount(averageNightlyRate, rentalUnits?.[0]?.currency),
      helper: "Average base rate across all units",
      icon: FiDollarSign,
      color: "orange.500",
    },
  ];

  const filteredRentalUnits = useMemo(() => {
    const normalizedSearch = searchTerm?.trim()?.toLowerCase();

    return (rentalUnits || [])?.filter((unit) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "available" && unit?.status === "active") ||
        (activeFilter === "inactive" && unit?.status === "inactive") ||
        (activeFilter === "maintenance" && unit?.status === "maintenance");

      if (!matchesFilter) return false;
      if (!normalizedSearch) return true;

      return [
        unit?.name,
        unit?.code,
        getOwnerName(unit),
        unit?.unitType,
        unit?.status,
        unit?.address,
      ]
        ?.filter(Boolean)
        ?.join(" ")
        ?.toLowerCase()
        ?.includes(normalizedSearch);
    });
  }, [activeFilter, rentalUnits, searchTerm]);

  const quickFilters = [
    { label: "All", value: "all", count: rentalUnits?.length || 0 },
    { label: "Available", value: "available", count: availableUnits },
    { label: "Inactive", value: "inactive", count: inactiveUnits },
    { label: "Maintenance", value: "maintenance", count: maintenanceUnits },
  ];

  const selectedUnitNames = (rentalUnits || [])
    ?.filter((unit) => selectedValues?.includes(unit?._id))
    ?.map((unit) => unit?.name)
    ?.filter(Boolean);

  const actionHeader = {
    Header: "Actions",
    accessor: "action",
    isSortable: false,
    center: true,
    cell: ({ row }) => (
      <Box textAlign="center">
        <Menu isLazy>
          <MenuButton
            as={Button}
            variant="ghost"
            size="sm"
            minW="36px"
            h="36px"
            px={0}
          >
            <CiMenuKebab />
          </MenuButton>
          <MenuList minW="fit-content">
            <MenuItem
              py={2.5}
              icon={<EditIcon fontSize={15} mb={1} />}
              onClick={() => openEdit(row?.original?._id)}
            >
              Edit
            </MenuItem>
            <MenuItem
              py={2.5}
              color="green"
              icon={<ViewIcon mb={1} fontSize={15} />}
              onClick={() => openEdit(row?.original?._id)}
            >
              View
            </MenuItem>
            <MenuItem
              py={2.5}
              color="red"
              icon={<DeleteIcon fontSize={15} mb={1} />}
              onClick={() => {
                setSelectedValues([row?.original?._id]);
                setDeleteModel(true);
              }}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    ),
  };

  const tableColumns = [
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    {
      Header: "Unit Name",
      accessor: "name",
      cell: (cell) => (
        <HStack spacing={3} align="center">
          <Avatar
            name={cell?.value || "Unit"}
            size="sm"
            bg="brand.50"
            color="brand.500"
            fontWeight="700"
            icon={<LuBuilding2 />}
          />
          <Box minW={0}>
            <Text color="secondaryGray.900" fontWeight="800" noOfLines={1}>
              {cell?.value || "-"}
            </Text>
            <Text color="secondaryGray.600" fontSize="xs" fontWeight="600" noOfLines={1}>
              {cell?.row?.original?.address || "No address saved"}
            </Text>
          </Box>
        </HStack>
      ),
    },
    {
      Header: "Unit Code",
      accessor: "code",
      cell: (cell) => (
        <HStack spacing={2}>
          <FiHash size={13} />
          <Text color="secondaryGray.900" fontSize="sm" fontWeight="700">
            {cell?.value || "-"}
          </Text>
        </HStack>
      ),
    },
    {
      Header: "Owner",
      accessor: "owner",
      cell: (cell) => (
        <Stack spacing={1}>
          <Text color="secondaryGray.900" fontSize="sm" fontWeight="800" noOfLines={1}>
            {getOwnerName(cell?.row?.original)}
          </Text>
          <Text color="secondaryGray.600" fontSize="xs" noOfLines={1}>
            {cell?.row?.original?.owner?.phone || "No owner phone saved"}
          </Text>
        </Stack>
      ),
    },
    {
      Header: "Unit Type",
      accessor: "unitType",
      cell: (cell) => (
        <Badge colorScheme="blue" variant="subtle" w="fit-content">
          {formatLabel(cell?.value)}
        </Badge>
      ),
    },
    {
      Header: "Bedrooms",
      accessor: "bedrooms",
      cell: (cell) => cell?.value ?? "-",
    },
    {
      Header: "Bathrooms",
      accessor: "bathrooms",
      cell: (cell) => cell?.value ?? "-",
    },
    {
      Header: "Max Guests",
      accessor: "maxGuests",
      cell: (cell) => (
        <HStack spacing={2}>
          <FiUsers size={13} />
          <Text>{cell?.value ?? "-"}</Text>
        </HStack>
      ),
    },
    {
      Header: "Base Nightly Rate",
      accessor: "baseNightlyRate",
      cell: (cell) => (
        <Stack spacing={1}>
          <Text color="secondaryGray.900" fontSize="sm" fontWeight="800">
            {formatAmount(cell?.value, cell?.row?.original?.currency)}
          </Text>
          <Text color="secondaryGray.600" fontSize="xs">
            Per night
          </Text>
        </Stack>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      cell: (cell) => (
        <Badge colorScheme={getStatusColor(cell?.value)} variant="subtle" w="fit-content">
          {getStatusLabel(cell?.value)}
        </Badge>
      ),
    },
    actionHeader,
  ];

  useEffect(() => {
    fetchRentalUnits();
    fetchOwners();
  }, [action]);

  const handleRentalUnitSaved = (mode) => {
    toast.success(
      mode === "edit"
        ? "Rental unit updated."
        : "Rental unit created."
    );
    setAction((pre) => !pre);
  };

  return (
    <Box bg={pageBg} minH="100%" p={{ base: 3, md: 0 }}>
      {error && (
        <Alert status="error" mb={4} borderRadius="8px">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Flex
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="16px"
        mb={4}
        p={{ base: 4, md: 6 }}
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
        gap={4}
      >
        <Box>
          <HStack spacing={2} mb={2}>
            <Flex
              align="center"
              justify="center"
              bg="brand.50"
              color="brand.500"
              borderRadius="12px"
              h="40px"
              w="40px"
            >
              <LuBuilding2 />
            </Flex>
            <Heading size={{ base: "md", md: "lg" }} color="secondaryGray.900">
              Rental Units
            </Heading>
          </HStack>
          <Text color={subtleText} fontSize="sm" maxW="680px">
            Manage rentable properties, capacity, pricing, and owner assignments.
          </Text>
        </Box>
        <Button
          leftIcon={<FiPlus />}
          variant="brand"
          size="md"
          alignSelf={{ base: "stretch", md: "center" }}
          onClick={openAdd}
        >
          Add Rental Unit
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={4} mb={4}>
        {kpiCards?.map((card) => {
          const CardIcon = card?.icon;
          return (
            <Box
              key={card?.label}
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="16px"
              p={4}
              minH="132px"
            >
              <Flex direction="column" h="100%" justify="space-between" gap={3}>
                <Flex align="flex-start" justify="space-between" gap={3}>
                  <Box>
                    <Text color={subtleText} fontSize="xs" fontWeight="800" mb={2}>
                      {card?.label}
                    </Text>
                    {isLoding ? (
                      <Skeleton h="30px" w="74px" borderRadius="8px" />
                    ) : (
                      <Text color="secondaryGray.900" fontSize="3xl" fontWeight="900">
                        {card?.value}
                      </Text>
                    )}
                  </Box>
                  <Flex
                    align="center"
                    justify="center"
                    borderRadius="12px"
                    bg={softBg}
                    color={card?.color}
                    h="44px"
                    w="44px"
                    flexShrink={0}
                  >
                    <CardIcon size={20} />
                  </Flex>
                </Flex>
                <Text color={subtleText} fontSize="xs" fontWeight="600" lineHeight="1.5">
                  {card?.helper}
                </Text>
              </Flex>
            </Box>
          );
        })}
      </SimpleGrid>

      <Box
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="16px"
        p={{ base: 4, md: 5 }}
        mb={4}
      >
        <Flex
          direction={{ base: "column", lg: "row" }}
          align={{ base: "stretch", lg: "center" }}
          justify="space-between"
          gap={4}
        >
          <Box>
            <Text color="secondaryGray.900" fontWeight="800" fontSize="lg">
              Rental Unit Directory
            </Text>
            <Text color={subtleText} fontSize="sm" mt={1}>
              Search by unit, code, owner, address, or unit type.
            </Text>
          </Box>
          <InputGroup maxW={{ base: "100%", lg: "400px" }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event?.target?.value)}
              placeholder="Search rental units"
              borderRadius="12px"
              bg={softBg}
            />
          </InputGroup>
        </Flex>

        <Flex gap={2} mt={4} overflowX="auto" pb={1}>
          {quickFilters?.map((filter) => {
            const isActive = activeFilter === filter?.value;
            return (
              <Button
                key={filter?.value}
                size="sm"
                variant={isActive ? "brand" : "outline"}
                borderRadius="999px"
                flexShrink={0}
                onClick={() => setActiveFilter(filter?.value)}
              >
                {filter?.label}
                <Badge
                  ms={2}
                  colorScheme={isActive ? "whiteAlpha" : "gray"}
                  variant={isActive ? "solid" : "subtle"}
                  borderRadius="999px"
                >
                  {filter?.count}
                </Badge>
              </Button>
            );
          })}
        </Flex>

        {(searchTerm || activeFilter !== "all") && (
          <Text color={subtleText} fontSize="sm" mt={3}>
            Showing {filteredRentalUnits?.length} of {rentalUnits?.length || 0} units.
          </Text>
        )}
      </Box>

      {isLoding && rentalUnits?.length === 0 && (
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="16px"
          p={5}
          mb={4}
        >
          <Stack spacing={4}>
            <Skeleton h="22px" w="210px" borderRadius="8px" />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {[1, 2, 3]?.map((item) => (
                <Box
                  key={item}
                  border="1px solid"
                  borderColor={mutedBorder}
                  borderRadius="12px"
                  p={4}
                >
                  <Skeleton h="16px" w="70%" mb={3} />
                  <Skeleton h="14px" w="45%" />
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </Box>
      )}

      {!isLoding && rentalUnits?.length === 0 && (
        <Box
          bg={cardBg}
          border="1px dashed"
          borderColor={borderColor}
          borderRadius="16px"
          p={{ base: 5, md: 8 }}
          mb={4}
        >
          <Grid templateColumns="repeat(12, 1fr)" gap={4} alignItems="center">
            <GridItem colSpan={{ base: 12, md: 8 }}>
              <Flex
                align="center"
                justify="center"
                bg="brand.50"
                color="brand.500"
                borderRadius="14px"
                h="48px"
                w="48px"
                mb={4}
              >
                <LuBuilding2 size={22} />
              </Flex>
              <Text color="secondaryGray.900" fontWeight="900" fontSize="lg" mb={1}>
                Build your rental inventory
              </Text>
              <Text color={subtleText} fontSize="sm" maxW="600px">
                Add the first rental unit to track owner assignment, capacity,
                nightly pricing, fees, and operational status.
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 4 }} textAlign={{ base: "left", md: "right" }}>
              <Button leftIcon={<FiPlus />} variant="brand" size="md" onClick={openAdd}>
                Add Rental Unit
              </Button>
            </GridItem>
          </Grid>
        </Box>
      )}

      {!isLoding && rentalUnits?.length > 0 && filteredRentalUnits?.length === 0 && (
        <Box
          bg={cardBg}
          border="1px dashed"
          borderColor={borderColor}
          borderRadius="16px"
          p={6}
          mb={4}
          textAlign="center"
        >
          <Text color="secondaryGray.900" fontWeight="900" fontSize="lg" mb={1}>
            No rental units match this view
          </Text>
          <Text color={subtleText} fontSize="sm" mb={4}>
            Try a different search term or switch back to all units.
          </Text>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setActiveFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </Box>
      )}

      {(isLoding || filteredRentalUnits?.length > 0) && (
        <CommonCheckTable
          title="Rental Unit Directory"
          isLoding={isLoding}
          columnData={tableColumns}
          allData={filteredRentalUnits || []}
          tableData={filteredRentalUnits || []}
          tableCustomFields={[]}
          action={action}
          setAction={setAction}
          AdvanceSearch={false}
          customSearch={false}
          access={access}
          onOpen={openAdd}
          addBtn={false}
          emptyTitle="No rental units yet"
          emptyMessage="Add rentable inventory before creating reservations and tracking availability."
          emptyActionLabel="Add Rental Unit"
          onEmptyAction={openAdd}
          setDelete={setDeleteModel}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
        />
      )}

      <RentalUnitForm
        isOpen={isOpen}
        onClose={onClose}
        selectedId={selectedId}
        mode={formMode}
        owners={owners}
        onSaved={handleRentalUnitSaved}
      />

      <AlertDialog
        isOpen={deleteModel}
        leastDestructiveRef={cancelRef}
        onClose={() => setDeleteModel(false)}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="800">
            Delete rental unit?
          </AlertDialogHeader>
          <AlertDialogBody color={subtleText}>
            {selectedValues?.length > 1
              ? `This will remove ${selectedValues?.length} rental units from the directory.`
              : `This will remove ${
                  selectedUnitNames?.[0] || "this rental unit"
                } from the directory.`}{" "}
            Reservations, payments, and calendar behavior are not managed from this page.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} variant="outline" onClick={() => setDeleteModel(false)}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => handleDeleteRentalUnits(selectedValues)}
              isDisabled={isLoding}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default RentalUnits;
