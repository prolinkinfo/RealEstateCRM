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
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { IoLogoUsd } from "react-icons/io";

const UnitTypeView = (props) => {
  const { onClose, isOpen, data } = props;

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
              <GridItem colSpan={{ base: 12 }}>
                <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">
                  Price
                </Text>
                <Text display="flex" alignItems="center">
                  {data?.unitType?.price ? data?.unitType?.price : " 0 "}{" "}
                  <IoLogoUsd color="gray.300" borderRadius="16px" />
                </Text>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              sx={{
                marginLeft: 2,
                textTransform: "capitalize",
              }}
              variant="outline"
              colorScheme="red"
              onClick={() => {
                onClose();
              }}
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
