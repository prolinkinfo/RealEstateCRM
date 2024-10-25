import {
  Button,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Flex,
  Select,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { IoLogoUsd } from "react-icons/io";
import { postApi } from "services/api";
import { useParams } from "react-router-dom";

const UnitTypeView = (props) => {
  const { onClose, isOpen, data, unitTypeList, setAction } = props;
  const [selectedUnitType, setSelectedUnitType] = useState("");

  const { id } = useParams();
  const unitIdData = data?.unit?.unitType;
  const unitTypeIdData = data?.unitType?._id;

  useEffect(() => {
    if (unitIdData === unitTypeIdData) {
      setSelectedUnitType(unitIdData);
    }
    if (!data?.unitType?.name) {
      setSelectedUnitType("");
    }
  }, [unitIdData, unitTypeIdData]);

  const handleChange = async (event) => {
    const newValue = event?.target?.value;
    let response = await postApi(
      `api/property/update-unit-type/${id}/${data?.unit?._id}/${newValue}`,
    );
    if (response && response?.status === 200) {
      setSelectedUnitType(newValue);
      setAction((pre) => !pre);
      handleCloseModel();
    }
  };

  const handleCloseModel = () => {
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {`${data?.floorName?.floorNumber}`}
            <sup>{data?.floorName?.floorNumberSuffix}</sup> Floor -{" "}
            {data?.unit?.flateName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
              <GridItem colSpan={{ base: 6 }}>
                <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">
                  Name
                </Text>
                <Text>
                  {data?.unitType?.name ? data?.unitType?.name : " - "}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 6 }}>
                <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">
                  Sqm
                </Text>
                <Text>{data?.unitType?.sqm ? data?.unitType?.sqm : " - "}</Text>
              </GridItem>
              <GridItem colSpan={{ base: 6 }}>
                <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">
                  Price
                </Text>
                <Text display="flex" alignItems="center">
                  {data?.unitType?.price ? data?.unitType?.price : "0"}
                  <IoLogoUsd color="gray.300" borderRadius="16px" />
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 6 }}>
                <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">
                  Status
                </Text>
                <Text>{data?.unit?.status ? data?.unit?.status : "-"}</Text>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Flex>
              <Select
                placeholder={"Unit Type"}
                value={selectedUnitType}
                onChange={handleChange}
              >
                {unitTypeList?.map((unitType) => {
                  return (
                    <option value={unitType?._id}>{unitType?.name}</option>
                  );
                })}
              </Select>
            </Flex>
            <Button
              size="sm"
              sx={{
                marginLeft: 2,
                textTransform: "capitalize",
              }}
              variant="outline"
              colorScheme="red"
              onClick={handleCloseModel}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default UnitTypeView;
