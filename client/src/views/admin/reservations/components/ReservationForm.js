import { CloseIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getApi, postApi, putApi } from "services/api";
import * as yup from "yup";

const initialReservationValues = {
  reservationCode: "",
  unit: "",
  guest: "",
  guestName: "",
  guestPhone: "",
  guestEmail: "",
  checkInDate: "",
  checkOutDate: "",
  adults: 1,
  children: 0,
  source: "direct",
  status: "inquiry",
  totalAmount: 0,
  depositPaid: 0,
  balanceDue: 0,
  paymentStatus: "unpaid",
  internalNotes: "",
};

const validationSchema = yup.object({
  reservationCode: yup.string().required("Reservation code is required"),
  unit: yup.string().required("Rental unit is required"),
  guest: yup.string().required("Guest/contact is required"),
  checkInDate: yup.string().required("Check-in date is required"),
  checkOutDate: yup
    .string()
    .required("Check-out date is required")
    .test(
      "after-check-in",
      "Check-out date must be after check-in date",
      function (value) {
        const { checkInDate } = this.parent;
        if (!checkInDate || !value) return true;
        return new Date(value) > new Date(checkInDate);
      }
    ),
  adults: yup
    .number()
    .typeError("Adults must be a number")
    .min(0, "Adults cannot be negative"),
  children: yup
    .number()
    .typeError("Children must be a number")
    .min(0, "Children cannot be negative"),
  totalAmount: yup
    .number()
    .typeError("Total amount must be a number")
    .min(0, "Total amount cannot be negative"),
  depositPaid: yup
    .number()
    .typeError("Deposit paid must be a number")
    .min(0, "Deposit paid cannot be negative"),
  balanceDue: yup
    .number()
    .typeError("Balance due must be a number")
    .min(0, "Balance due cannot be negative"),
});

const overlapMessage =
  "This unit already has a confirmed reservation for the selected date range.";

const getFriendlyError = (error, fallback) => {
  const status = error?.response?.status;
  if (status === 409) return overlapMessage;

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

const Section = ({ title, description, children }) => {
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const sectionBg = useColorModeValue("white", "gray.800");
  const accentBg = useColorModeValue("brand.50", "whiteAlpha.100");
  const subtleText = useColorModeValue("secondaryGray.600", "gray.400");

  return (
    <Box
      bg={sectionBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="16px"
      p={{ base: 4, md: 5 }}
    >
      <HStack align="flex-start" spacing={3} mb={4}>
        <Box bg={accentBg} borderRadius="999px" h="10px" mt="7px" w="10px" flexShrink={0} />
        <Box>
          <Heading size="sm" color="secondaryGray.900" mb={1}>
            {title}
          </Heading>
          {description && (
            <Text color={subtleText} fontSize="sm" lineHeight="1.5">
              {description}
            </Text>
          )}
        </Box>
      </HStack>
      {children}
    </Box>
  );
};

const FieldError = ({ children }) => (
  <Text color="red.500" fontSize="xs" minH="18px" mt={1}>
    {children}
  </Text>
);

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value?._id || "";
};

const formatDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const calculateNights = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 0;
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
};

const toNumber = (value) => Number(value || 0);

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
  if (!guest) return "Guest";
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

const getGuestMeta = (guest) =>
  guest?.email ||
  findContactValue(guest, ["email"]) ||
  guest?.phoneNumber ||
  guest?.mobileNumber ||
  findContactValue(guest, ["phone", "mobile"]) ||
  "No contact saved";

const generateReservationCode = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `RES-${datePart}-${randomPart}`;
};

const getOwnerIdFromUnit = (unit) => {
  if (!unit?.owner) return "";
  if (typeof unit?.owner === "string") return unit?.owner;
  return unit?.owner?._id || "";
};

