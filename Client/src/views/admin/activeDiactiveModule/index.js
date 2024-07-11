import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Flex,
    Menu,
    MenuButton,
    Checkbox,
    GridItem,
    Text,
    MenuItem,
    Grid,
    MenuList,
    useColorModeValue,
    Switch,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { IoIosArrowBack } from "react-icons/io";
import Card from "components/card/Card";
import { getApi, putApi } from "services/api";
import Spinner from "components/spinner/Spinner";
import { BsThreeDots } from "react-icons/bs";

const Index = () => {
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const [allModulesData, setAllModulesData] = useState([]);
    const [moduleName, setModuleName] = useState("");
    const [moduleId, setModuleId] = useState("");
    const [fields, setFields] = useState([]);
    const [initialFields, setInitialFields] = useState([]);
    const [action, setAction] = useState(false);
    const textColor = useColorModeValue("gray.500", "white");
    const [selectedFields, setSelectedFields] = useState({});

    const handleCheckboxChange = (event, fieldId, fieldProperty) => {
        // let updatedFields = [...fields];
        // let index = fields.findIndex((field) => field._id === fieldId);
        // const isChecked = event.target.checked;

        // // If updating 'isView' and the checkbox is checked, ensure only one item can have 'isView' set to true
        // if (fieldProperty === "isView") {
        //     handleUpdateTableViewField({
        //         fieldId,
        //         isChecked,
        //     });
        // }

        // if (fieldProperty === "isView" && isChecked) {
        //     updatedFields = updatedFields.map((field, i) => {
        //         if (i !== index) {
        //             return { ...field, isView: false };
        //         }
        //         return field;
        //     });
        // }

        // updatedFields[index][fieldProperty] = isChecked;
        // setFields([...updatedFields]);

        // const valueChanged = initialFields[index][fieldProperty] !== isChecked;

        // if (valueChanged && fieldProperty !== "isView") {
        //     setSelectedFields((prevSelectedFields) => ({
        //         ...prevSelectedFields,
        //         [fieldId]: isChecked,
        //     }));
        // } else {
        //     setSelectedFields((prevSelectedFields) => {
        //         const { [fieldId]: omit, ...rest } = prevSelectedFields;
        //         return rest;
        //     });
        // }
    };

    const handleUpdateModule = async () => {
        setIsLoading(true);
        try {

            // const updates = Object.entries(selectedFields)?.map(
            //     ([fieldId, isTableField]) => ({
            //         fieldId: fieldId,
            //         isTableField,
            //     })
            // );

            // await putApi("api/custom-field/change-table-fields/", {
            //     moduleId,
            //     updates,
            // });

            // setSelectedFields({});
            // setAction((pre) => !pre);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateTableViewField = async (values) => {
        try {
            setIsLoading(true);
            // await putApi("api/custom-field/change-view-fields/", {
            //     moduleId,
            //     values,
            // });

            // setAction((pre) => !pre);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchData = async () => {
        setIsLoading(true);

        let responseAllData = await getApi(`api/custom-field`);

        setIsLoading(false);
    };

    useEffect(() => {
         fetchData();
    }, [action]);

    return (
        <>
            <Card>
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                    <Box>
                        <Text color={"secondaryGray.900"} fontSize="22px" fontWeight="700">
                            Active Diactive Module
                        </Text>
                    </Box>
                </Flex>
                <Flex
                    justifyContent={"center"}
                    alignItems={"center"}
                    fontSize="sm"
                >
                    {isLoading ? (
                        <Flex
                            justifyContent={"center"}
                            alignItems={"center"}
                            width="100%"
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                        >
                            <Spinner />
                        </Flex>
                    ) : (
                        <Grid templateColumns="repeat(12, 1fr)" p={3} gap={3} >
                            <GridItem colSpan={{ md: 6 }} >
                                <Text fontSize="15px" fontWeight="700"> left </Text>
                            </GridItem>
                            <GridItem colSpan={{ md: 6 }} >
                                <Switch isChecked />
                            </GridItem>
                            <GridItem colSpan={{ md: 6 }} >
                                <Text fontSize="15px" fontWeight="700"> left </Text>
                            </GridItem>
                            <GridItem colSpan={{ md: 6 }} >
                                <Switch isChecked />
                            </GridItem>
                            <GridItem colSpan={{ md: 6 }} >
                                <Text fontSize="15px" fontWeight="700"> left </Text>
                            </GridItem>
                            <GridItem colSpan={{ md: 6 }} >
                                <Switch isChecked />
                            </GridItem>

                            <GridItem colSpan={{ md: 12 }} mt={3} display={"flex"} justifyContent={"flex-end"}>
                                <Button
                                    colorScheme="brand"
                                    onClick={() => handleUpdateModule()}
                                    size="sm"
                                >
                                    Update
                                </Button>
                            </GridItem>

                        </Grid>
                    )}
                </Flex>

            </Card>
        </>
    );
};

export default Index;
