import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Grid, GridItem, Heading, Image, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { getApi } from "services/api";
import Add from "./Add";
// import Delete from "./Delete";
import Edit from "./Edit";
import PropertyPhoto from "./components/propertyPhoto";
import { HasAccess } from "../../../redux/accessUtils";
import DataNotFound from "components/notFoundData";
import xlsx from '../../../assets/img/fileImage/xlsx.png'
import jpg from '../../../assets/img/fileImage/jpg.png'
import png from '../../../assets/img/fileImage/png.png'
import pdf from '../../../assets/img/fileImage/pdf.png'
import xls from '../../../assets/img/fileImage/xls.png'
import csv from '../../../assets/img/fileImage/csv.png'
import file from '../../../assets/img/fileImage/file.png'
import CustomView from "utils/customView";

const View = () => {

    const user = JSON.parse(localStorage.getItem("user"))
    const param = useParams()
    const buttonbg = useColorModeValue("gray.200", "white");
    const textColor = useColorModeValue("gray.500", "white");

    const [data, setData] = useState()
    const [filteredContacts, setFilteredContacts] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [action, setAction] = useState(false)
    const [propertyPhoto, setPropertyPhoto] = useState(false);
    const [propertyData, setPropertyData] = useState([]);
    const [showProperty, setShowProperty] = useState(false);
    const [virtualToursorVideos, setVirtualToursorVideos] = useState(false);
    const [floorPlans, setFloorPlans] = useState(false);
    const [propertyDocuments, setPropertyDocuments] = useState(false);
    const [isLoding, setIsLoding] = useState(false)
    const [displayPropertyPhoto, setDisplayPropertyPhoto] = useState(false)
    const [type, setType] = useState(false)

    const size = "lg";

    const contactColumns = [
        { Header: 'Title', accessor: 'title' },
        { Header: "First Name", accessor: "firstName" },
        { Header: "Last Name", accessor: "lastName" },
        { Header: "Phone Number", accessor: "phoneNumber" },
        { Header: "Email Address", accessor: "email" },
        { Header: "Contact Method", accessor: "preferredContactMethod" },
    ];

    const [dynamicColumns, setDynamicColumns] = useState([...contactColumns]);
    const [selectedColumns, setSelectedColumns] = useState([...contactColumns]);

    const [addEmailHistory, setAddEmailHistory] = useState(false);
    const [addPhoneCall, setAddPhoneCall] = useState(false);

    const fetchData = async () => {
        setIsLoding(true)
        let response = await getApi('api/property/view/', param.id)
        setData(response.data.property);
        setFilteredContacts(response?.data?.filteredContacts);
        setIsLoding(false)
    }

    const fetchCustomData = async () => {
        const response = await getApi('api/custom-field?moduleName=Properties')
        setPropertyData(response.data)
    }

    useEffect(() => {
        fetchData()
        if (fetchCustomData) fetchCustomData()
    }, [action])


    const [permission, contactAccess, emailAccess, callAccess] = HasAccess(['Properties', 'Contacts', 'Emails', 'Calls']);

    return (
        <>
            <Add isOpen={isOpen} size={size} onClose={onClose} setPropertyData={setPropertyData} propertyData={propertyData[0]} />
            <Edit isOpen={edit} size={size} onClose={setEdit} setAction={setAction} setPropertyData={setPropertyData} propertyData={propertyData[0]} />
            {/* <Delete isOpen={deleteModel} onClose={setDelete} method='one' url='api/property/delete/' id={param.id} /> */}

            {isLoding ?
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                    <Spinner />
                </Flex> : <>
                    

                    <Tabs >
                        <Grid templateColumns={'repeat(12, 1fr)'} mb={3} gap={1}>
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                                <TabList sx={{
                                    border: "none",
                                    '& button:focus': { boxShadow: 'none', },
                                    '& button': {
                                        margin: { sm: "0 3px", md: "0 5px" }, padding: { sm: "5px", md: "8px" }, border: '2px solid #8080803d', borderTopLeftRadius: "10px", borderTopRightRadius: "10px", borderBottom: 0, fontSize: { sm: "12px", md: "16px" }
                                    },
                                    '& button[aria-selected="true"]': {
                                        border: "2px solid brand.200", borderBottom: 0, zIndex: '0'
                                    },
                                }} >
                                    <Tab >Information</Tab>
                                    <Tab>Gallery</Tab>
                                </TabList>

                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} mt={{ sm: "3px", md: "5px" }} >
                                <Flex justifyContent={"right"}>
                                    <Menu>
                                        {(user.role === 'superAdmin' || permission?.create || permission?.update || permission?.delete) && <MenuButton variant="outline" size="sm" colorScheme='blackAlpha' va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                            Actions
                                        </MenuButton>}
                                        <MenuDivider />
                                        <MenuList minWidth={2}>
                                            {(user.role === 'superAdmin' || permission?.create) && <MenuItem alignItems={'start'} color={'blue'} onClick={() => onOpen()} icon={<AddIcon />}>Add</MenuItem>}
                                            {(user.role === 'superAdmin' || permission?.update) && <MenuItem alignItems={'start'} onClick={() => setEdit(true)} icon={<EditIcon />}>Edit</MenuItem>}
                                            {(user.role === 'superAdmin' || permission?.delete) && <>
                                                <MenuDivider />
                                                <MenuItem alignItems={'start'} color={'red'} onClick={() => setDelete(true)} icon={<DeleteIcon />}>Delete</MenuItem>
                                            </>}
                                        </MenuList>
                                    </Menu>
                                    <Link to="/properties">
                                        <Button size="sm" leftIcon={<IoIosArrowBack />} variant="brand">
                                            Back
                                        </Button>
                                    </Link>
                                </Flex>
                            </GridItem>
                        </Grid>

                        <TabPanels>
                            <TabPanel pt={4} p={0}>
                                <CustomView data={propertyData[0]} fieldData={data} />
                            </TabPanel>

                            <TabPanel pt={4} p={0}>
                                <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Flex flexWrap={'wrap'} mb={3} justifyContent={'space-between'} alingItem={'center'} >
                                                            <Heading size="md" >
                                                                Property Photos
                                                            </Heading>
                                                            <Button size="sm" leftIcon={<AddIcon />} onClick={() => setPropertyPhoto(true)} bg={buttonbg}>Add New</Button>
                                                            <PropertyPhoto text='Property Photos' fetchData={fetchData} isOpen={propertyPhoto} onClose={setPropertyPhoto} id={param.id} />
                                                        </Flex>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Flex overflowY={"scroll"} height={"150px"} alingItem={'center'} >
                                                        {data?.propertyPhotos?.length > 0 ?
                                                            data && data?.propertyPhotos?.length > 0 && data?.propertyPhotos?.map((item) => (
                                                                <Image width={'150px'} m={1} src={item.img} alt="Your Image" />
                                                            )) : <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                                                                <DataNotFound />
                                                            </Text>}
                                                    </Flex>
                                                    {data?.propertyPhotos?.length > 0 ?
                                                        <Flex justifyContent={"end"} mt={1}>
                                                            <Button size="sm" colorScheme="brand" variant="outline" onClick={() => { setDisplayPropertyPhoto(true); setType("photo"); }}>Show more</Button>
                                                        </Flex> : ""}
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Flex flexWrap={'wrap'} mb={3} justifyContent={'space-between'} alingItem={'center'} >
                                                            <Heading size="md" >
                                                                Virtual Tours or Videos
                                                            </Heading>
                                                            <Button size="sm" leftIcon={<AddIcon />} onClick={() => setVirtualToursorVideos(true)} bg={buttonbg}>Add New</Button>
                                                            <PropertyPhoto text='Virtual Tours or Videos' fetchData={fetchData} isOpen={virtualToursorVideos} onClose={setVirtualToursorVideos} id={param.id} />
                                                        </Flex>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Flex overflowY={"scroll"} height={"150px"} alingItem={'center'} >
                                                        {data?.virtualToursOrVideos?.length > 0 ?
                                                            data && data?.virtualToursOrVideos?.length > 0 && data?.virtualToursOrVideos?.map((item) => (
                                                                <video width="200" controls autoplay loop style={{ margin: "0 5px" }}>
                                                                    <source src={item.img} type="video/mp4" />
                                                                    <source src={item.img} type="video/ogg" />
                                                                </video>
                                                            )) : <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                                                                <DataNotFound />
                                                            </Text>}

                                                    </Flex>

                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Flex flexWrap={'wrap'} mb={3} justifyContent={'space-between'} alingItem={'center'} >
                                                            <Heading size="md" >
                                                                Floor Plans
                                                            </Heading>
                                                            <Button size="sm" leftIcon={<AddIcon />} onClick={() => setFloorPlans(true)} bg={buttonbg}>Add New</Button>
                                                            <PropertyPhoto text='Floor Plans' fetchData={fetchData} isOpen={floorPlans} onClose={setFloorPlans} id={param.id} />
                                                        </Flex>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Flex overflowY={"scroll"} height={"150px"} alingItem={'center'} >
                                                        {data?.floorPlans?.length > 0 ?
                                                            data && data?.floorPlans?.length > 0 && data?.floorPlans?.map((item) => (
                                                                <Image key={item.createOn} width={'30%'} m={1} src={item.img} alt="Your Image" />
                                                            )) : <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                                                                <DataNotFound />
                                                            </Text>}
                                                    </Flex>
                                                    {data?.floorPlans?.length > 0 ?
                                                        <Flex justifyContent={"end"} mt={1}>
                                                            <Button size="sm" colorScheme="brand" variant="outline" onClick={() => { setDisplayPropertyPhoto(true); setType("floor"); }}>Show more</Button>
                                                        </Flex> : ""}
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card  >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Flex flexWrap={'wrap'} mb={3} justifyContent={'space-between'} alingItem={'center'} >
                                                            <Heading size="md" >
                                                                Property Documents
                                                            </Heading>
                                                            <Button size="sm" leftIcon={<AddIcon />} onClick={() => setPropertyDocuments(true)} bg={buttonbg}>Add New</Button>
                                                            <PropertyPhoto text='Property Documents' fetchData={fetchData} isOpen={propertyDocuments} onClose={setPropertyDocuments} id={param.id} />
                                                        </Flex>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                {/* <Flex flexWrap={'wrap'} alingItem={'center'} > */}
                                                <GridItem colSpan={12} sx={{ maxHeight: '200px', overflowX: 'auto' }}>
                                                    {data?.propertyDocuments?.length > 0 ?
                                                        (data && data?.propertyDocuments?.length > 0 && data?.propertyDocuments?.map((item) => {
                                                            const parts = item.filename.split('.');
                                                            const lastIndex = parts[parts.length - 1]
                                                            return (
                                                                <Flex alignItems={'center'} mt='3'>
                                                                    {lastIndex === 'xlsx' && <Image src={xlsx} boxSize='50px' />}
                                                                    {lastIndex === 'jpg' && <Image src={jpg} boxSize='50px' />}
                                                                    {lastIndex === 'png' && <Image src={png} boxSize='50px' />}
                                                                    {lastIndex === 'pdf' && <Image src={pdf} boxSize='50px' />}
                                                                    {lastIndex === 'xls' && <Image src={xls} boxSize='50px' />}
                                                                    {lastIndex === 'csv' && <Image src={csv} boxSize='50px' />}
                                                                    {!(lastIndex === 'xls' || lastIndex === 'csv' || lastIndex === 'png' || lastIndex === 'pdf' || lastIndex === 'xlsx' || lastIndex === 'jpg') && <Image src={file} boxSize='50px' />}
                                                                    <Text ml={2} color='green.400' onClick={() => window.open(item?.img)} cursor={'pointer'} sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>
                                                                        {item.filename}
                                                                    </Text>
                                                                </Flex>
                                                            )
                                                        }))
                                                        :
                                                        <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                                                            <DataNotFound />
                                                        </Text>}
                                                </GridItem>

                                                {/* </Flex> */}
                                            </Grid>
                                            {data?.propertyDocuments?.length > 0 ?
                                                <Flex justifyContent={"end"} mt={1}>
                                                    <Button size="sm" colorScheme="brand" variant="outline" onClick={() => { setShowProperty(true); setType("Doucument"); }}>Show more</Button>
                                                </Flex> : ""}
                                        </Card>
                                    </GridItem>
                                </Grid>
                            </TabPanel>
                        </TabPanels>

                    </Tabs>

                    {(permission?.delete || permission?.update || user?.role === 'superAdmin') && <Card mt={3}>
                        <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                            <GridItem colStart={6} >
                                <Flex justifyContent={"right"}>
                                    {permission?.update && <Button onClick={() => setEdit(true)} size="sm" leftIcon={<EditIcon />} mr={2.5} variant="outline" colorScheme="green">Edit</Button>}
                                    {permission?.delete && <Button style={{ background: 'red.800' }} size="sm" onClick={() => setDelete(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>}
                                </Flex>
                            </GridItem>
                        </Grid>
                    </Card>}
                </>}

            {/* property photo modal */}
            <Modal onClose={() => setDisplayPropertyPhoto(false)} isOpen={displayPropertyPhoto} >
                <ModalOverlay />
                <ModalContent maxWidth={"6xl"} height={"750px"}>
                    <ModalHeader>{type == "photo" ? "Property All Photos" : type == "video" ? "Virtual Tours or Videos" : type == "floor" ? "Floors plans" : ""}</ModalHeader>
                    <ModalCloseButton onClick={() => setDisplayPropertyPhoto(false)} />
                    <ModalBody overflowY={"auto"} height={"700px"}>
                        <div style={{ columns: 3 }}  >
                            {
                                type == "photo" ?
                                    data && data?.propertyPhotos?.length > 0 && data?.propertyPhotos?.map((item) => (
                                        <a href={item.img} target="_blank"> <Image width={"100%"} m={1} mb={4} src={item.img} alt="Your Image" /></a>
                                    )) :
                                    type == "video" ? data && data?.virtualToursOrVideos?.length > 0 && data?.virtualToursOrVideos?.map((item) => (
                                        <a href={item.img} target="_blank">
                                            <video width="380" controls autoplay loop style={{ margin: " 5px" }}>
                                                <source src={item.img} type="video/mp4" />
                                                <source src={item.img} type="video/ogg" />
                                            </video>
                                        </a>
                                    )) : type == "floor" ?
                                        data && data?.floorPlans?.length > 0 && data?.floorPlans?.map((item) => (
                                            <a href={item.img} target="_blank">
                                                <Image width={"100%"} m={1} mb={4} src={item.img} alt="Your Image" />
                                            </a>
                                        )) : ""
                            }
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" variant="outline" colorScheme='red' mr={2} onClick={() =>
                            setDisplayPropertyPhoto(false)} >Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* property document modal */}
            <Modal onClose={() => setShowProperty(false)} isOpen={showProperty} >
                <ModalOverlay />
                <ModalContent maxWidth={"xl"} height={"750px"}>
                    <ModalHeader>Property All Document</ModalHeader>
                    <ModalCloseButton onClick={() => setShowProperty(false)} />
                    <ModalBody overflowY={"auto"} height={"700px"}>
                        {data?.propertyDocuments?.length > 0 ?
                            (data && data?.propertyDocuments?.length > 0 && data?.propertyDocuments?.map((item) => {
                                const parts = item.filename.split('.');
                                const lastIndex = parts[parts.length - 1]
                                return (
                                    <Flex alignItems={'center'} mt='3'>
                                        {lastIndex === 'xlsx' && <Image src={xlsx} boxSize='50px' />}
                                        {lastIndex === 'jpg' && <Image src={jpg} boxSize='50px' />}
                                        {lastIndex === 'png' && <Image src={png} boxSize='50px' />}
                                        {lastIndex === 'pdf' && <Image src={pdf} boxSize='50px' />}
                                        {lastIndex === 'xls' && <Image src={xls} boxSize='50px' />}
                                        {lastIndex === 'csv' && <Image src={csv} boxSize='50px' />}
                                        {!(lastIndex === 'xls' || lastIndex === 'csv' || lastIndex === 'png' || lastIndex === 'pdf' || lastIndex === 'xlsx' || lastIndex === 'jpg') && <Image src={file} boxSize='50px' />}
                                        <Text ml={2} color='green.400' onClick={() => window.open(item?.img)} cursor={'pointer'} sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>
                                            {item.filename}
                                        </Text>
                                    </Flex>
                                )
                            }))
                            :
                            <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                                <DataNotFound />
                            </Text>}
                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" variant="outline" colorScheme='red' mr={2} onClick={() =>
                            setShowProperty(false)} >Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    );
};

export default View;
