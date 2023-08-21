// Chakra imports
import { Button, Flex, Input, useColorModeValue } from "@chakra-ui/react";
// Assets
import React from "react";
import { useDropzone } from "react-dropzone";

function Dropzone(props) {
  const { content, ...rest } = props;
  const { getRootProps, getInputProps } = useDropzone({
    multiple: true, // Set to false if you only want to allow selecting one file
    onDrop: (acceptedFiles) => {
      if (props.img === "img") {
        const imageFiles = acceptedFiles.filter((file) => {
          return file.type.startsWith("image/");
        })
        if (imageFiles.length > 0) {
          props.onFileSelect(imageFiles);
        }
      } else if (acceptedFiles.length > 0) {
        props.onFileSelect(acceptedFiles);
      }

    },
  });

  const bg = useColorModeValue("gray.100", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");
  return (
    <Flex
      align='center'
      justify='center'
      bg={bg}
      border='1px dashed'
      borderColor={borderColor}
      borderRadius='16px'
      w='100%'
      h='max-content'
      minH='100%'
      cursor='pointer'
      {...getRootProps({ className: "dropzone" })}
      {...rest}>
      <Input type="file" variant='main' multiple {...getInputProps()} />
      <Button variant='no-effects'>{content}</Button>
    </Flex>
  );
}

export default Dropzone;
