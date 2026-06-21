import { DeleteIcon, EditIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import CommonCheckTable from "components/reactTable/checktable";
import { useEffect, useMemo, useRef, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import {
  FiCreditCard,
  FiMail,
  FiMessageCircle,
  FiPhone,
  FiPlus,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import { MdOutlineContactPhone, MdPercent } from "react-icons/md";
import { toast } from "react-toastify";
import { deleteManyApi, getApi } from "services/api";
import OwnerForm from "./components/OwnerForm";

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

const hasBankDetails = (owner) =>
  Boolean(owner?.bankName || owner?.bankAccountName || owner?.bankAccountNumber);

const hasCommission = (owner) =>
  Boolean(owner?.commissionType && owner?.commissionType !== "none");

const hasMissingContact = (owner) =>
  !owner?.phone && !owner?.whatsapp && !owner?.email;

const Owners = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const subtleText = useColorModeValue("secondaryGray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const softBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const mutedBorder = useColorModeValue("gray.100", "whiteAlpha.100");
  const cancelRef = useRef();
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

  const fetchOwners = async () => {
    try {
      setIsLoding(true);
      setError("");
      const response = await getApi("api/owner");
      if (response?.status === 200) {
        setOwners(response?.data || []);
      } else {
        const message = getFriendlyError(
          response,
          "We could not load owners. Please try again."
        );
        setError(message);
        toast.error(message);
      }
    } catch (e) {
      const message = getFriendlyError(
        e,
        "We could not load owners. Please try again."
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsLoding(false);
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

  const handleDeleteOwners = async (ids) => {
    try {
      setIsLoding(true);
      setError("");
      const deleteIds = Array.isArray(ids) ? ids : selectedValues;
      const response = await deleteManyApi("api/owner/deleteMany", deleteIds);
      if (response?.status === 200) {
        setSelectedValues([]);
        setDeleteModel(false);
        toast.success(
          deleteIds?.length > 1
            ? "Selected owners were deleted."
            : "Owner profile deleted."
        );
        setAction((pre) => !pre);
      } else {
        const message = getFriendlyError(
          response,
          "We could not delete the selected owner. Please try again."
        );
        setError(message);
        toast.error(message);
      }
    } catch (e) {
      const message = getFriendlyError(
        e,
        "We could not delete the selected owner. Please try again."
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsLoding(false);
    }
  };

  const ownersWithBankDetails = owners?.filter(hasBankDetails)?.length;

  const commissionBasedOwners = owners?.filter(hasCommission)?.length;

  const missingContactInfo = owners?.filter(hasMissingContact)?.length;

  const kpiCards = [
    {
      label: "Total Owners",
      value: owners?.length || 0,
      helper: "Active owner records in the directory",
      icon: FiUsers,
      color: "brand.500",
    },
    {
      label: "Owners With Bank Details",
      value: ownersWithBankDetails,
      helper: "Ready for bank payout tracking",
      icon: FiCreditCard,
      color: "green.500",
    },
    {
      label: "Commission-Based Owners",
      value: commissionBasedOwners,
      helper: "Owners with percentage or fixed commission rules",
      icon: MdPercent,
      color: "orange.500",
    },
    {
      label: "Missing Contact Info",
      value: missingContactInfo,
      helper: "Need phone, WhatsApp, or email details",
      icon: MdOutlineContactPhone,
      color: missingContactInfo > 0 ? "red.500" : "green.500",
    },
  ];

  const filteredOwners = useMemo(() => {
    const normalizedSearch = searchTerm?.trim()?.toLowerCase();

    return (owners || [])?.filter((owner) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "missing_contact" && hasMissingContact(owner)) ||
        (activeFilter === "bank_details" && hasBankDetails(owner)) ||
        (activeFilter === "commission_based" && hasCommission(owner));

      if (!matchesFilter) return false;
      if (!normalizedSearch) return true;

      return [
        owner?.name,
        owner?.phone,
        owner?.whatsapp,
        owner?.email,
        owner?.nationalId,
        owner?.payoutMethod,
        owner?.commissionType,
        owner?.bankName,
        owner?.bankAccountName,
        owner?.bankAccountNumber,
      ]
        ?.filter(Boolean)
        ?.join(" ")
        ?.toLowerCase()
        ?.includes(normalizedSearch);
    });
  }, [activeFilter, owners, searchTerm]);

  const quickFilters = [
    { label: "All Owners", value: "all", count: owners?.length || 0 },
    {
      label: "Missing Contact Info",
      value: "missing_contact",
      count: missingContactInfo,
    },
    {
      label: "With Bank Details",
      value: "bank_details",
      count: ownersWithBankDetails,
    },
    {
      label: "Commission-Based",
      value: "commission_based",
      count: commissionBasedOwners,
    },
  ];

  const selectedOwnerNames = (owners || [])
    ?.filter((owner) => selectedValues?.includes(owner?._id))
    ?.map((owner) => owner?.name)
    ?.filter(Boolean);

  const actionHeader = {
    Header: "Action",
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
      Header: "Owner",
      accessor: "name",
      cell: (cell) => (
        <HStack spacing={3} align="center">
          <Avatar
            name={cell?.value || "Owner"}
            size="sm"
            bg="brand.50"
            color="brand.500"
            fontWeight="700"
          />
          <Box minW={0}>
            <Text color="secondaryGray.900" fontWeight="800" noOfLines={1}>
              {cell?.value || "-"}
            </Text>
            <Text color="secondaryGray.600" fontSize="xs" fontWeight="600" noOfLines={1}>
              {cell?.row?.original?.nationalId || "No national ID saved"}
            </Text>
          </Box>
        </HStack>
      ),
    },
    {
      Header: "Contact",
      accessor: "phone",
      cell: (cell) => (
        <Stack spacing={1}>
          <HStack spacing={2}>
            <FiPhone size={13} />
            <Text fontSize="sm" color="secondaryGray.900" noOfLines={1}>
              {cell?.row?.original?.phone || "No phone"}
            </Text>
          </HStack>
          <HStack spacing={2}>
            <FiMessageCircle size={13} />
            <Text fontSize="xs" color="secondaryGray.600" noOfLines={1}>
              {cell?.row?.original?.whatsapp || "No WhatsApp"}
            </Text>
          </HStack>
          <HStack spacing={2}>
            <FiMail size={13} />
            <Text fontSize="xs" color="secondaryGray.600" noOfLines={1}>
              {cell?.row?.original?.email || "No email"}
            </Text>
          </HStack>
        </Stack>
      ),
    },
    {
      Header: "Payout",
      accessor: "payoutMethod",
      cell: (cell) => {
        const schedule = cell?.row?.original?.payoutSchedule;
        return (
          <Stack spacing={1}>
            <Badge colorScheme="blue" variant="subtle" w="fit-content">
              {formatLabel(cell?.value)}
            </Badge>
            <Text color="secondaryGray.600" fontSize="xs" noOfLines={1}>
              {schedule || "No schedule saved"}
            </Text>
          </Stack>
        );
      },
    },
    {
      Header: "Commission",
      accessor: "commissionType",
      cell: (cell) => {
        const type = cell?.value || "none";
        const value = cell?.row?.original?.commissionValue;
        const color =
          type === "percentage" ? "green" : type === "fixed" ? "orange" : "gray";
        const displayValue =
          type === "none" || value === undefined || value === null || value === ""
            ? "No commission"
            : type === "percentage"
              ? `${value}%`
              : value;

        return (
          <Stack spacing={1}>
            <Badge colorScheme={color} variant="subtle" w="fit-content">
              {formatLabel(type)}
            </Badge>
            <Text color="secondaryGray.600" fontSize="xs" noOfLines={1}>
              {displayValue}
            </Text>
          </Stack>
        );
      },
    },
    {
      Header: "Bank Details",
      accessor: "bankName",
      cell: (cell) => {
        const hasBank =
          cell?.row?.original?.bankName ||
          cell?.row?.original?.bankAccountName ||
          cell?.row?.original?.bankAccountNumber;
        return (
          <Stack spacing={1}>
            <Badge colorScheme={hasBank ? "green" : "red"} variant="subtle" w="fit-content">
              {hasBank ? "Complete" : "Missing"}
            </Badge>
            <Text color="secondaryGray.600" fontSize="xs" noOfLines={1}>
              {cell?.row?.original?.bankName || "No bank saved"}
            </Text>
          </Stack>
        );
      },
    },
    actionHeader,
  ];

  useEffect(() => {
    fetchOwners();
  }, [action]);

  const handleOwnerSaved = (mode) => {
    toast.success(
      mode === "edit"
        ? "Owner profile updated."
        : "Owner profile created."
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
              <FiUserCheck />
            </Flex>
            <Heading size={{ base: "md", md: "lg" }} color="secondaryGray.900">
              Owners
            </Heading>
          </HStack>
          <Text color={subtleText} fontSize="sm" maxW="620px">
            Manage property owners, payout details, and commission rules.
          </Text>
        </Box>
        <Button
          leftIcon={<FiPlus />}
          variant="brand"
          size="md"
          alignSelf={{ base: "stretch", md: "center" }}
          onClick={openAdd}
        >
          Add Owner
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
                      <Skeleton h="30px" w="52px" borderRadius="8px" />
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
              Owner Directory
            </Text>
            <Text color={subtleText} fontSize="sm" mt={1}>
              Search and filter owner records before opening the full table.
            </Text>
          </Box>
          <InputGroup maxW={{ base: "100%", lg: "360px" }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event?.target?.value)}
              placeholder="Search owners, contacts, payout details"
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
            Showing {filteredOwners?.length} of {owners?.length || 0} owners.
          </Text>
        )}
      </Box>

      {isLoding && owners?.length === 0 && (
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="16px"
          p={5}
          mb={4}
        >
          <Stack spacing={4}>
            <Skeleton h="22px" w="180px" borderRadius="8px" />
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

      {!isLoding && owners?.length === 0 && (
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
                <FiUsers size={22} />
              </Flex>
              <Text color="secondaryGray.900" fontWeight="900" fontSize="lg" mb={1}>
                Build your owner directory
              </Text>
              <Text color={subtleText} fontSize="sm" maxW="560px">
                Add the first property owner to track contact details, payout preferences,
                and commission settings in one organized profile.
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 4 }} textAlign={{ base: "left", md: "right" }}>
              <Button leftIcon={<FiPlus />} variant="brand" size="md" onClick={openAdd}>
                Add Owner
              </Button>
            </GridItem>
          </Grid>
        </Box>
      )}

      {!isLoding && owners?.length > 0 && filteredOwners?.length === 0 && (
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
            No owners match this view
          </Text>
          <Text color={subtleText} fontSize="sm" mb={4}>
            Try a different search term or switch back to all owners.
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

      {(isLoding || filteredOwners?.length > 0) && (
        <CommonCheckTable
          title="Owner Directory"
          isLoding={isLoding}
          columnData={tableColumns}
          allData={filteredOwners || []}
          tableData={filteredOwners || []}
          tableCustomFields={[]}
          action={action}
          setAction={setAction}
          AdvanceSearch={false}
          customSearch={false}
          access={access}
          onOpen={openAdd}
          addBtn={false}
          emptyTitle="No owners yet"
          emptyMessage="Add owners to manage contact details, payout preferences, and commission rules."
          emptyActionLabel="Add Owner"
          onEmptyAction={openAdd}
          setDelete={setDeleteModel}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
        />
      )}
      <OwnerForm
        isOpen={isOpen}
        onClose={onClose}
        selectedId={selectedId}
        mode={formMode}
        onSaved={handleOwnerSaved}
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
            Delete owner profile?
          </AlertDialogHeader>
          <AlertDialogBody color={subtleText}>
            {selectedValues?.length > 1
              ? `This will remove ${selectedValues?.length} owner profiles from the directory.`
              : `This will remove ${
                  selectedOwnerNames?.[0] || "this owner"
                } from the directory.`}{" "}
            Existing backend records linked to this owner will not be edited from this page.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} variant="outline" onClick={() => setDeleteModel(false)}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => handleDeleteOwners(selectedValues)}
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

export default Owners;
