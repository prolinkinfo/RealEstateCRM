import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  MdAdd,
  MdArrowForward,
  MdCalendarToday,
  MdEventAvailable,
  MdHomeWork,
  MdPeopleAlt,
  MdWarningAmber,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getApi } from "services/api";

const normalizeList = (response, keys = []) => {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data?.[key])) return data.data[key];
  }

  return [];
};

const numberValue = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatNumber = (value) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(
    numberValue(value),
  );

const formatDate = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const startOfDay = (date = new Date()) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const normalizeStatus = (value) => String(value || "").toLowerCase();

const isSameDay = (value, target = new Date()) => {
  const date = startOfDay(new Date(value));
  return !Number.isNaN(date.getTime()) && date.getTime() === startOfDay(target).getTime();
};

const isUpcoming = (reservation) => {
  const checkIn = startOfDay(new Date(reservation?.checkInDate));
  return !Number.isNaN(checkIn.getTime()) && checkIn >= startOfDay();
};

const statusMeta = (status) => {
  const normalized = normalizeStatus(status);
  const labels = {
    inquiry: "Inquiry",
    tentative: "Tentative",
    confirmed: "Confirmed",
    checked_in: "Checked In",
    checked_out: "Checked Out",
    cancelled: "Cancelled",
    no_show: "No Show",
  };
  const colors = {
    inquiry: "blue",
    tentative: "yellow",
    confirmed: "green",
    checked_in: "purple",
    checked_out: "gray",
    cancelled: "red",
    no_show: "red",
  };

  return {
    label: labels[normalized] || status || "Unknown",
    colorScheme: colors[normalized] || "gray",
  };
};

const getUnitName = (reservation) =>
  reservation?.unit?.unitName ||
  reservation?.rentalUnit?.unitName ||
  reservation?.unitName ||
  reservation?.unit?.name ||
  "Unassigned unit";

const getGuestName = (reservation) =>
  reservation?.guest?.firstName ||
  reservation?.guest?.name ||
  reservation?.contact?.firstName ||
  reservation?.contact?.name ||
  reservation?.guestName ||
  "Guest not set";

const cardProps = {
  border: "1px solid",
  borderRadius: "20px",
  boxShadow: "0px 20px 50px rgba(15, 23, 42, 0.07)",
};

function KpiCard({ label, value, helper, icon, tone = "brand" }) {
  const cardBg = useColorModeValue("white", "navy.800");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const labelColor = useColorModeValue("gray.500", "secondaryGray.500");
  const valueColor = useColorModeValue("gray.900", "white");
  const iconBg = useColorModeValue(`${tone}.50`, "whiteAlpha.100");
  const iconColor = useColorModeValue(`${tone}.600`, `${tone}.200`);
  const accentColor = useColorModeValue(`${tone}.500`, `${tone}.300`);
  const subtleBg = useColorModeValue(
    "linear-gradient(180deg, #ffffff 0%, #fbfcff 100%)",
    "linear-gradient(180deg, rgba(17,28,68,0.98) 0%, rgba(11,20,48,0.98) 100%)",
  );

  return (
    <Box
      bg={subtleBg || cardBg}
      borderColor={borderColor}
      p="20px"
      position="relative"
      overflow="hidden"
      {...cardProps}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        h="3px"
        bg={accentColor}
        opacity="0.88"
      />
      <Flex justify="space-between" align="flex-start" gap="16px">
        <Box>
          <Text color={labelColor} fontSize="sm" fontWeight="700">
            {label}
          </Text>
          <Heading color={valueColor} size="lg" mt="8px">
            {value}
          </Heading>
          <Text color={labelColor} fontSize="xs" fontWeight="600" mt="8px">
            {helper}
          </Text>
        </Box>
        <Flex
          align="center"
          justify="center"
          w="44px"
          h="44px"
          borderRadius="14px"
          bg={iconBg}
          color={iconColor}
          flexShrink="0"
        >
          <Icon as={icon} w="22px" h="22px" />
        </Flex>
      </Flex>
    </Box>
  );
}

function SectionCard({ title, helper, action, children }) {
  const cardBg = useColorModeValue("white", "navy.800");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const mutedText = useColorModeValue("gray.500", "secondaryGray.500");

  return (
    <Box bg={cardBg} borderColor={borderColor} p="22px" h="100%" {...cardProps}>
      <Flex justify="space-between" align="flex-start" gap="16px" mb="18px">
        <Box>
          <Heading size="sm">{title}</Heading>
          {helper && (
            <Text color={mutedText} fontSize="sm" mt="6px">
              {helper}
            </Text>
          )}
        </Box>
        {action}
      </Flex>
      {children}
    </Box>
  );
}

