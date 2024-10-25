import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import ContactTable from "./Contact.js";
import Spinner from "components/spinner/Spinner";
import { fetchContactCustomFiled } from "../../redux/slices/contactCustomFiledSlice.js";
import { fetchContactData } from "../../redux/slices/contactSlice.js";
import { GiClick } from "react-icons/gi";
import { useDispatch } from "react-redux";

const MultiContactModel = (props) => {
  const { onClose, isOpen, fieldName, setFieldValue, data } = props;
  const [selectedValues, setSelectedValues] = useState([]);
  const [columns, setColumns] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const dispatch = useDispatch();

  const fetchCustomDataFields = async () => {
    setIsLoding(true);
    const result = await dispatch(fetchContactCustomFiled());
    setContactData(result?.payload?.data);
    const tempTableColumns = [
      { Header: "#", accessor: "_id", isSortable: false, width: 10 },
      ...(result?.payload?.data?.[0]?.fields || [])
        .filter((field) => field?.isTableField === true)
        .map((field) => ({ Header: field?.label, accessor: field?.name })),
    ];

    setColumns(tempTableColumns);
    setIsLoding(false);
  };
  useEffect(async () => {
    await dispatch(fetchContactData());
    fetchCustomDataFields();
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  const uniqueValues = [...new Set(selectedValues)];

  const handleSubmit = async () => {
    try {
      setIsLoding(true);
      setFieldValue(fieldName, uniqueValues);
      onClose();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Contact</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoding ? (
            <Flex justifyContent={"center"} alignItems={"center"} width="100%">
              <Spinner />
            </Flex>
          ) : (
            <ContactTable
              title={"Contacts"}
              isLoding={isLoding}
              allData={data}
              tableData={data}
              type="multi"
              tableCustomFields={
                contactData?.[0]?.fields?.filter(
                  (field) => field?.isTableField === true,
                ) || []
              }
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              columnsData={columns ?? []}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            onClick={handleSubmit}
            disabled={isLoding ? true : false}
            leftIcon={<GiClick />}
          >
            {" "}
            {isLoding ? <Spinner /> : "Select"}
          </Button>
          <Button onClick={() => onClose()}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MultiContactModel;
