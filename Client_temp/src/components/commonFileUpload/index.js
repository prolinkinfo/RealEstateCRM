// Chakra imports
import {
    Box, Flex,
    Grid,
    GridItem,
    Icon,
    Text,
    useColorModeValue
} from "@chakra-ui/react";
// Custom components
// Assets
import Dropzone from "components/Dropzone";
import { MdUpload } from "react-icons/md";

export default function CommonFileUpload(props) {
    // const { used, total, count, ...rest } = props;
    const { count, text, onFileSelect } = props;
    // Chakra Color Mode
    const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
    const brandColor = useColorModeValue("brand.500", "white");
    const textColorSecondary = "gray.400";
    return (
        <Grid templateColumns="repeat(12, 1fr)" gap={2}>
            <GridItem colSpan={{ base: 12 }} >
                <Dropzone
                    w={{ base: "100%" }}
                    me='36px'
                    minH={200}
                    img={text === 'Property Photos' ? 'img' : ''}
                    csv={'csv'}
                    height={'100%'}
                    onFileSelect={onFileSelect}
                    isMultipleAllow={false}
                    content={
                        <Box>
                            <Icon as={MdUpload} w='80px' h='80px' color={brandColor} />
                            <Flex justify='center' mx='auto' mb='12px'>
                                <Text fontSize='xl' fontWeight='700' color={brandColor}>
                                    Upload File
                                </Text>
                            </Flex>
                            {count > 0 && <Text fontSize='sm' fontWeight='500' color='secondaryGray.500'>
                                Selected Files : {count}
                            </Text>}
                        </Box>
                    }
                />
            </GridItem>
            <GridItem colSpan={{ base: 12 }} >
                <Flex direction='column' >
                    <Text
                        color={textColorPrimary}
                        fontWeight='bold'
                        textAlign='start'
                        fontSize='2xl'
                        mt={{ base: "20px" }}>
                        Upload {text}
                    </Text>
                    <Text
                        color={textColorSecondary}
                        fontSize='md'
                        my={{ base: "auto" }}
                        mx='auto'
                        textAlign='start'>
                        Accepted File Type (csv, xlsx file - 15MB max) only 1 file
                    </Text>
                </Flex>
            </GridItem>
        </Grid>
    );
}