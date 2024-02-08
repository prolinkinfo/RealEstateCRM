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
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/localSlice";

const View = () => {

    const RoleColumn = [
        { Header: '#', accessor: '_id', width: 10, display: false },
        { Header: 'Role Name', accessor: 'roleName' },
        { Header: "Description", accessor: "description", }
    ];
    const dispatch = useDispatch()
    const userData = useSelector(state => state.user.user)

    const userName = typeof userData === 'string' ? JSON.parse(userData) : userData
    console.log(userName)

    const param = useParams()

    const handleOpenModal = (userData) => {
        setEdit(true)
        // dispatch(setIsOpen(true)); // Dispatch setIsOpen action with true value
        dispatch(setUser(userData)); // Dispatch setUser action to set user data
    };


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
                    <Edit isOpen={edit} size={size} onClose={setEdit} userData={userName} setAction={setAction} fetchData={fetchData} data={data} />
                    <Delete isOpen={deleteModel} onClose={setDelete} method='one' url='api/user/delete/' id={param.id} />



                    <Grid templateColumns="repeat(4, 1fr)" gap={3}>


                        <GridItem colSpan={{ base: 4 }}>
                            <Card >
                                <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                    <GridItem colSpan={2}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Heading size="md" mb={3} textTransform={'capitalize'}>
                                                {data?.firstName || data?.lastName ? `${data?.firstName} ${data?.lastName}` : 'User'} Information
                                            </Heading>
                                            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                                                <GridItem colStart={6} >
                                                    <Flex justifyContent={"right"}>
                                                        <Menu>
                                                            <MenuButton variant="outline" colorScheme='blackAlpha' size="sm" va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                                                Actions
                                                            </MenuButton>
                                                            <MenuDivider />
                                                            <MenuList>
                                                                <MenuItem onClick={() => onOpen()} icon={<AddIcon />}>Add</MenuItem>
                                                                <MenuItem onClick={() => setEdit(true)} icon={<EditIcon />} color='green'>Edit</MenuItem>
                                                                {data?.role !== 'superAdmin' && JSON.parse(localStorage.getItem('user'))?.role === 'superAdmin' && <>
                                                                    <MenuDivider />
                                                                    <MenuItem onClick={() => setDelete(true)} icon={<DeleteIcon />}>Delete</MenuItem>
                                                                </>}
                                                            </MenuList>
                                                        </Menu>
                                                        <Link to="/user">
                                                            <Button leftIcon={<IoIosArrowBack />} variant="brand" size="sm">
                                                                Back
                                                            </Button>
                                                        </Link>
                                                    </Flex>
                                                </GridItem>
                                            </Grid>

                                        </Box>
                                        <HSeparator />
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
                    {data?.role !== 'superAdmin' && <Card mt={3}>
                        <RoleTable fetchData={fetchData} columnsData={RoleColumn} roleModal={roleModal} setRoleModal={setRoleModal} tableData={data?.roles || []} title={'Role'} />
                    </Card>}
                    <RoleModal fetchData={fetchData} isOpen={roleModal} onClose={setRoleModal} columnsData={RoleColumn} id={param.id} tableData={roleData} interestRoles={data?.roles.map((item) => item._id)} />

                    <Card mt={3}>
                        <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                            <GridItem colStart={6} >
                                <Flex justifyContent={"right"}>
                                    <Button onClick={() => handleOpenModal(userData)} leftIcon={<EditIcon />} mr={2.5} variant="outline" size="sm" colorScheme="green">Edit</Button>
                                    {data?.role !== 'superAdmin' && JSON.parse(localStorage.getItem('user'))?.role === 'superAdmin' && <Button style={{ background: 'red.800' }} onClick={() => setDelete(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>}
                                </Flex>
                            </GridItem>
                        </Grid>
                    </Card>
                </>}
        </>
    );
};

export default View;
