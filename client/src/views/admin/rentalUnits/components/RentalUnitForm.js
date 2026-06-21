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
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApi, postApi, putApi } from "services/api";
import * as yup from "yup";

const initialRentalUnitValues = {
  name: "",
  code: "",
  owner: "",
  unitType: "apartment",
  bedrooms: "",
  bathrooms: "",
  maxGuests: "",
  area: "",
  address: "",
  baseNightlyRate: 0,
  cleaningFee: 0,
  securityDeposit: 0,
  status: "active",
  internalNotes: "",
};

const validationSchema = yup.object({
  name: yup.string().required("Unit name is required"),
  bedrooms: yup
    .number()
    .typeError("Bedrooms must be a number")
    .min(0, "Bedrooms cannot be negative"),
  bathrooms: yup
    .number()
    .typeError("Bathrooms must be a number")
    .min(0, "Bathrooms cannot be negative"),
  maxGuests: yup
    .number()
    .typeError("Max guests must be a number")
    .min(0, "Max guests cannot be negative"),
  baseNightlyRate: yup
    .number()
    .typeError("Base nightly rate must be a number")
    .min(0, "Base nightly rate cannot be negative"),
  cleaningFee: yup
    .number()
    .typeError("Cleaning fee must be a number")
    .min(0, "Cleaning fee cannot be negative"),
  securityDeposit: yup
    .number()
    .typeError("Security deposit must be a number")
    .min(0, "Security deposit cannot be negative"),
});

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

const normalizeOwnerId = (owner) => {
  if (!owner) return "";
  if (typeof owner === "string") return owner;
  return owner?._id || "";
};

const toNumber = (value) => Number(value || 0);

