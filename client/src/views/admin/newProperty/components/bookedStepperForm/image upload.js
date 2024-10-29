import React from "react";
import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react";
import { MdUpload } from "react-icons/md";
import Card from "components/card/Card";

const ProfileCard = (props) => {
  const { selectedFile, handleFileChange, brandColor, id, name } = props;

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
          name={name}
          id={`avatar-upload-${id}`}
          style={{ display: "none" }}
          onChange={(e) => {
            handleFileChange(e);
          }}
        />
        <div style={{ margin: "10px" }}>
          <label htmlFor={`avatar-upload-${id}`}>
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
