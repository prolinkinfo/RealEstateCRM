import {
  Flex,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import ContactModel from "components/commonTableModel/ContactModel";
import LeadModel from "components/commonTableModel/LeadModel";
import { useEffect, useState } from "react";
import { LiaMousePointerSolid } from "react-icons/lia";
import { getApi } from "services/api";
import { HasAccess } from "../../../../../redux/accessUtils";

const UserDetailsForm = (props) => {
  const { formik } = props;
  const { values, setFieldValue, handleChange, handleBlur, errors, touched } =
    formik;
  const user = JSON?.parse(localStorage?.getItem("user"));

  const [contactModelOpen, setContactModelOpen] = useState(false);
  const [leadModelOpen, setLeadModelOpen] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [leadList, setLeadList] = useState([]);

  const [leadAccess, contactAccess] = HasAccess(["Leads", "Contacts"]);

  const getLeadContactlist = async () => {
    try {
      let result;
      if (values?.category === "Contact" && contactList?.length <= 0) {
        result = await getApi(
          user.role === "superAdmin"
            ? "api/contact/"
            : `api/contact/?createBy=${user._id}`
        );
        setContactList(result?.data);
      } else if (values?.category === "Lead" && leadList?.length <= 0) {
        result = await getApi(
          user?.role === "superAdmin"
            ? "api/lead/"
            : `api/lead/?createBy=${user._id}`
        );
        setLeadList(result?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getLeadContactlist();
  }, [values?.category]);

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
      {/* Contact Model  */}
      <ContactModel
        isOpen={contactModelOpen}
        data={contactList}
        onClose={setContactModelOpen}
        values={values}
        fieldName="reletedContact"
        setFieldValue={setFieldValue}
      />
      {/* Lead Model  */}
      <LeadModel
        isOpen={leadModelOpen}
        data={leadList}
        onClose={setLeadModelOpen}
        values={values}
        fieldName="releetedLead"
        setFieldValue={setFieldValue}
      />

      <GridItem colSpan={{ base: 12 }}>
        <FormLabel
          display="flex"
          ms="4px"
          fontSize="sm"
          fontWeight="500"
          mb="8px"
        >
          Related
        </FormLabel>
        <RadioGroup
          onChange={(e) => {
            setFieldValue("category", e);
            setFieldValue("reletedContact", null);
            setFieldValue("releetedLead", null);
          }}
          value={values?.category}
        >
          <Stack direction="row">
            {(user?.role === "superAdmin" || contactAccess?.create) && (
              <Radio value="Contact">Contact</Radio>
            )}
            {(user?.role === "superAdmin" || leadAccess?.create) && (
              <Radio value="Lead">Lead</Radio>
            )}
          </Stack>
        </RadioGroup>
        <Text mb="10px" color={"red"}>
          {errors?.category && touched?.category && errors?.category}
        </Text>
      </GridItem>
      {values?.category === "Contact" ? (
        <>
          <GridItem colSpan={{ base: 12 }}>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              mb="8px"
            >
              Releted To Contact
            </FormLabel>
            <Flex justifyContent="space-between">
              <Select
                value={values?.reletedContact || null}
                name="reletedContact"
                onChange={handleChange}
                mb={
                  errors?.reletedContact && touched?.reletedContact
                    ? undefined
                    : "10px"
                }
                fontWeight="500"
                placeholder={"Releted To Contact"}
                borderColor={
                  errors?.reletedContact && touched?.reletedContact
                    ? "red.300"
                    : null
                }
              >
                {contactList?.map((item) => {
                  return (
                    <option value={item?._id} key={item?._id}>
                      {item?.fullName}
                    </option>
                  );
                })}
              </Select>
              <IconButton
                onClick={() => setContactModelOpen(true)}
                ml={2}
                fontSize="25px"
                icon={<LiaMousePointerSolid />}
              />
            </Flex>
            <Text mb="10px" color={"red"}>
              {errors?.reletedContact &&
                touched?.reletedContact &&
                errors?.reletedContact}
            </Text>
          </GridItem>
        </>
      ) : values?.category === "Lead" ? (
        <>
          <GridItem colSpan={{ base: 12 }}>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              mb="8px"
            >
              Releted To Lead
            </FormLabel>
            <Flex justifyContent="space-between">
              <Select
                value={values?.releetedLead || null}
                name="releetedLead"
                onChange={handleChange}
                mb={
                  errors?.releetedLead && touched?.releetedLead
                    ? undefined
                    : "10px"
                }
                fontWeight="500"
                placeholder={"Releted To Lead"}
                borderColor={
                  errors?.releetedLead && touched?.releetedLead
                    ? "red.300"
                    : null
                }
              >
                {leadList?.map((item) => {
                  return (
                    <option value={item?._id} key={item?._id}>
                      {item?.leadName}
                    </option>
                  );
                })}
              </Select>
              <IconButton
                onClick={() => setLeadModelOpen(true)}
                ml={2}
                fontSize="25px"
                icon={<LiaMousePointerSolid />}
              />
            </Flex>
            <Text mb="10px" color={"red"}>
              {errors?.releetedLead &&
                touched?.releetedLead &&
                errors?.releetedLead}
            </Text>
          </GridItem>
        </>
      ) : (
        ""
      )}
    </Grid>
  );
};

export default UserDetailsForm;