const RentalUnitForm = (props) => {
  const { isOpen, onClose, selectedId, mode, owners, onSaved } = props;
  const [isLoding, setIsLoding] = useState(false);
  const [error, setError] = useState("");
  const subtleText = useColorModeValue("secondaryGray.600", "gray.400");
  const drawerBg = useColorModeValue("gray.50", "gray.900");
  const headerBg = useColorModeValue("white", "gray.800");
  const footerBg = useColorModeValue("white", "gray.800");
  const fieldBg = useColorModeValue("white", "whiteAlpha.50");
  const footerBorder = useColorModeValue("gray.200", "whiteAlpha.100");
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const isEditMode = mode === "edit";

  const formik = useFormik({
    initialValues: initialRentalUnitValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: () => {
      saveRentalUnit();
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
    setValues,
  } = formik;

  const closeForm = () => {
    setError("");
    resetForm();
    onClose();
  };

  const fetchRentalUnit = useCallback(async () => {
    if (!selectedId || !isOpen || mode !== "edit") return;

    try {
      setIsLoding(true);
      setError("");
      const response = await getApi("api/rental-unit/view/", selectedId);
      if (response?.status === 200) {
        setValues({
          ...initialRentalUnitValues,
          ...response?.data,
          owner: normalizeOwnerId(response?.data?.owner),
          bedrooms: response?.data?.bedrooms ?? "",
          bathrooms: response?.data?.bathrooms ?? "",
          maxGuests: response?.data?.maxGuests ?? "",
          baseNightlyRate: response?.data?.baseNightlyRate || 0,
          cleaningFee: response?.data?.cleaningFee || 0,
          securityDeposit: response?.data?.securityDeposit || 0,
          internalNotes:
            response?.data?.internalNotes || response?.data?.notes || "",
        });
      } else {
        const message = getFriendlyError(
          response,
          "We could not load this rental unit. Please try again."
        );
        setError(message);
        toast.error(message);
      }
    } catch (e) {
      const message = getFriendlyError(
        e,
        "We could not load this rental unit. Please try again."
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsLoding(false);
    }
  }, [isOpen, mode, selectedId, setValues]);

  const saveRentalUnit = async () => {
    try {
      setIsLoding(true);
      setError("");

      const payload = {
        ...values,
        bedrooms: toNumber(values?.bedrooms),
        bathrooms: toNumber(values?.bathrooms),
        maxGuests: toNumber(values?.maxGuests),
        baseNightlyRate: toNumber(values?.baseNightlyRate),
        cleaningFee: toNumber(values?.cleaningFee),
        securityDeposit: toNumber(values?.securityDeposit),
      };

      if (!payload?.owner) {
        delete payload.owner;
      }

      const response =
        mode === "edit"
          ? await putApi(`api/rental-unit/edit/${selectedId}`, payload)
          : await postApi("api/rental-unit/add", {
              ...payload,
              createBy: userId,
            });

      if (response?.status === 200) {
        onSaved(mode);
        closeForm();
      } else {
        const message = getFriendlyError(
          response,
          "We could not save this rental unit. Please check the details and try again."
        );
        setError(message);
        toast.error(message);
      }
    } catch (e) {
      const message = getFriendlyError(
        e,
        "We could not save this rental unit. Please check the details and try again."
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsLoding(false);
    }
  };

  useEffect(() => {
    fetchRentalUnit();
  }, [fetchRentalUnit]);

  useEffect(() => {
    if (isOpen && mode === "add") {
      resetForm();
      setError("");
    }
  }, [isOpen, mode, resetForm]);

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
                  {isEditMode ? "Edit Rental Unit" : "Add Rental Unit"}
                </Heading>
                <Badge colorScheme={isEditMode ? "blue" : "green"} variant="subtle">
                  {isEditMode ? "Existing Unit" : "New Unit"}
                </Badge>
              </HStack>
              <Text color={subtleText} fontSize="sm" mt={1}>
                {isEditMode
                  ? "Review and update unit capacity, pricing, owner assignment, and status."
                  : "Create a rental-ready unit profile with owner, capacity, and pricing details."}
              </Text>
            </Box>
            <IconButton
              aria-label="Close rental unit form"
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
                title="Basic Information"
                description="Name and identify the rentable unit for your team."
              >
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box>
                    <FormLabel display="flex" fontSize="sm" fontWeight="600">
                      Unit Name<Text color="red.500">*</Text>
                    </FormLabel>
                    <Input
                      name="name"
                      value={values?.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Example: Villa A1"
                      borderColor={
                        errors?.name && touched?.name ? "red.300" : null
                      }
                      bg={fieldBg}
                    />
                    <FormHelperText color={subtleText} fontSize="xs">
                      Use a clear name your team can recognize quickly.
                    </FormHelperText>
                    <FieldError>
                      {errors?.name && touched?.name && errors?.name}
                    </FieldError>
                  </Box>

                  <Box>
                    <FormLabel fontSize="sm" fontWeight="600">
                      Unit Code
                    </FormLabel>
                    <Input
                      name="code"
                      value={values?.code}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Example: UNIT-001"
                      bg={fieldBg}
                    />
                    <FormHelperText color={subtleText} fontSize="xs">
                      Optional unique internal reference.
                    </FormHelperText>
                  </Box>
                </SimpleGrid>
              </Section>

              <Section
                title="Owner Assignment"
                description="Link this unit to the owner responsible for payout and reporting."
              >
                <Box>
                  <FormLabel fontSize="sm" fontWeight="600">
                    Owner
                  </FormLabel>
                  <Select
                    name="owner"
                    value={values?.owner}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={owners?.length ? "Select owner" : "No owners available"}
                    bg={fieldBg}
                  >
                    {(owners || [])?.map((owner) => (
                      <option key={owner?._id} value={owner?._id}>
                        {owner?.name}
                      </option>
                    ))}
                  </Select>
                  <FormHelperText color={subtleText} fontSize="xs">
                    Owners are loaded from the Owners module.
                  </FormHelperText>
                </Box>
              </Section>

              <Section
                title="Capacity & Details"
                description="Capture the unit type, capacity, size, and location details."
              >
                <Stack spacing={4}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <FormLabel fontSize="sm" fontWeight="600">
                        Unit Type
                      </FormLabel>
                      <Select
                        name="unitType"
                        value={values?.unitType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        bg={fieldBg}
                      >
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="chalet">Chalet</option>
                        <option value="studio">Studio</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="other">Other</option>
                      </Select>
                    </Box>

                    <Box>
                      <FormLabel fontSize="sm" fontWeight="600">
                        Area
                      </FormLabel>
                      <Input
                        name="area"
                        value={values?.area}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Example: 120 sqm"
                        bg={fieldBg}
                      />
                    </Box>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Box>
                      <FormLabel fontSize="sm" fontWeight="600">
                        Bedrooms
                      </FormLabel>
                      <Input
                        name="bedrooms"
                        type="number"
                        value={values?.bedrooms}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="0"
                        borderColor={
                          errors?.bedrooms && touched?.bedrooms ? "red.300" : null
                        }
                        bg={fieldBg}
                      />
                      <FieldError>
                        {errors?.bedrooms && touched?.bedrooms && errors?.bedrooms}
                      </FieldError>
                    </Box>

                    <Box>
                      <FormLabel fontSize="sm" fontWeight="600">
                        Bathrooms
                      </FormLabel>
                      <Input
                        name="bathrooms"
                        type="number"
                        value={values?.bathrooms}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="0"
                        borderColor={
                          errors?.bathrooms && touched?.bathrooms ? "red.300" : null
                        }
                        bg={fieldBg}
                      />
                      <FieldError>
                        {errors?.bathrooms && touched?.bathrooms && errors?.bathrooms}
                      </FieldError>
                    </Box>

                    <Box>
                      <FormLabel fontSize="sm" fontWeight="600">
                        Max Guests
                      </FormLabel>
                      <Input
                        name="maxGuests"
                        type="number"
                        value={values?.maxGuests}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="0"
                        borderColor={
                          errors?.maxGuests && touched?.maxGuests ? "red.300" : null
                        }
                        bg={fieldBg}
                      />
                      <FieldError>
                        {errors?.maxGuests && touched?.maxGuests && errors?.maxGuests}
                      </FieldError>
                    </Box>
                  </SimpleGrid>

                  <Box>
                    <FormLabel fontSize="sm" fontWeight="600">
                      Address
                    </FormLabel>
                    <Input
                      name="address"
                      value={values?.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Unit address or location reference"
                      bg={fieldBg}
                    />
                  </Box>
                </Stack>
              </Section>

              <Section
                title="Pricing & Fees"
                description="Set the base nightly rate and manual fee defaults for reservations."
              >
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Box>
                    <FormLabel fontSize="sm" fontWeight="600">
                      Base Nightly Rate
                    </FormLabel>
                    <Input
                      name="baseNightlyRate"
                      type="number"
                      value={values?.baseNightlyRate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      borderColor={
                        errors?.baseNightlyRate && touched?.baseNightlyRate
                          ? "red.300"
                          : null
                      }
                      bg={fieldBg}
                    />
                    <FormHelperText color={subtleText} fontSize="xs">
                      Default nightly price before seasonal overrides.
                    </FormHelperText>
                    <FieldError>
                      {errors?.baseNightlyRate &&
                        touched?.baseNightlyRate &&
                        errors?.baseNightlyRate}
                    </FieldError>
                  </Box>

                  <Box>
                    <FormLabel fontSize="sm" fontWeight="600">
                      Cleaning Fee
                    </FormLabel>
                    <Input
                      name="cleaningFee"
                      type="number"
                      value={values?.cleaningFee}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      borderColor={
                        errors?.cleaningFee && touched?.cleaningFee ? "red.300" : null
                      }
                      bg={fieldBg}
                    />
                    <FieldError>
                      {errors?.cleaningFee &&
                        touched?.cleaningFee &&
                        errors?.cleaningFee}
                    </FieldError>
                  </Box>

                  <Box>
                    <FormLabel fontSize="sm" fontWeight="600">
                      Security Deposit
                    </FormLabel>
                    <Input
                      name="securityDeposit"
                      type="number"
                      value={values?.securityDeposit}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      borderColor={
                        errors?.securityDeposit && touched?.securityDeposit
                          ? "red.300"
                          : null
                      }
                      bg={fieldBg}
                    />
                    <FieldError>
                      {errors?.securityDeposit &&
                        touched?.securityDeposit &&
                        errors?.securityDeposit}
                    </FieldError>
                  </Box>
                </SimpleGrid>
              </Section>

              <Section
                title="Status & Notes"
                description="Control operational status and keep internal context for the team."
              >
                <Stack spacing={4}>
                  <Box>
                    <FormLabel fontSize="sm" fontWeight="600">
                      Status
                    </FormLabel>
                    <Select
                      name="status"
                      value={values?.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      bg={fieldBg}
                    >
                      <option value="active">Available</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                    </Select>
                    <FormHelperText color={subtleText} fontSize="xs">
                      Maintenance and inactive units can still be kept in inventory.
                    </FormHelperText>
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
                      placeholder="Internal notes, owner instructions, access details, or special handling"
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
              "Create Rental Unit"
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RentalUnitForm;
