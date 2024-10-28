import React from "react";
import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react";
import { MdUpload } from "react-icons/md";
import Card from "components/card/Card";

const ProfileCard = ({
  selectedFile,
  handleFileChange,
  handleSecondFileChange,
  setFieldValue,
  brandColor,
}) => {
  console.log(setFieldValue, "setFieldValue");
  return (
    <Card className="profile-card">
      <Box style={{ textAlign: "center" }}>
        {selectedFile ? (
          <img
            src={selectedFile}
            alt="User Avatar"
            style={{
              width: 200,
              height: 150,
              margin: "16px auto",
            }}
          />
        ) : (
          <Box>
            <Icon as={MdUpload} w="80px" h="80px" color={brandColor} />
            <Flex justify="center" mx="auto" mb="12px">
              <Text fontSize="xl" fontWeight="700" color={brandColor}>
                Upload Files
              </Text>
            </Flex>
          </Box>
        )}
        <input
          accept="image/*"
          type="file"
          id="avatar-upload"
          style={{ display: "none" }}
          onChange={(e) => {
            handleFileChange(e, setFieldValue);
            handleSecondFileChange(e, setFieldValue);
          }}
        />
        <div style={{ margin: "10px" }}>
          {/* Use the label to trigger the file input */}
          <label htmlFor="avatar-upload">
            <Button as="span" variant="outlined" color="brand">
              Upload
            </Button>
          </label>
        </div>
      </Box>
    </Card>
  );
};

export default ProfileCard;
