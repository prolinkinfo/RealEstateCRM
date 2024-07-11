import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
    Box, Button, Flex, Grid, GridItem, Menu, MenuButton, MenuDivider, MenuItem, MenuList,

    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import Spinner from "components/spinner/Spinner";
import { constant } from "constant";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApi } from "services/api";
import { HasAccess } from "../../../redux/accessUtils";
import CustomView from "utils/customView";
import { useLocation } from 'react-router-dom';
import { FaFilePdf } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import moment from "moment";

const View = () => {

    const param = useParams()

    const user = JSON.parse(localStorage.getItem("user"));

    const buttonbg = useColorModeValue("gray.200", "white");
    const textColor = useColorModeValue("gray.500", "white");

    const [data, setData] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [isLoding, setIsLoding] = useState(false)
    const [action, setAction] = useState(false)
    const [leadData, setLeadData] = useState([])
    const location = useLocation()
    const navigate = useNavigate()
    const module = location.state.module;
    const size = "lg";

    const pathName = (name) => {
        return `/${name.toLowerCase().replace(/ /g, '-')}`;
    }

    const [permission, taskPermission, meetingPermission, callAccess, emailAccess, taskAccess, meetingAccess] = HasAccess(['Leads', 'Tasks', 'Meetings', 'Calls', 'Emails', 'Tasks', 'Meetings']);

    const download = async (data) => {
        if (data) {
            let result = await getApi(`api/document/download/`, data)
            if (result && result.status === 200) {
                window.open(`${constant.baseUrl}api/document/download/${data}`)
                toast.success('file Download successful')
            } else if (result && result.response.status === 404) {
                toast.error('file Not Found')
            }
        }
    }

    const fetchData = async () => {
        if (param.id) {
            try {
                setIsLoding(true)
                let response = await getApi(`api/form/view/${param.id}?moduleId=${module._id}`)
                setData(response?.data?.data);
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoding(false)
            }
        }
    }
    useEffect(() => {
        fetchData()
    }, [action])
    // }, [edit, addEmailHistory, addPhoneCall])

    function toCamelCase(text) {
        return text?.replace(/([a-z])([A-Z])/g, '$1 $2');
    }
    const generatePDF = () => {
        const element = document.getElementById("reports");
        if (element) {
            element.style.display = 'block';
            element.style.width = '100%'; // Adjust width for mobile
            element.style.height = 'auto';
            html2pdf()
                .from(element)
                .set({
                    margin: [0, 0, 0, 0],
                    filename: `${module.moduleName}_Details_${moment().format("DD-MM-YYYY")}.pdf`,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, allowTaint: true },
                    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
                })
                .save().then(() => {
                    element.style.display = '';
                })
            // }, 500);
        } else {
            console.error("Element with ID 'reports' not found.");
        }
    };
    const fetchCustomData = async () => {
        const response = await getApi('api/custom-field?moduleName=Leads')
        setLeadData(response.data)
    }

    useEffect(() => {
        if (fetchCustomData) fetchCustomData()
    }, [action])

    return (
        <>
            {isLoding ?
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                    <Spinner />
                </Flex> :
                <>
                    <GridItem colSpan={{ base: 12, md: 6 }} mt={{ sm: "3px", md: "5px" }} >
                        <Flex justifyContent={"right"}>
                            <Menu>
                                <MenuButton size="sm" variant="outline" colorScheme='blackAlpha' mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                    Actions
                                </MenuButton>
                                <MenuDivider />
                                <MenuList minWidth={2}>
                                    <MenuItem color={'blue'} onClick={() => onOpen()} alignItems={"start"} icon={<AddIcon />}>Add</MenuItem>
                                    <MenuItem onClick={() => setEdit(true)} alignItems={"start"} icon={<EditIcon />}>Edit</MenuItem>
                                    <MenuItem onClick={generatePDF} alignItems={"start"} icon={<FaFilePdf />} display={"flex"} style={{ alignItems: "center" }}>Print as PDF</MenuItem >
                                    <>
                                        <MenuDivider />
                                        <MenuItem alignItems={"start"} color={'red'} onClick={() => setDelete(true)} icon={<DeleteIcon />}>Delete</MenuItem>
                                    </>
                                </MenuList>
                            </Menu>
                            <Link to={pathName(module.moduleName)}>
                                <Button leftIcon={<IoIosArrowBack />} size='sm' variant="brand">
                                    Back
                                </Button>
                            </Link>
                        </Flex>
                    </GridItem>
                    <Box style={{ margin: "10px 0" }}>
                        <CustomView data={module} fieldData={data} id="reports" />
                    </Box>
                    <Card mt={3}>
                        <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                            <GridItem colStart={6} >
                                <Flex justifyContent={"right"}>
                                    <Button size='sm' onClick={() => setEdit(true)} leftIcon={<EditIcon />} mr={2.5} variant="outline" colorScheme="green">Edit</Button>
                                    <Button size='sm' style={{ background: 'red.800' }} onClick={() => setDelete(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>
                                </Flex>
                            </GridItem>
                        </Grid>
                    </Card>

                </>
            }
        </>
    );
};

export default View;
