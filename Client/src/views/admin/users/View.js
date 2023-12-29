import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Grid, GridItem, Heading, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useDisclosure } from "@chakra-ui/react";
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { getApi } from "services/api";
import Add from "./Add";
import Delete from "./Delete";
import Edit from "./Edit";
import RoleTable from "./components/roleTable";
import { LiaCriticalRole } from "react-icons/lia";
import RoleModal from "./components/roleModal";

const View = () => {

    const RoleColumn = [
        { Header: '#', accessor: '_id', width: 10, display: false },
        { Header: 'Role Name', accessor: 'roleName' },
        { Header: "Description", accessor: "description", }
    ];

    const param = useParams()

    const [data, setData] = useState()
    const [roleData, setRoleData] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [roleModal, setRoleModal] = useState(false);
    const [isLoding, setIsLoding] = useState(false)
    const [action, setAction] = useState(false)

    const size = "lg";

    const fetchData = async () => {
        setIsLoding(true)
        let response = await getApi('api/user/view/', param.id)
        setData(response.data);
        setIsLoding(false)
    }

    useEffect(() => {
        fetchData()
    }, [action])

    useEffect(async () => {
        setIsLoding(true);
        let result = await getApi("api/role-access");
        setRoleData(result.data);
        setIsLoding(false);
    }, [])

    return (
        <>
            {isLoding ?
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                    <Spinner />
                </Flex> : <>
                    <Add isOpen={isOpen} size={size} onClose={onClose} />
                    <Edit isOpen={edit} size={size} onClose={setEdit} setAction={setAction} />
                    <Delete isOpen={deleteModel} onClose={setDelete} method='one' url='api/user/delete/' id={param.id} />

                    <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                        <GridItem colStart={6} >
                            <Flex justifyContent={"right"}>
                                <Menu>
                                    <MenuButton variant="outline" colorScheme='blackAlpha' va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                        Actions
                                    </MenuButton>
                                    <MenuDivider />
                                    <MenuList>
                                        <MenuItem onClick={() => onOpen()} icon={<AddIcon />}>Add</MenuItem>
                                        <MenuItem onClick={() => setEdit(true)} icon={<EditIcon />}>Edit</MenuItem>
                                        {data?.role !== 'admin' && JSON.parse(localStorage.getItem('user'))?.role === 'admin' && <>
                                            <MenuDivider />
                                            <MenuItem onClick={() => setDelete(true)} icon={<DeleteIcon />}>Delete</MenuItem>
                                        </>}
                                    </MenuList>
                                </Menu>
                                <Link to="/admin/user">
                                    <Button leftIcon={<IoIosArrowBack />} variant="brand">
                                        Back
                                    </Button>
                                </Link>
                            </Flex>
                        </GridItem>
                    </Grid>


                    <Grid templateColumns="repeat(4, 1fr)" gap={3}>


                        <GridItem colSpan={{ base: 4 }}>
                            <Card >
                                <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                    <GridItem colSpan={2}>
                                        <Box>
                                            <Heading size="md" mb={3} textTransform={'capitalize'}>
                                                {data?.firstName || data?.lastName ? `${data?.firstName} ${data?.lastName}` : 'User'} Information
                                            </Heading>
                                            <HSeparator />
                                        </Box>
                                    </GridItem>
                                    <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                        <GridItem colSpan={{ base: 2, md: 1 }}>
                                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> First Name </Text>
                                            <Text>{data?.firstName ? data?.firstName : ' - '}</Text>
                                        </GridItem>
                                        <GridItem colSpan={{ base: 2, md: 1 }}>
                                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Last Name </Text>
                                            <Text>{data?.lastName ? data?.lastName : ' - '}</Text>
                                        </GridItem>
                                        <GridItem colSpan={{ base: 2, md: 1 }}>
                                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Phone Number</Text>
                                            <Text>{data?.phoneNumber ? data?.phoneNumber : ' - '}</Text>
                                        </GridItem>
                                        <GridItem colSpan={{ base: 2, md: 1 }}>
                                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> User Email </Text>
                                            <Text>{data?.username ? data?.username : ' - '}</Text>
                                        </GridItem>
                                        {/* <GridItem colSpan={{ base: 2, md: 1 }}>
                                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Role </Text>
                                            <Text>{data?.role ? data?.role : ' - '}</Text>
                                        </GridItem> */}
                                    </Grid>
                                </Grid>
                            </Card>
                        </GridItem>

                    </Grid>
                    <Card mt={3}>
                        <RoleTable fetchData={fetchData} columnsData={RoleColumn} roleModal={roleModal} setRoleModal={setRoleModal} tableData={roleData} title={'Role'} />
                    </Card>

                    <RoleModal fetchData={fetchData} isOpen={roleModal} onClose={setRoleModal} columnsData={RoleColumn} tableData={roleData} />

                    <Card mt={3}>
                        <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                            <GridItem colStart={6} >
                                <Flex justifyContent={"right"}>
                                    <Button onClick={() => setEdit(true)} leftIcon={<EditIcon />} mr={2.5} variant="outline" colorScheme="green">Edit</Button>
                                    {data?.role !== 'admin' && JSON.parse(localStorage.getItem('user'))?.role === 'admin' && <Button style={{ background: 'red.800' }} onClick={() => setDelete(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>}
                                </Flex>
                            </GridItem>
                        </Grid>
                    </Card>
                </>}
        </>
    );
};

export default View;
