// Chakra imports
import {
  Box, Flex,
  Grid,
  GridItem,
  Icon,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
// Assets
import Dropzone from "components/Dropzone";
import { MdUpload } from "react-icons/md";

export default function Upload(props) {
  const { used, total, count, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const brandColor = useColorModeValue("brand.500", "white");
  const textColorSecondary = "gray.400";
  return (
    <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
      <GridItem colSpan={{ base: 12, '2xl': 5 }} >
        <Dropzone
          w={{ base: "100%", "2xl": "240px" }}
          me='36px'
          minH={200}
          height={'100%'}
          onFileSelect={props.onFileSelect}
          content={
            <Box>
              <Icon as={MdUpload} w='70px' h='70px' color={brandColor} />
              <Flex justify='center' mx='auto' mb='12px'>
                <Text fontSize='xl' fontWeight='700' color={brandColor}>
                  Upload Files
                </Text>
              </Flex>
              <Text fontSize='sm' fontWeight='500' color='secondaryGray.500'>
                {count > 0 && <Text fontSize='sm' fontWeight='500' color='secondaryGray.500'>
                  Selected Files : {count}
                </Text>}
              </Text>
            </Box>
          }
        />
      </GridItem>
      <GridItem colSpan={{ base: 12, '2xl': 7 }} >
        <Flex direction='column' >
          <Text
            color={textColorPrimary}
            fontWeight='bold'
            textAlign='start'
            fontSize='2xl'
            mt={{ base: "20px", "2xl": "50px" }}>
            Upload Files
          </Text>
          <Text
            color={textColorSecondary}
            fontSize='md'
            my={{ base: "auto", "2xl": "10px" }}
            mx='auto'
            textAlign='start'>
            Accepted File Types (Images, PDFs, Word docs, Powerpoint, Excel, ZIP, and video files - 15MB max)
          </Text>
        </Flex>
      </GridItem>
    </Grid>
  );
}