const getPaymentStatus = (totalAmount, depositPaid) => {
  const total = toNumber(totalAmount);
  const deposit = toNumber(depositPaid);

  if (deposit <= 0) return "unpaid";
  if (deposit >= total) return "paid";
  return "partial";
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

const formatAmount = (value, currency) => {
  const numericValue = Number(value || 0);
  const amount = numericValue?.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  return currency ? `${currency} ${amount}` : amount;
};

const ReservationForm = (props) => {
  const { isOpen, onClose, selectedId, mode, rentalUnits, contacts, onSaved } = props;
  const [isLoding, setIsLoding] = useState(false);
  const [error, setError] = useState("");
  const [totalManuallyEdited, setTotalManuallyEdited] = useState(false);
  const subtleText = useColorModeValue("secondaryGray.600", "gray.400");
  const drawerBg = useColorModeValue("gray.50", "gray.900");
  const headerBg = useColorModeValue("white", "gray.800");
  const footerBg = useColorModeValue("white", "gray.800");
  const fieldBg = useColorModeValue("white", "whiteAlpha.50");
  const footerBorder = useColorModeValue("gray.200", "whiteAlpha.100");
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const isEditMode = mode === "edit";

  const formik = useFormik({
    initialValues: initialReservationValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: () => {
      saveReservation();
    },
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues,
  } = formik;

  const selectedUnit = useMemo(
    () => (rentalUnits || [])?.find((unit) => unit?._id === values?.unit),
    [rentalUnits, values?.unit]
  );

  const nights = useMemo(
    () => calculateNights(values?.checkInDate, values?.checkOutDate),
    [values?.checkInDate, values?.checkOutDate]
  );
  const nightlyRate = toNumber(selectedUnit?.baseNightlyRate);
  const estimatedTotal = nights * nightlyRate;
  const selectedUnitHasRate = Boolean(selectedUnit && nightlyRate > 0);
  const stayStatus = getStayStatus(values?.checkInDate, values?.checkOutDate);
  const hasInvalidDateRange =
    Boolean(values?.checkInDate && values?.checkOutDate) && nights <= 0;

  const closeForm = () => {
    setError("");
    setTotalManuallyEdited(false);
    resetForm();
    onClose();
  };

  const fetchReservation = useCallback(async () => {
    if (!selectedId || !isOpen || mode !== "edit") return;

    try {
      setIsLoding(true);
      setError("");
      const response = await getApi("api/reservation/view/", selectedId);
      if (response?.status === 200) {
        setValues({
          ...initialReservationValues,
          ...response?.data,
          unit: normalizeId(response?.data?.unit),
          guest: normalizeId(response?.data?.guest),
          guestName: "",
          guestPhone: "",
          guestEmail: "",
          checkInDate: formatDateInput(response?.data?.checkInDate),
          checkOutDate: formatDateInput(response?.data?.checkOutDate),
          adults: response?.data?.adults ?? 1,
          children: response?.data?.children ?? 0,
          totalAmount: response?.data?.totalAmount || 0,
          depositPaid: response?.data?.depositPaid || 0,
          balanceDue: response?.data?.balanceDue || 0,
          internalNotes:
            response?.data?.internalNotes || response?.data?.notes || "",
        });
        setTotalManuallyEdited(true);
      } else {
        const message = getFriendlyError(
          response,
          "We could not load this reservation. Please try again."
        );
        setError(message);
        toast.error(message);
      }
    } catch (e) {
      const message = getFriendlyError(
        e,
        "We could not load this reservation. Please try again."
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsLoding(false);
    }
  }, [isOpen, mode, selectedId, setValues]);

  const saveReservation = async () => {
    try {
      setIsLoding(true);
      setError("");

      const payload = {
        ...values,
        owner: getOwnerIdFromUnit(selectedUnit),
        nights,
        adults: toNumber(values?.adults),
        children: toNumber(values?.children),
        totalAmount: toNumber(values?.totalAmount),
        depositPaid: toNumber(values?.depositPaid),
        balanceDue: toNumber(values?.balanceDue),
      };

      if (!payload?.owner) {
        delete payload.owner;
      }
      delete payload.guestName;
      delete payload.guestPhone;
      delete payload.guestEmail;

      const response =
        mode === "edit"
          ? await putApi(`api/reservation/edit/${selectedId}`, payload)
          : await postApi("api/reservation/add", {
              ...payload,
              createBy: userId,
            });

      if (response?.status === 200) {
        onSaved(mode);
        closeForm();
      } else {
        const message = getFriendlyError(
          response,
          "We could not save this reservation. Please check the details and try again."
        );
        setError(message);
        toast.error(message);
      }
    } catch (e) {
      const message = getFriendlyError(
        e,
        "We could not save this reservation. Please check the details and try again."
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsLoding(false);
    }
  };

  useEffect(() => {
    fetchReservation();
  }, [fetchReservation]);

  useEffect(() => {
    if (isOpen && mode === "add") {
      setValues({
        ...initialReservationValues,
        reservationCode: generateReservationCode(),
      });
      setTotalManuallyEdited(false);
      setError("");
    }
  }, [isOpen, mode, setValues]);

  useEffect(() => {
    const nextBalanceDue = Math.max(
      toNumber(values?.totalAmount) - toNumber(values?.depositPaid),
      0
    );

    if (toNumber(values?.balanceDue) !== nextBalanceDue) {
      setFieldValue("balanceDue", nextBalanceDue, false);
    }
  }, [setFieldValue, values?.balanceDue, values?.depositPaid, values?.totalAmount]);

  useEffect(() => {
    const nextPaymentStatus = getPaymentStatus(
      values?.totalAmount,
      values?.depositPaid
    );

    if (values?.paymentStatus !== nextPaymentStatus) {
      setFieldValue("paymentStatus", nextPaymentStatus, false);
    }
  }, [setFieldValue, values?.depositPaid, values?.paymentStatus, values?.totalAmount]);

  useEffect(() => {
    if (mode !== "add" || totalManuallyEdited || !values?.unit) return;

    if (toNumber(values?.totalAmount) !== estimatedTotal) {
      setFieldValue("totalAmount", estimatedTotal, false);
    }
  }, [
    estimatedTotal,
    mode,
    setFieldValue,
    totalManuallyEdited,
    values?.totalAmount,
    values?.unit,
  ]);

  const handleTotalAmountChange = (event) => {
    setTotalManuallyEdited(true);
    handleChange(event);
  };

  return (
    <Drawer isOpen={isOpen} size="xl" onClose={closeForm}>
      <DrawerOverlay />
      <DrawerContent bg={drawerBg}>
        <DrawerHeader
          bg={headerBg}
          borderBottom="1px solid"
          borderColor={footerBorder}
          pb={5}
        >
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={4}>
            <Box>
              <HStack spacing={3} align="center" mb={1}>
                <Heading size="md" color="secondaryGray.900">
                  {isEditMode ? "Edit Reservation" : "Add Reservation"}
                </Heading>
                <Badge colorScheme={isEditMode ? "blue" : "green"} variant="subtle">
                  {isEditMode ? "Existing Booking" : "New Booking"}
                </Badge>
              </HStack>
              <Text color={subtleText} fontSize="sm" mt={1}>
                {isEditMode
                  ? "Review and update guest, stay dates, payment status, and notes."
                  : "Create a clean reservation record with guest, unit, stay dates, and payment details."}
              </Text>
            </Box>
            <IconButton
              aria-label="Close reservation form"
              onClick={closeForm}
              icon={<CloseIcon />}
              size="sm"
            />
          </Box>
        </DrawerHeader>

        <DrawerBody pb={6} pt={5}>
          {error && (
            <Alert status="error" mb={4} borderRadius="8px">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {isLoding && mode === "edit" ? (
            <Spinner />
          ) : (
            <Stack spacing={5}>
              <Section
                title="Reservation Details"
                description="Identify the booking and where it came from."
              >
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box>
                    <FormLabel display="flex" fontSize="sm" fontWeight="600">
                      Reservation Code<Text color="red.500">*</Text>
                    </FormLabel>
                    <Input
                      name="reservationCode"
                      value={values?.reservationCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Example: RES-20260618-1001"
                      borderColor={
                        errors?.reservationCode && touched?.reservationCode
                          ? "red.300"
                          : null
                      }
                      bg={fieldBg}
                    />
                    <FormHelperText color={subtleText} fontSize="xs">
                      Use a unique code for lookup and guest communication.
                    </FormHelperText>
                    <FieldError>
                      {errors?.reservationCode &&
                        touched?.reservationCode &&
                        errors?.reservationCode}
                    </FieldError>
                  </Box>

                  <Box>
                    <FormLabel fontSize="sm" fontWeight="600">
                      Source
                    </FormLabel>
                    <Select
                      name="source"
                      value={values?.source}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      bg={fieldBg}
                    >
                      <option value="direct">Direct</option>
                      <option value="phone">Phone</option>
                      <option value="website">Website</option>
                      <option value="referral">Referral</option>
                      <option value="ota">OTA</option>
                      <option value="walk_in">Walk In</option>
                      <option value="other">Other</option>
                    </Select>
                  </Box>
                </SimpleGrid>
              </Section>

              <Section
                title="Guest & Unit"
                description="Choose the rental unit and the guest/contact for this reservation."
              >
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box>
                    <FormLabel display="flex" fontSize="sm" fontWeight="600">
                      Rental Unit<Text color="red.500">*</Text>
                    </FormLabel>
                    <Select
                      name="unit"
                      value={values?.unit}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={
                        rentalUnits?.length ? "Select rental unit" : "No rental units available"
                      }
                      borderColor={errors?.unit && touched?.unit ? "red.300" : null}
                      bg={fieldBg}
                    >
                      {(rentalUnits || [])?.map((unit) => (
                        <option key={unit?._id} value={unit?._id}>
                          {unit?.name} {unit?.code ? `(${unit?.code})` : ""}
                        </option>
                      ))}
                    </Select>
                    <FormHelperText color={subtleText} fontSize="xs">
                      {selectedUnit?.owner?.name
                        ? `Owner: ${selectedUnit?.owner?.name}`
                        : selectedUnitHasRate
                          ? `Base nightly rate: ${formatAmount(nightlyRate, selectedUnit?.currency)}`
                          : "Owner is inferred from the selected unit when available."}
                    </FormHelperText>
                    {selectedUnit && !selectedUnitHasRate && (
                      <Text color="orange.500" fontSize="xs" mt={1}>
                        This unit has no base nightly rate yet.
                      </Text>
                    )}
                    <FieldError>
                      {errors?.unit && touched?.unit && errors?.unit}
                    </FieldError>
                  </Box>

                  <Box>
                    <FormLabel display="flex" fontSize="sm" fontWeight="600">
                      Guest / Contact<Text color="red.500">*</Text>
                    </FormLabel>
                    <Select
                      name="guest"
                      value={values?.guest}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={contacts?.length ? "Select guest/contact" : "No contacts available"}
                      borderColor={errors?.guest && touched?.guest ? "red.300" : null}
                      bg={fieldBg}
                    >
                      {(contacts || [])?.map((contact, index) => (
                        <option key={contact?._id} value={contact?._id}>
                          {getGuestName(contact) || `Contact ${index + 1}`} - {getGuestMeta(contact)}
                        </option>
                      ))}
                    </Select>
                    <FormHelperText color={subtleText} fontSize="xs">
                      {contacts?.length
                        ? "Guests are loaded from the existing Contacts module."
                        : "No contacts found. Create a contact first or add guest details below."}
                    </FormHelperText>
                    <FieldError>
                      {errors?.guest && touched?.guest && errors?.guest}
                    </FieldError>
                  </Box>
                </SimpleGrid>

                <Box mt={4}>
                  <Text color="secondaryGray.900" fontSize="sm" fontWeight="800" mb={3}>
                    Guest Details Fallback
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Box>
                      <FormLabel fontSize="sm" fontWeight="600">
                        Guest Name
                      </FormLabel>
                      <Input
                        name="guestName"
                        value={values?.guestName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Guest full name"
                        bg={fieldBg}
                      />
                    </Box>
                    <Box>
                      <FormLabel fontSize="sm" fontWeight="600">
                        Guest Phone
                      </FormLabel>
                      <Input
                        name="guestPhone"
                        value={values?.guestPhone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Guest phone number"
                        bg={fieldBg}
                      />
                    </Box>
                    <Box>
                      <FormLabel fontSize="sm" fontWeight="600">
                        Guest Email
                      </FormLabel>
                      <Input
                        name="guestEmail"
                        value={values?.guestEmail}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="guest@example.com"
                        bg={fieldBg}
                      />
                    </Box>
                  </SimpleGrid>
                  <Text color="orange.500" fontSize="xs" mt={3}>
                    Reservation records still require a saved Contact. These fallback details are for temporary reference only and are not persisted unless the backend is extended.
                  </Text>
                </Box>
              </Section>

              <Section
                title="Stay Dates"
                description="Set check-in and check-out dates. Nights are calculated automatically."
              >
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Box>
                    <FormLabel display="flex" fontSize="sm" fontWeight="600">
                      Check-in Date<Text color="red.500">*</Text>
                    </FormLabel>
                    <Input
                      name="checkInDate"
                      type="date"
                      value={values?.checkInDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      borderColor={
                        errors?.checkInDate && touched?.checkInDate ? "red.300" : null
                      }
                      bg={fieldBg}
                    />
                    <FieldError>
                      {errors?.checkInDate && touched?.checkInDate && errors?.checkInDate}
                    </FieldError>
                  </Box>

                  <Box>
                    <FormLabel display="flex" fontSize="sm" fontWeight="600">
                      Check-out Date<Text color="red.500">*</Text>
                    </FormLabel>
                    <Input
                      name="checkOutDate"
                      type="date"
                      value={values?.checkOutDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      borderColor={
                        errors?.checkOutDate && touched?.checkOutDate ? "red.300" : null
                      }
                      bg={fieldBg}
                    />
                    <FieldError>
                      {errors?.checkOutDate &&
                        touched?.checkOutDate &&
                        errors?.checkOutDate}
                    </FieldError>
                  </Box>

                  <Box>
                    <FormLabel fontSize="sm" fontWeight="600">
                      Nights
                    </FormLabel>
                    <Input value={nights || 0} isReadOnly bg={fieldBg} />
                    <FormHelperText color={subtleText} fontSize="xs">
                      {hasInvalidDateRange
                        ? "Check-out date must be after check-in date."
                        : "Saved automatically with the reservation."}
                    </FormHelperText>
                  </Box>
                </SimpleGrid>
              </Section>

              <Section
                title="Guests Count"
                description="Track adults and children included in the stay."
              >
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box>
                    <FormLabel fontSize="sm" fontWeight="600">
                      Adults
                    </FormLabel>
                    <Input
                      name="adults"
                      type="number"
                      value={values?.adults}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="1"
                      borderColor={errors?.adults && touched?.adults ? "red.300" : null}
                      bg={fieldBg}
                    />
                    <FieldError>
                      {errors?.adults && touched?.adults && errors?.adults}
                    </FieldError>
                  </Box>

                  <Box>
                    <FormLabel fontSize="sm" fontWeight="600">
                      Children
                    </FormLabel>
                    <Input
                      name="children"
                      type="number"
                      value={values?.children}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      borderColor={
                        errors?.children && touched?.children ? "red.300" : null
                      }
                      bg={fieldBg}
                    />
                    <FieldError>
                      {errors?.children && touched?.children && errors?.children}
                    </FieldError>
                  </Box>
                </SimpleGrid>
              </Section>

              <Section
                title="Pricing & Deposit"
                description="Track the reservation total, deposit paid, and current balance."
              >
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Box>
                    <FormLabel fontSize="sm" fontWeight="600">
                      Total Amount
                    </FormLabel>
                    <Input
                      name="totalAmount"
                      type="number"
                      value={values?.totalAmount}
                      onChange={handleTotalAmountChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      borderColor={
                        errors?.totalAmount && touched?.totalAmount ? "red.300" : null
                      }
                      bg={fieldBg}
                    />
                    <FieldError>
                      {errors?.totalAmount &&
                        touched?.totalAmount &&
                        errors?.totalAmount}
                    </FieldError>
                  </Box>

                  <Box>
                    <FormLabel fontSize="sm" fontWeight="600">
                      Deposit Paid
                    </FormLabel>
                    <Input
                      name="depositPaid"
                      type="number"
                      value={values?.depositPaid}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      borderColor={
                        errors?.depositPaid && touched?.depositPaid ? "red.300" : null
                      }
                      bg={fieldBg}
                    />
                    <FieldError>
                      {errors?.depositPaid &&
                        touched?.depositPaid &&
                        errors?.depositPaid}
                    </FieldError>
                  </Box>

                  <Box>
                    <FormLabel fontSize="sm" fontWeight="600">
                      Balance Due
                    </FormLabel>
                    <Input
                      name="balanceDue"
                      type="number"
                      value={values?.balanceDue}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      borderColor={
                        errors?.balanceDue && touched?.balanceDue ? "red.300" : null
                      }
                      bg={fieldBg}
                    />
                    <FormHelperText color={subtleText} fontSize="xs">
                      Recalculated from total minus deposit paid.
                    </FormHelperText>
                    <FieldError>
                      {errors?.balanceDue &&
                        touched?.balanceDue &&
                        errors?.balanceDue}
                    </FieldError>
                  </Box>
                </SimpleGrid>

                <Box
                  border="1px solid"
                  borderColor={footerBorder}
                  borderRadius="14px"
                  mt={4}
                  p={4}
                >
                  <Text color="secondaryGray.900" fontSize="sm" fontWeight="800" mb={3}>
                    Pricing Summary
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 5 }} spacing={4}>
                    <Box>
                      <Text color={subtleText} fontSize="xs" fontWeight="700">
                        Nightly Rate
                      </Text>
                      <Text color="secondaryGray.900" fontWeight="900">
                        {selectedUnitHasRate
                          ? formatAmount(nightlyRate, selectedUnit?.currency)
                          : "-"}
                      </Text>
                    </Box>
                    <Box>
                      <Text color={subtleText} fontSize="xs" fontWeight="700">
                        Nights
                      </Text>
                      <Text color="secondaryGray.900" fontWeight="900">
                        {nights || 0}
                      </Text>
                    </Box>
                    <Box>
                      <Text color={subtleText} fontSize="xs" fontWeight="700">
                        Estimated Total
                      </Text>
                      <Text color="secondaryGray.900" fontWeight="900">
                        {formatAmount(estimatedTotal, selectedUnit?.currency)}
                      </Text>
                    </Box>
                    <Box>
                      <Text color={subtleText} fontSize="xs" fontWeight="700">
                        Deposit Paid
                      </Text>
                      <Text color="secondaryGray.900" fontWeight="900">
                        {formatAmount(values?.depositPaid, selectedUnit?.currency)}
                      </Text>
                    </Box>
                    <Box>
                      <Text color={subtleText} fontSize="xs" fontWeight="700">
                        Balance Due
                      </Text>
                      <Text color={toNumber(values?.balanceDue) > 0 ? "orange.500" : "green.500"} fontWeight="900">
                        {formatAmount(values?.balanceDue, selectedUnit?.currency)}
                      </Text>
                    </Box>
                  </SimpleGrid>
                  {selectedUnit && !selectedUnitHasRate && (
                    <Text color="orange.500" fontSize="xs" mt={3}>
                      This unit has no base nightly rate yet.
                    </Text>
                  )}
                  {totalManuallyEdited && (
                    <Text color={subtleText} fontSize="xs" mt={3}>
                      Total amount was manually adjusted for this reservation.
                    </Text>
                  )}
                </Box>
              </Section>

              <Section
                title="Status & Notes"
                description="Set reservation and payment status, then keep internal notes."
              >
                <Stack spacing={4}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <FormLabel fontSize="sm" fontWeight="600">
                        Reservation Status
                      </FormLabel>
                      <Select
                        name="status"
                        value={values?.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        bg={fieldBg}
                      >
                        <option value="inquiry">Inquiry</option>
                        <option value="tentative">Tentative</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no_show">No Show</option>
                      </Select>
                      <FormHelperText color={subtleText} fontSize="xs">
                        Confirmed reservations are checked for date overlaps.
                      </FormHelperText>
                    </Box>

                    <Box>
                      <FormLabel fontSize="sm" fontWeight="600">
                        Payment Status
                      </FormLabel>
                      <Select
                        name="paymentStatus"
                        value={values?.paymentStatus}
                        isDisabled
                        bg={fieldBg}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                      </Select>
                      <FormHelperText color={subtleText} fontSize="xs">
                        Auto-updated from total amount and deposit paid.
                      </FormHelperText>
                    </Box>
                  </SimpleGrid>

                  <Box
                    border="1px solid"
                    borderColor={footerBorder}
                    borderRadius="14px"
                    p={4}
                  >
                    <Text color={subtleText} fontSize="xs" fontWeight="700">
                      Stay Status
                    </Text>
                    <Badge colorScheme="blue" mt={2} variant="subtle" w="fit-content">
                      {stayStatus}
                    </Badge>
                    <Text color={subtleText} fontSize="xs" mt={2}>
                      Calculated from today, check-in date, and check-out date. This is not saved separately.
                    </Text>
                  </Box>

                  <Box>
                    <FormLabel fontSize="sm" fontWeight="600">
                      Notes
                    </FormLabel>
                    <Textarea
                      name="internalNotes"
                      value={values?.internalNotes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Internal notes, guest preferences, payment context, or special handling"
                      minH="110px"
                      bg={fieldBg}
                    />
                  </Box>
                </Stack>
              </Section>
            </Stack>
          )}
        </DrawerBody>

        <DrawerFooter
          bg={footerBg}
          borderTop="1px solid"
          borderColor={footerBorder}
          bottom={0}
          gap={3}
          position="sticky"
          zIndex={1}
        >
          <Button variant="outline" mr={3} onClick={closeForm}>
            Cancel
          </Button>
          <Button
            variant="brand"
            onClick={handleSubmit}
            isDisabled={isLoding}
          >
            {isLoding ? (
              <Spinner />
            ) : isEditMode ? (
              "Save Changes"
            ) : (
              "Create Reservation"
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ReservationForm;
