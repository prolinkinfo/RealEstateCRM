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
import Spinner from "components/spinner/Spinner";
import { fetchPropertyCustomFiled } from "../../redux/slices/propertyCustomFiledSlice.js";
import { fetchPropertyData } from "../../redux/slices/propertySlice.js";
import PropertyTable from "./Property.js";
import { GiClick } from "react-icons/gi";
import { useDispatch } from "react-redux";

const MultiPropertyModel = (props) => {
  const { onClose, isOpen, fieldName, setFieldValue, data, selectedItems } =
    props;
  const propertyIndex = selectedItems?.map((item) => item?._id);

  const [selectedValues, setSelectedValues] = useState(propertyIndex);
  const [columns, setColumns] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const dispatch = useDispatch();

  const fetchCustomDataFields = async () => {
    setIsLoding(true);
    const result = await dispatch(fetchPropertyCustomFiled());
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
  useEffect(() => {
    setSelectedValues(propertyIndex);
  }, [selectedItems]);

  useEffect(async () => {
    await dispatch(fetchPropertyData());
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
        <ModalHeader>Select Property</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoding ? (
            <Flex justifyContent={"center"} alignItems={"center"} width="100%">
              <Spinner />
            </Flex>
          ) : (
            <PropertyTable
              title={"Property"}
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

export default MultiPropertyModel;