function EmptyState({ title, description, actionLabel, onAction, icon = MdCalendarToday }) {
  const mutedText = useColorModeValue("gray.500", "secondaryGray.500");
  const emptyBg = useColorModeValue("white", "whiteAlpha.50");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const iconBg = useColorModeValue("brand.50", "whiteAlpha.100");

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      textAlign="center"
      border="1px dashed"
      borderColor={borderColor}
      bg={emptyBg}
      borderRadius="18px"
      py="34px"
      px="22px"
      minH="180px"
    >
      <Flex
        align="center"
        justify="center"
        w="50px"
        h="50px"
        borderRadius="16px"
        bg={iconBg}
        color="brand.500"
        mb="14px"
      >
        <Icon as={icon} w="24px" h="24px" />
      </Flex>
      <Heading size="sm">{title}</Heading>
      <Text color={mutedText} fontSize="sm" mt="8px" maxW="360px">
        {description}
      </Text>
      {actionLabel && (
        <Button
          mt="18px"
          size="sm"
          colorScheme="brand"
          leftIcon={<Icon as={MdAdd} />}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </Flex>
  );
}

function ReservationRow({ reservation }) {
  const textColor = useColorModeValue("gray.900", "white");
  const mutedText = useColorModeValue("gray.500", "secondaryGray.500");
  const borderColor = useColorModeValue("gray.100", "whiteAlpha.100");
  const status = statusMeta(reservation?.status);

  return (
    <Flex
      py="14px"
      borderBottom="1px solid"
      borderColor={borderColor}
      align={{ base: "flex-start", md: "center" }}
      justify="space-between"
      gap="16px"
      direction={{ base: "column", md: "row" }}
    >
      <Box>
        <Text color={textColor} fontWeight="800" fontSize="sm">
          {reservation?.reservationCode || "Reservation"}
        </Text>
        <Text color={mutedText} fontSize="xs" fontWeight="600" mt="4px">
          {getUnitName(reservation)} - {getGuestName(reservation)}
        </Text>
      </Box>
      <HStack spacing="10px" flexWrap="wrap">
        <Text color={mutedText} fontSize="xs" fontWeight="700">
          {formatDate(reservation?.checkInDate)} to {formatDate(reservation?.checkOutDate)}
        </Text>
        <Badge colorScheme={status.colorScheme} borderRadius="10px" px="9px" py="4px">
          {status.label}
        </Badge>
      </HStack>
    </Flex>
  );
}

function AttentionUnit({ unit }) {
  const textColor = useColorModeValue("gray.900", "white");
  const mutedText = useColorModeValue("gray.500", "secondaryGray.500");
  const status = normalizeStatus(unit?.status);
  const hasRate = numberValue(unit?.baseNightlyRate) > 0;

  return (
    <Flex align="center" justify="space-between" gap="14px" py="10px">
      <Box>
        <Text color={textColor} fontWeight="800" fontSize="sm">
          {unit?.unitName || unit?.name || "Rental unit"}
        </Text>
        <Text color={mutedText} fontSize="xs" fontWeight="600" mt="4px">
          {unit?.unitCode || "No code"} {hasRate ? "" : "- No nightly rate"}
        </Text>
      </Box>
      <Badge
        colorScheme={status === "maintenance" ? "orange" : status === "inactive" ? "red" : "gray"}
        borderRadius="10px"
        px="9px"
        py="4px"
      >
        {unit?.status || "Needs review"}
      </Badge>
    </Flex>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reservations, setReservations] = useState([]);
  const [rentalUnits, setRentalUnits] = useState([]);
  const [owners, setOwners] = useState([]);

  const pageBg = useColorModeValue("transparent", "navy.900");
  const headerBg = useColorModeValue(
    "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(239,246,255,0.84) 52%, rgba(240,253,250,0.76) 100%)",
    "linear-gradient(135deg, rgba(17,28,68,0.98) 0%, rgba(11,20,48,0.95) 100%)",
  );
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const mutedText = useColorModeValue("gray.500", "secondaryGray.500");
  const headerAccent = useColorModeValue("brand.500", "brand.300");
  const headerChipBg = useColorModeValue("whiteAlpha.800", "whiteAlpha.100");
  const headerChipColor = useColorModeValue("gray.700", "white");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    const [reservationResponse, rentalUnitResponse, ownerResponse] = await Promise.all([
      getApi("api/reservation"),
      getApi("api/rental-unit"),
      getApi("api/owner"),
    ]);

    const failedResponse = [reservationResponse, rentalUnitResponse, ownerResponse].find(
      (response) => response?.response || (response?.status && response.status >= 400),
    );

    if (failedResponse) {
      const status = failedResponse?.response?.status || failedResponse?.status;
      setError(
        status === 401 || status === 403
          ? "Dashboard data is protected. Please sign in again and retry."
          : "Dashboard data could not be loaded right now. Please check the backend connection and try again.",
      );
      setLoading(false);
      return;
    }

    setReservations(normalizeList(reservationResponse, ["reservations", "reservation"]));
    setRentalUnits(normalizeList(rentalUnitResponse, ["rentalUnits", "rentalUnit", "units"]));
    setOwners(normalizeList(ownerResponse, ["owners", "owner"]));
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const dashboardStats = useMemo(() => {
    const confirmedReservations = reservations.filter(
      (reservation) => normalizeStatus(reservation?.status) === "confirmed",
    );
    const activeReservations = reservations.filter(
      (reservation) => !["cancelled", "no_show"].includes(normalizeStatus(reservation?.status)),
    );
    const upcomingReservations = activeReservations
      .filter(isUpcoming)
      .sort((a, b) => new Date(a?.checkInDate) - new Date(b?.checkInDate));
    const todayCheckIns = activeReservations.filter((reservation) =>
      isSameDay(reservation?.checkInDate),
    );
    const todayCheckOuts = activeReservations.filter((reservation) =>
      isSameDay(reservation?.checkOutDate),
    );
    const unitsRequiringAttention = rentalUnits.filter((unit) => {
      const status = normalizeStatus(unit?.status);
      return status === "maintenance" || status === "inactive" || numberValue(unit?.baseNightlyRate) <= 0;
    });
    const availableUnits = rentalUnits.filter((unit) =>
      ["active", "available"].includes(normalizeStatus(unit?.status)),
    );
    const outstandingBalance = activeReservations.reduce((sum, reservation) => {
      if (reservation?.balanceDue !== undefined && reservation?.balanceDue !== null) {
        return sum + Math.max(numberValue(reservation.balanceDue), 0);
      }
      return sum + Math.max(
        numberValue(reservation?.totalAmount) - numberValue(reservation?.depositPaid),
        0,
      );
    }, 0);
    const recentReservations = [...reservations]
      .sort(
        (a, b) =>
          new Date(b?.createdAt || b?.updatedAt || b?.checkInDate) -
          new Date(a?.createdAt || a?.updatedAt || a?.checkInDate),
      )
      .slice(0, 5);

    return {
      confirmedReservations,
      upcomingReservations,
      todayCheckIns,
      todayCheckOuts,
      unitsRequiringAttention,
      availableUnits,
      outstandingBalance,
      recentReservations,
    };
  }, [reservations, rentalUnits]);

  const quickActions = [
    { label: "Add Reservation", path: "/reservations" },
    { label: "Add Rental Unit", path: "/rental-units" },
    { label: "Add Owner", path: "/owners" },
  ];

  if (loading) {
    return (
      <Box bg={pageBg}>
        <Skeleton height="170px" borderRadius="22px" mb="22px" />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing="18px" mb="22px">
          {[...Array(7)].map((_, index) => (
            <Skeleton key={index} height="138px" borderRadius="18px" />
          ))}
        </SimpleGrid>
        <Grid templateColumns="repeat(12, 1fr)" gap="18px">
          {[...Array(4)].map((_, index) => (
            <GridItem key={index} colSpan={{ base: 12, xl: index === 0 ? 7 : 5 }}>
              <Box p="22px" border="1px solid" borderColor={borderColor} borderRadius="18px">
                <SkeletonText noOfLines={5} spacing="4" />
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box bg={pageBg}>
      <Flex
        bg={headerBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="24px"
        boxShadow="0px 24px 60px rgba(15, 23, 42, 0.08)"
        p={{ base: "22px", md: "30px" }}
        mb="22px"
        direction={{ base: "column", xl: "row" }}
        align={{ base: "flex-start", xl: "center" }}
        justify="space-between"
        gap="20px"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          left="0"
          top="0"
          bottom="0"
          w="5px"
          bg={headerAccent}
        />
        <Box>
          <Text color={headerAccent} fontSize="sm" fontWeight="900" mb="8px">
            Rental Property Management CRM
          </Text>
          <Heading size="lg" letterSpacing="0">
            Dashboard
          </Heading>
          <Text color={mutedText} fontSize="md" mt="8px" maxW="620px">
            Overview of reservations, units, owners, and upcoming activity.
          </Text>
          <HStack spacing="10px" flexWrap="wrap" mt="16px">
            <Badge bg={headerChipBg} color={headerChipColor} borderRadius="999px" px="10px" py="5px">
              {dashboardStats.todayCheckIns.length} check-ins today
            </Badge>
            <Badge bg={headerChipBg} color={headerChipColor} borderRadius="999px" px="10px" py="5px">
              {dashboardStats.todayCheckOuts.length} check-outs today
            </Badge>
            <Badge bg={headerChipBg} color={headerChipColor} borderRadius="999px" px="10px" py="5px">
              {dashboardStats.unitsRequiringAttention.length} units need review
            </Badge>
          </HStack>
        </Box>
        <HStack spacing="10px" flexWrap="wrap">
          {quickActions.map((action) => (
            <Button
              key={action.path}
              colorScheme={action.label === "Add Reservation" ? "brand" : "gray"}
              variant={action.label === "Add Reservation" ? "solid" : "outline"}
              leftIcon={<Icon as={MdAdd} />}
              onClick={() => navigate(action.path)}
            >
              {action.label}
            </Button>
          ))}
        </HStack>
      </Flex>

      {error && (
        <Alert status="warning" borderRadius="16px" mb="22px">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing="18px" mb="22px">
        <KpiCard
          label="Total Reservations"
          value={formatNumber(reservations.length)}
          helper="All bookings in the system"
          icon={MdCalendarToday}
          tone="blue"
        />
        <KpiCard
          label="Confirmed Reservations"
          value={formatNumber(dashboardStats.confirmedReservations.length)}
          helper="Confirmed stays only"
          icon={MdEventAvailable}
          tone="green"
        />
        <KpiCard
          label="Upcoming Check-ins"
          value={formatNumber(dashboardStats.upcomingReservations.length)}
          helper="Active reservations from today forward"
          icon={MdArrowForward}
          tone="purple"
        />
        <KpiCard
          label="Outstanding Balance"
          value={formatNumber(dashboardStats.outstandingBalance)}
          helper="Open balance from active bookings"
          icon={MdWarningAmber}
          tone="orange"
        />
        <KpiCard
          label="Total Rental Units"
          value={formatNumber(rentalUnits.length)}
          helper="Bookable inventory records"
          icon={MdHomeWork}
          tone="brand"
        />
        <KpiCard
          label="Available Units"
          value={formatNumber(dashboardStats.availableUnits.length)}
          helper="Units marked active or available"
          icon={MdEventAvailable}
          tone="green"
        />
        <KpiCard
          label="Owners"
          value={formatNumber(owners.length)}
          helper="Owners connected to inventory"
          icon={MdPeopleAlt}
          tone="blue"
        />
      </SimpleGrid>

      {(reservations.length === 0 || rentalUnits.length === 0 || owners.length === 0) && (
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing="18px" mb="22px">
          {reservations.length === 0 && (
            <EmptyState
              title="No reservations yet"
              description="Create the first booking to start tracking stays, deposits, balances, and upcoming activity."
              actionLabel="Add Reservation"
              onAction={() => navigate("/reservations")}
              icon={MdCalendarToday}
            />
          )}
          {rentalUnits.length === 0 && (
            <EmptyState
              title="No rental units yet"
              description="Add rentable apartments, villas, chalets, studios, or other units before creating reservations."
              actionLabel="Add Rental Unit"
              onAction={() => navigate("/rental-units")}
              icon={MdHomeWork}
            />
          )}
          {owners.length === 0 && (
            <EmptyState
              title="No owners yet"
              description="Add owners to manage payout details and connect units to their ownership records."
              actionLabel="Add Owner"
              onAction={() => navigate("/owners")}
              icon={MdPeopleAlt}
            />
          )}
        </SimpleGrid>
      )}

      <Grid templateColumns="repeat(12, 1fr)" gap="18px">
        <GridItem colSpan={{ base: 12, xl: 6 }}>
          <SectionCard
            title="Today's Check-ins"
            helper="Reservations scheduled to start today."
            action={
              <Button size="sm" variant="ghost" onClick={() => navigate("/reservations")}>
                View all
              </Button>
            }
          >
            {dashboardStats.todayCheckIns.length > 0 ? (
              dashboardStats.todayCheckIns
                .slice(0, 5)
                .map((reservation) => (
                  <ReservationRow key={reservation?._id || reservation?.reservationCode} reservation={reservation} />
                ))
            ) : (
              <EmptyState
                title="No check-ins today"
                description="Confirmed and active reservations starting today will appear here."
                icon={MdEventAvailable}
              />
            )}
          </SectionCard>
        </GridItem>

        <GridItem colSpan={{ base: 12, xl: 6 }}>
          <SectionCard
            title="Today's Check-outs"
            helper="Reservations scheduled to end today."
            action={
              <Button size="sm" variant="ghost" onClick={() => navigate("/reservations")}>
                View all
              </Button>
            }
          >
            {dashboardStats.todayCheckOuts.length > 0 ? (
              dashboardStats.todayCheckOuts
                .slice(0, 5)
                .map((reservation) => (
                  <ReservationRow key={reservation?._id || reservation?.reservationCode} reservation={reservation} />
                ))
            ) : (
              <EmptyState
                title="No check-outs today"
                description="Active reservations ending today will appear here."
                icon={MdArrowForward}
              />
            )}
          </SectionCard>
        </GridItem>

        <GridItem colSpan={{ base: 12, xl: 7 }}>
          <SectionCard
            title="Upcoming Reservations"
            helper="The next active bookings by check-in date."
            action={
              <Button
                size="sm"
                colorScheme="brand"
                rightIcon={<Icon as={MdArrowForward} />}
                onClick={() => navigate("/reservations")}
              >
                Reservations
              </Button>
            }
          >
            {dashboardStats.upcomingReservations.length > 0 ? (
              dashboardStats.upcomingReservations
                .slice(0, 6)
                .map((reservation) => (
                  <ReservationRow key={reservation?._id || reservation?.reservationCode} reservation={reservation} />
                ))
            ) : (
              <EmptyState
                title="No upcoming reservations"
                description="Upcoming inquiry, tentative, confirmed, or in-house reservations will appear here."
                actionLabel="Add Reservation"
                onAction={() => navigate("/reservations")}
                icon={MdCalendarToday}
              />
            )}
          </SectionCard>
        </GridItem>

        <GridItem colSpan={{ base: 12, xl: 5 }}>
          <SectionCard
            title="Units Requiring Attention"
            helper="Inactive, maintenance, or missing nightly-rate records."
            action={
              <Button size="sm" variant="ghost" onClick={() => navigate("/rental-units")}>
                Units
              </Button>
            }
          >
            {dashboardStats.unitsRequiringAttention.length > 0 ? (
              <Stack spacing="4px">
                {dashboardStats.unitsRequiringAttention.slice(0, 6).map((unit) => (
                  <AttentionUnit key={unit?._id || unit?.unitCode} unit={unit} />
                ))}
              </Stack>
            ) : (
              <EmptyState
                title="Inventory looks healthy"
                description="Units with maintenance, inactive status, or missing base rates will be listed here."
                icon={MdHomeWork}
              />
            )}
          </SectionCard>
        </GridItem>

        <GridItem colSpan={{ base: 12 }}>
          <SectionCard
            title="Recent Reservations"
            helper="Latest booking activity across the rental operation."
            action={
              <Button size="sm" variant="outline" onClick={fetchDashboardData}>
                Refresh
              </Button>
            }
          >
            {dashboardStats.recentReservations.length > 0 ? (
              dashboardStats.recentReservations.map((reservation) => (
                <ReservationRow key={reservation?._id || reservation?.reservationCode} reservation={reservation} />
              ))
            ) : (
              <EmptyState
                title="No recent reservations"
                description="New and updated reservations will appear here after bookings are created."
                icon={MdCalendarToday}
              />
            )}
          </SectionCard>
        </GridItem>
      </Grid>
    </Box>
  );
}
