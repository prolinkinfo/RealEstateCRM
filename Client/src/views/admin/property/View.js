import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { AspectRatio, Box, Button, Flex, Grid, GridItem, Heading, Image, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure } from "@chakra-ui/react";
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { getApi } from "services/api";
import CheckTable from "../contact/components/CheckTable";
import Add from "./Add";
import Delete from "./Delete";
import Edit from "./Edit";
import PropertyPhoto from "./components/propertyPhoto";
import { HasAccess } from "../../../redux/accessUtils";



const View = () => {

    const param = useParams()

    const [data, setData] = useState()
    const [filteredContacts, setFilteredContacts] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [action, setAction] = useState(false)
    const [propertyPhoto, setPropertyPhoto] = useState(false);

    const [virtualToursorVideos, setVirtualToursorVideos] = useState(false);
    const [floorPlans, setFloorPlans] = useState(false);
    const [propertyDocuments, setPropertyDocuments] = useState(false);
    const [isLoding, setIsLoding] = useState(false)

    const size = "lg";

    const contactColumns = [
        { Header: 'title', accessor: 'title' },
        { Header: "first Name", accessor: "firstName", },
        { Header: "last Name", accessor: "lastName", },
        { Header: "phone Number", accessor: "phoneNumber", },
        { Header: "Email Address", accessor: "email", },
        { Header: "physical Address", accessor: "physicalAddress", },
        { Header: "mailing Address", accessor: "mailingAddress", },
        { Header: "Contact Method", accessor: "preferredContactMethod", },

    ];

    const [addEmailHistory, setAddEmailHistory] = useState(false);
    const [addPhoneCall, setAddPhoneCall] = useState(false);

    const fetchData = async () => {
        setIsLoding(true)
        let response = await getApi('api/property/view/', param.id)
        setData(response.data.property);
        setFilteredContacts(response?.data?.filteredContacts);
        setIsLoding(false)
    }
    useEffect(() => {
        fetchData()
    }, [action])

    const permission = HasAccess('property');

    return (
        <>
            <Add isOpen={isOpen} size={size} onClose={onClose} />
            <Edit isOpen={edit} size={size} onClose={setEdit} setAction={setAction} />
            <Delete isOpen={deleteModel} onClose={setDelete} method='one' url='api/property/delete/' id={param.id} />

            {isLoding ?
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                    <Spinner />
                </Flex> : <>
                    {/* <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                        <GridItem colStart={6} >
                            <Flex justifyContent={"right"}>
                                <Menu>
                                    {(permission?.create || permission?.update || permission?.delete) && <MenuButton variant="outline" colorScheme='blackAlpha' va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                        Actions
                                    </MenuButton>}
                                    <MenuDivider />
                                    <MenuList>
                                        {permission?.create && <MenuItem onClick={() => onOpen()} icon={<AddIcon />}>Add</MenuItem>}
                                        {permission?.update && <MenuItem onClick={() => setEdit(true)} icon={<EditIcon />}>Edit</MenuItem>}

                                        {permission?.delete &&
                                            <>
                                                <MenuDivider />
                                                <MenuItem onClick={() => setDelete(true)} icon={<DeleteIcon />}>Delete</MenuItem>
                                            </>
                                        }
                                    </MenuList>
                                </Menu>
                                <Link to="/properties">
                                    <Button leftIcon={<IoIosArrowBack />} variant="brand">
                                        Back
                                    </Button>
                                </Link>
                            </Flex>
                        </GridItem>
                    </Grid> */}

                    <Tabs >
                        <Grid templateColumns="repeat(3, 1fr)" mb={3} gap={1}>
                            <GridItem colSpan={2}>
                                <TabList sx={{
                                    border: "none",
                                    '& button:focus': { boxShadow: 'none', },
                                    '& button': {
                                        margin: "0 5px", border: '2px solid #8080803d', borderTopLeftRadius: "10px", borderTopRightRadius: "10px", borderBottom: 0
                                    },
                                    '& button[aria-selected="true"]': {
                                        border: "2px solid brand.200", borderBottom: 0
                                    },
                                }} >
                                    <Tab >Information</Tab>
                                    <Tab>gallery</Tab>
                                </TabList>

                            </GridItem>
                            <GridItem  >
                                <Flex justifyContent={"right"}>
                                    <Menu>
                                        {(permission?.create || permission?.update || permission?.delete) && <MenuButton variant="outline" colorScheme='blackAlpha' va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                            Actions
                                        </MenuButton>}
                                        <MenuDivider />
                                        <MenuList>
                                            {permission?.create && <MenuItem onClick={() => onOpen()} icon={<AddIcon />}>Add</MenuItem>}
                                            {permission?.update && <MenuItem color={'green'} onClick={() => setEdit(true)} icon={<EditIcon />}>Edit</MenuItem>}
                                            {permission?.delete && <>
                                                <MenuDivider />
                                                <MenuItem color={'red'} onClick={() => setDelete(true)} icon={<DeleteIcon />}>Delete</MenuItem>
                                            </>}
                                        </MenuList>
                                    </Menu>
                                    <Link to="/properties">
                                        <Button leftIcon={<IoIosArrowBack />} variant="brand">
                                            Back
                                        </Button>
                                    </Link>
                                </Flex>
                            </GridItem>
                        </Grid>

                        <TabPanels>
                            <TabPanel pt={4} p={0}>
                                <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Basic Property Information
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Property Type</Text>
                                                    <Text>{data?.propertyType ? data?.propertyType : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Year Built</Text>
                                                    <Text>{data?.yearBuilt ? data?.yearBuilt : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Listing Price</Text>
                                                    <Text>{data?.listingPrice ? data?.listingPrice : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Square Footage</Text>
                                                    <Text>{data?.squareFootage ? data?.squareFootage : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Number Of Bedrooms</Text>
                                                    <Text>{data?.numberofBedrooms ? data?.numberofBedrooms : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Number Of Bathrooms</Text>
                                                    <Text>{data?.numberofBathrooms ? data?.numberofBathrooms : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Previous Owners</Text>
                                                    <Text>{data?.previousOwners ? data?.previousOwners : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Property Address</Text>
                                                    <Text>{data?.propertyAddress ? data?.propertyAddress : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Property Description </Text>
                                                    <Text>{data?.propertyDescription ? data?.propertyDescription : 'N/A'}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>


                                    <GridItem rowSpan={2} colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Property Features and Amenities
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lot Size </Text>
                                                    <Text>{data?.lotSize ? data?.lotSize : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Parking Availability </Text>
                                                    <Text textTransform={'capitalize'}>{data?.parkingAvailability ? data?.parkingAvailability : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Heating And Cooling Systems </Text>
                                                    <Text>{data?.heatingAndCoolingSystems ? data?.heatingAndCoolingSystems : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Flooring Type </Text>
                                                    <Text>{data?.flooringType ? data?.flooringType : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Exterior Features </Text>
                                                    <Text>{data?.exteriorFeatures ? data?.exteriorFeatures : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Community Amenities </Text>
                                                    <Text>{data?.communityAmenities ? data?.communityAmenities : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Appliances Included </Text>
                                                    <Text>{data?.appliancesIncluded ? data?.appliancesIncluded : 'N/A'}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Contacts Associated with Property
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Sellers </Text>
                                                    <Text>{data?.sellers ? data?.sellers : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Buyers </Text>
                                                    <Text>{data?.buyers ? data?.buyers : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Property Managers </Text>
                                                    <Text>{data?.propertyManagers ? data?.propertyManagers : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Contractors Or Service Providers </Text>
                                                    <Text>{data?.contractorsOrServiceProviders ? data?.contractorsOrServiceProviders : 'N/A'}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem rowSpan={2} colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Listing and Marketing Details
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Listing Status </Text>
                                                    <Text>{data?.listingStatus}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Listing Agent Or Team </Text>
                                                    <Text>{data?.listingAgentOrTeam}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Listing Date </Text>
                                                    <Text>{moment(data?.listingDate).format('L')}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Multiple Listing Service </Text>
                                                    <Text>{data?.multipleListingService}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Marketing Description </Text>
                                                    <Text>{data?.marketingDescription}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Financial Information
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Property Taxes </Text>
                                                    <Text>{data?.propertyTaxes}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Homeowners Association </Text>
                                                    <Text>{data?.homeownersAssociation}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Mortgage Information </Text>
                                                    <Text>{data?.mortgageInformation}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>

                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Tags or Categories
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Internal Notes Or Comments </Text>
                                                    <Text>{data?.internalNotesOrComments ? data?.internalNotesOrComments : 'N/A'}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>

                                    {filteredContacts?.length > 0 &&
                                        <GridItem colSpan={{ base: 12 }}>
                                            <Card >
                                                <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                                    <GridItem colSpan={2}>
                                                        <Box>
                                                            <Heading size="md" mb={3}>
                                                                Interested Contact
                                                            </Heading>
                                                            <HSeparator />
                                                        </Box>
                                                        <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                            <GridItem colSpan={{ base: 2 }}>
                                                                <CheckTable columnsData={contactColumns} tableData={filteredContacts} />
                                                            </GridItem>
                                                        </Grid>
                                                    </GridItem>

                                                </Grid>
                                            </Card>
                                        </GridItem>
                                    }
                                </Grid>
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
                                                            <Button leftIcon={<AddIcon />} onClick={() => setPropertyPhoto(true)} variant="brand">Add Property Photos</Button>
                                                            <PropertyPhoto text='Property Photos' fetchData={fetchData} isOpen={propertyPhoto} onClose={setPropertyPhoto} id={param.id} />
                                                        </Flex>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Flex flexWrap={'wrap'} justifyContent={'center'} alingItem={'center'} >
                                                        {data?.propertyPhotos?.map((item) => (
                                                            <Image width={'150px'} m={1} src={item.img} alt="Your Image" />
                                                        ))}
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
                                                                Virtual Tours or Videos
                                                            </Heading>
                                                            <Button leftIcon={<AddIcon />} onClick={() => setVirtualToursorVideos(true)} variant="brand">Add Virtual Tours or Videos</Button>
                                                            <PropertyPhoto text='Virtual Tours or Videos' fetchData={fetchData} isOpen={virtualToursorVideos} onClose={setVirtualToursorVideos} id={param.id} />
                                                        </Flex>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Flex flexWrap={'wrap'} justifyContent={'center'} alingItem={'center'} >
                                                        {data?.virtualToursOrVideos?.map((item) => (
                                                            <AspectRatio width={'30%'} m={1} ratio={2}>
                                                                <iframe
                                                                    title="YouTube video player"
                                                                    src={item.img}
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                ></iframe>
                                                            </AspectRatio>
                                                        ))}
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
                                                            <Button leftIcon={<AddIcon />} onClick={() => setFloorPlans(true)} variant="brand">Add Floor Plans</Button>
                                                            <PropertyPhoto text='Floor Plans' fetchData={fetchData} isOpen={floorPlans} onClose={setFloorPlans} id={param.id} />
                                                        </Flex>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Flex flexWrap={'wrap'} justifyContent={'center'} alingItem={'center'} >
                                                        {data?.floorPlans?.map((item) => (
                                                            <Image key={item.createOn} width={'30%'} m={1} src={item.img} alt="Your Image" />
                                                        ))}
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
                                                                Property Documents
                                                            </Heading>
                                                            <Button leftIcon={<AddIcon />} onClick={() => setPropertyDocuments(true)} variant="brand">Add Property Documents</Button>
                                                            <PropertyPhoto text='Property Documents' fetchData={fetchData} isOpen={propertyDocuments} onClose={setPropertyDocuments} id={param.id} />
                                                        </Flex>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Flex flexWrap={'wrap'} justifyContent={'center'} alingItem={'center'} >
                                                        {data?.propertyDocuments?.map((item) => (
                                                            <Text color='green.400' onClick={() => window.open(item?.img)} cursor={'pointer'} sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>
                                                                {item.filename}
                                                            </Text>
                                                        ))}
                                                    </Flex>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>

                                </Grid>
                            </TabPanel>
                        </TabPanels>

                    </Tabs>

                    {(permission?.delete || permission?.update) && <Card mt={3}>
                        <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                            <GridItem colStart={6} >
                                <Flex justifyContent={"right"}>
                                    {permission?.update && <Button onClick={() => setEdit(true)} leftIcon={<EditIcon />} mr={2.5} variant="outline" colorScheme="green">Edit</Button>}
                                    {permission?.delete && <Button style={{ background: 'red.800' }} onClick={() => setDelete(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>}
                                </Flex>
                            </GridItem>
                        </Grid>
                    </Card>}
                </>}
        </>
    );
};

export default View;
