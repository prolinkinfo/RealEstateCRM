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
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiHash,
  FiPlus,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { deleteManyApi, getApi } from "services/api";
import ReservationForm from "./components/ReservationForm";

const formatLabel = (value) => {
  if (!value) return "-";
  return value
    ?.split("_")
    ?.map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    ?.join(" ");
};

const getFriendlyError = (error, fallback) => {
  const status = error?.response?.status;
  if (status === 409) {
    return "This unit already has a confirmed reservation for the selected date range.";
  }

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

const findContactValue = (contact, preferredKeys) => {
  for (const key of preferredKeys) {
    if (contact?.[key]) return contact?.[key];
  }

  const dynamicKey = Object.keys(contact || {})?.find((key) =>
    preferredKeys?.some((preferredKey) =>
      key?.toLowerCase()?.includes(preferredKey?.toLowerCase())
    )
  );

  return dynamicKey ? contact?.[dynamicKey] : "";
};

const getGuestName = (guest) => {
  if (!guest) return "No guest selected";
  if (typeof guest === "string") return guest;

  const fullName = [guest?.title, guest?.firstName, guest?.lastName]
    ?.filter(Boolean)
    ?.join(" ")
    ?.trim();

  return (
    guest?.name ||
    guest?.contactName ||
    fullName ||
    findContactValue(guest, ["guestName", "contactName", "fullName", "name"]) ||
    guest?.email ||
    findContactValue(guest, ["email"]) ||
    guest?.phoneNumber ||
    guest?.mobileNumber ||
    findContactValue(guest, ["phone", "mobile"]) ||
    "Guest"
  );
};

const getGuestContact = (guest) =>
  guest?.email ||
  findContactValue(guest, ["email"]) ||
  guest?.phoneNumber ||
  guest?.mobileNumber ||
  findContactValue(guest, ["phone", "mobile"]) ||
  "No contact saved";

const getUnitName = (reservation) =>
  reservation?.unit?.name || reservation?.unitName || reservation?.unit || "No unit selected";

const getOwnerName = (reservation) =>
  reservation?.owner?.name ||
  reservation?.unit?.owner?.name ||
  reservation?.ownerName ||
  "No owner assigned";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatAmount = (value, currency) => {
  if (value === undefined || value === null || value === "") return "-";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return value;
  const amount = numericValue?.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  return currency ? `${currency} ${amount}` : amount;
};

const getStatusColor = (status) => {
  if (status === "confirmed" || status === "checked_in") return "green";
  if (status === "tentative" || status === "inquiry") return "blue";
  if (status === "checked_out") return "purple";
  if (status === "cancelled" || status === "no_show") return "red";
  return "gray";
};

const getPaymentStatusColor = (status) => {
  if (status === "paid") return "green";
  if (status === "partial") return "orange";
  if (status === "refunded") return "purple";
  if (status === "unpaid") return "red";
  return "gray";
};

const getStayStatus = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return "Dates Pending";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  checkIn.setHours(0, 0, 0, 0);
  checkOut.setHours(0, 0, 0, 0);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    return "Dates Pending";
  }

  if (today < checkIn) return "Upcoming";
  if (today.getTime() === checkIn.getTime()) return "Check-in Today";
  if (today > checkIn && today < checkOut) return "In-house";
  if (today.getTime() === checkOut.getTime()) return "Check-out Today";
  return "Completed";
};

const getStayStatusColor = (stayStatus) => {
  if (stayStatus === "Upcoming") return "blue";
  if (stayStatus === "Check-in Today") return "green";
  if (stayStatus === "In-house") return "purple";
  if (stayStatus === "Check-out Today") return "orange";
  if (stayStatus === "Completed") return "gray";
  return "gray";
};

const getContactApiPath = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.name || user?.role;
  return role === "superAdmin"
    ? "api/contact/"
    : `api/contact/?createBy=${user?._id}`;
};

const normalizeApiList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data?.data;
  if (Array.isArray(data?.result)) return data?.result;
  return [];
};

const Reservations = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const subtleText = useColorModeValue("secondaryGray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const softBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const mutedBorder = useColorModeValue("gray.100", "whiteAlpha.100");
  const cancelRef = useRef();
  const [reservations, setReservations] = useState([]);
  const [rentalUnits, setRentalUnits] = useState([]);
  const [contacts, setContacts] = useState([]);
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

  const fetchReservations = async () => {
    try {
      setIsLoding(true);
      setError("");
      const response = await getApi("api/reservation");
      if (response?.status === 200) {
        setReservations(normalizeApiList(response?.data));
      } else {
        const message = getFriendlyError(
          response,
          "We could not load reservations. Please try again."
        );
        setError(message);
        toast.error(message);
      }
    } catch (e) {
      const message = getFriendlyError(
        e,
        "We could not load reservations. Please try again."
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsLoding(false);
    }
  };

  const fetchRentalUnits = async () => {
    try {
      const response = await getApi("api/rental-unit");
      if (response?.status === 200) {
        setRentalUnits(normalizeApiList(response?.data));
      } else {
        toast.error("Rental unit dropdown could not be loaded.");
      }
    } catch (e) {
      toast.error("Rental unit dropdown could not be loaded.");
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await getApi(getContactApiPath());
      if (response?.status === 200) {
        setContacts(normalizeApiList(response?.data));
      } else {
        toast.error("Guest dropdown could not be loaded.");
      }
    } catch (e) {
      toast.error("Guest dropdown could not be loaded.");
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

  const handleDeleteReservations = async (ids) => {
    try {
      setIsLoding(true);
      setError("");
      const deleteIds = Array.isArray(ids) ? ids : selectedValues;
      const response = await deleteManyApi("api/reservation/deleteMany", deleteIds);
      if (response?.status === 200) {
        setSelectedValues([]);
        setDeleteModel(false);
        toast.success(
          deleteIds?.length > 1
            ? "Selected reservations were deleted."
            : "Reservation deleted."
        );
        setAction((pre) => !pre);
      } else {
        const message = getFriendlyError(
          response,
          "We could not delete the selected reservation. Please try again."
        );
        setError(message);
        toast.error(message);
      }
    } catch (e) {
      const message = getFriendlyError(
        e,
        "We could not delete the selected reservation. Please try again."
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsLoding(false);
    }
  };

  const confirmedReservations = reservations?.filter(
    (reservation) => reservation?.status === "confirmed"
  )?.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingCheckIns = reservations?.filter((reservation) => {
    const checkInDate = new Date(reservation?.checkInDate);
    return (
      reservation?.status === "confirmed" &&
      !Number.isNaN(checkInDate.getTime()) &&
      checkInDate >= today
    );
  })?.length;
  const outstandingBalance = reservations?.reduce(
    (sum, reservation) => sum + Number(reservation?.balanceDue || 0),
    0
  );

  const kpiCards = [
    {
      label: "Total Reservations",
      value: reservations?.length || 0,
      helper: "All guest booking records",
      icon: FiCalendar,
      color: "brand.500",
    },
    {
      label: "Confirmed Reservations",
      value: confirmedReservations,
      helper: "Bookings with confirmed status",
      icon: FiCheckCircle,
      color: "green.500",
    },
    {
      label: "Upcoming Check-ins",
      value: upcomingCheckIns,
      helper: "Confirmed arrivals from today onward",
      icon: FiClock,
      color: "blue.500",
    },
    {
      label: "Outstanding Balance",
      value: formatAmount(outstandingBalance),
      helper: "Total balance due across reservations",
      icon: FiDollarSign,
      color: outstandingBalance > 0 ? "orange.500" : "green.500",
    },
  ];

  const filteredReservations = useMemo(() => {
    const normalizedSearch = searchTerm?.trim()?.toLowerCase();

    return (reservations || [])?.filter((reservation) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "confirmed" && reservation?.status === "confirmed") ||
        (activeFilter === "tentative" && reservation?.status === "tentative") ||
        (activeFilter === "inquiry" && reservation?.status === "inquiry") ||
        (activeFilter === "cancelled" && reservation?.status === "cancelled");

      if (!matchesFilter) return false;
      if (!normalizedSearch) return true;

      return [
        reservation?.reservationCode,
        getUnitName(reservation),
        getGuestName(reservation?.guest),
        reservation?.source,
        reservation?.status,
        reservation?.paymentStatus,
      ]
        ?.filter(Boolean)
        ?.join(" ")
        ?.toLowerCase()
        ?.includes(normalizedSearch);
    });
  }, [activeFilter, reservations, searchTerm]);

  const quickFilters = [
    { label: "All", value: "all", count: reservations?.length || 0 },
    {
      label: "Confirmed",
      value: "confirmed",
      count: confirmedReservations,
    },
    {
      label: "Tentative",
      value: "tentative",
      count: reservations?.filter((reservation) => reservation?.status === "tentative")?.length,
    },
    {
      label: "Inquiry",
      value: "inquiry",
      count: reservations?.filter((reservation) => reservation?.status === "inquiry")?.length,
    },
    {
      label: "Cancelled",
      value: "cancelled",
      count: reservations?.filter((reservation) => reservation?.status === "cancelled")?.length,
    },
  ];

  const selectedReservationCodes = (reservations || [])
    ?.filter((reservation) => selectedValues?.includes(reservation?._id))
    ?.map((reservation) => reservation?.reservationCode)
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
      Header: "Reservation Code",
      accessor: "reservationCode",
      cell: (cell) => (
        <HStack spacing={3} align="center">
          <Avatar
            name={cell?.value || "Reservation"}
            size="sm"
            bg="brand.50"
            color="brand.500"
            fontWeight="700"
            icon={<FiHash />}
          />
          <Box minW={0}>
            <Text color="secondaryGray.900" fontWeight="800" noOfLines={1}>
              {cell?.value || "-"}
            </Text>
            <Text color="secondaryGray.600" fontSize="xs" fontWeight="600" noOfLines={1}>
              {formatLabel(cell?.row?.original?.source || "direct")}
            </Text>
          </Box>
        </HStack>
      ),
    },
    {
      Header: "Rental Unit",
      accessor: "unit",
      cell: (cell) => (
        <Stack spacing={1}>
          <Text color="secondaryGray.900" fontSize="sm" fontWeight="800" noOfLines={1}>
            {getUnitName(cell?.row?.original)}
          </Text>
          <Text color="secondaryGray.600" fontSize="xs" noOfLines={1}>
            {cell?.row?.original?.unit?.code || "No unit code saved"}
          </Text>
        </Stack>
      ),
    },
    {
      Header: "Guest",
      accessor: "guest",
      cell: (cell) => (
        <Stack spacing={1}>
          <HStack spacing={2}>
            <FiUser size={13} />
            <Text color="secondaryGray.900" fontSize="sm" fontWeight="800" noOfLines={1}>
              {getGuestName(cell?.value)}
            </Text>
          </HStack>
          <Text color="secondaryGray.600" fontSize="xs" noOfLines={1}>
            {getGuestContact(cell?.value)}
          </Text>
        </Stack>
      ),
    },
    {
      Header: "Owner",
      accessor: "owner",
      cell: (cell) => (
        <Text color="secondaryGray.900" fontSize="sm" fontWeight="700" noOfLines={1}>
          {getOwnerName(cell?.row?.original)}
        </Text>
      ),
    },
    {
      Header: "Check-in",
      accessor: "checkInDate",
      cell: (cell) => formatDate(cell?.value),
    },
    {
      Header: "Check-out",
      accessor: "checkOutDate",
      cell: (cell) => formatDate(cell?.value),
    },
    {
      Header: "Nights",
      accessor: "nights",
      cell: (cell) => cell?.value ?? "-",
    },
    {
      Header: "Status",
      accessor: "status",
      cell: (cell) => (
        <Badge colorScheme={getStatusColor(cell?.value)} variant="subtle" w="fit-content">
          {formatLabel(cell?.value)}
        </Badge>
      ),
    },
    {
      Header: "Stay Status",
      accessor: "stayStatus",
      isSortable: false,
      cell: (cell) => {
        const stayStatus = getStayStatus(
          cell?.row?.original?.checkInDate,
          cell?.row?.original?.checkOutDate
        );
        return (
          <Badge colorScheme={getStayStatusColor(stayStatus)} variant="subtle" w="fit-content">
            {stayStatus}
          </Badge>
        );
      },
    },
    {
      Header: "Total Amount",
      accessor: "totalAmount",
      cell: (cell) => formatAmount(cell?.value),
    },
    {
      Header: "Deposit Paid",
      accessor: "depositPaid",
      cell: (cell) => formatAmount(cell?.value),
    },
    {
      Header: "Balance Due",
      accessor: "balanceDue",
      cell: (cell) => (
        <Text color={Number(cell?.value || 0) > 0 ? "orange.500" : "green.500"} fontWeight="800">
          {formatAmount(cell?.value)}
        </Text>
      ),
    },
    {
      Header: "Payment Status",
      accessor: "paymentStatus",
      cell: (cell) => (
        <Badge colorScheme={getPaymentStatusColor(cell?.value)} variant="subtle" w="fit-content">
          {formatLabel(cell?.value)}
        </Badge>
      ),
    },
    actionHeader,
  ];

  useEffect(() => {
    fetchReservations();
    fetchRentalUnits();
    fetchContacts();
  }, [action]);

  const handleReservationSaved = (mode) => {
    toast.success(
      mode === "edit"
        ? "Reservation updated."
        : "Reservation created."
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
              <FiCalendar />
            </Flex>
            <Heading size={{ base: "md", md: "lg" }} color="secondaryGray.900">
              Reservations
            </Heading>
          </HStack>
          <Text color={subtleText} fontSize="sm" maxW="720px">
            Manage guest bookings, stay dates, payments, and reservation status.
          </Text>
        </Box>
        <Button
          leftIcon={<FiPlus />}
          variant="brand"
          size="md"
          alignSelf={{ base: "stretch", md: "center" }}
          onClick={openAdd}
        >
          Add Reservation
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
              Reservation Directory
            </Text>
            <Text color={subtleText} fontSize="sm" mt={1}>
              Search by reservation code, unit, guest, source, or payment status.
            </Text>
          </Box>
          <InputGroup maxW={{ base: "100%", lg: "420px" }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event?.target?.value)}
              placeholder="Search reservations"
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
            Showing {filteredReservations?.length} of {reservations?.length || 0} reservations.
          </Text>
        )}
      </Box>

      {isLoding && reservations?.length === 0 && (
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="16px"
          p={5}
          mb={4}
        >
          <Stack spacing={4}>
            <Skeleton h="22px" w="220px" borderRadius="8px" />
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

      {!isLoding && reservations?.length === 0 && (
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
                <FiCalendar size={22} />
              </Flex>
              <Text color="secondaryGray.900" fontWeight="900" fontSize="lg" mb={1}>
                Start tracking reservations
              </Text>
              <Text color={subtleText} fontSize="sm" maxW="620px">
                Add the first reservation to manage guest details, stay dates,
                status, deposits, and balance due from one organized record.
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 4 }} textAlign={{ base: "left", md: "right" }}>
              <Button leftIcon={<FiPlus />} variant="brand" size="md" onClick={openAdd}>
                Add Reservation
              </Button>
            </GridItem>
          </Grid>
        </Box>
      )}

      {!isLoding && reservations?.length > 0 && filteredReservations?.length === 0 && (
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
            No reservations match this view
          </Text>
          <Text color={subtleText} fontSize="sm" mb={4}>
            Try a different search term or switch back to all reservations.
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

      {(isLoding || filteredReservations?.length > 0) && (
        <CommonCheckTable
          title="Reservation Directory"
          isLoding={isLoding}
          columnData={tableColumns}
          allData={filteredReservations || []}
          tableData={filteredReservations || []}
          tableCustomFields={[]}
          action={action}
          setAction={setAction}
          AdvanceSearch={false}
          customSearch={false}
          access={access}
          onOpen={openAdd}
          addBtn={false}
          emptyTitle="No reservations yet"
          emptyMessage="Create the first booking to track guests, stay dates, deposits, and balances."
          emptyActionLabel="Add Reservation"
          onEmptyAction={openAdd}
          setDelete={setDeleteModel}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
        />
      )}

      <ReservationForm
        isOpen={isOpen}
        onClose={onClose}
        selectedId={selectedId}
        mode={formMode}
        rentalUnits={rentalUnits}
        contacts={contacts}
        onSaved={handleReservationSaved}
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
            Delete reservation?
          </AlertDialogHeader>
          <AlertDialogBody color={subtleText}>
            {selectedValues?.length > 1
              ? `This will remove ${selectedValues?.length} reservations from the directory.`
              : `This will remove ${
                  selectedReservationCodes?.[0] || "this reservation"
                } from the directory.`}{" "}
            Payments and booking calendar behavior are not managed from this page.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} variant="outline" onClick={() => setDeleteModel(false)}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => handleDeleteReservations(selectedValues)}
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

export default Reservations;
