import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex, GridItem,
    Text, Grid, useColorModeValue,
    Switch
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { getApi, putApi } from "services/api";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { HSeparator } from "components/separator/Separator";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { fetchModules } from "../../../redux/slices/moduleSlice";

const Index = () => {
    const textColor = useColorModeValue("gray.500", "white");

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const modules = useSelector((state) => state?.modules?.data)

    const [isLoading, setIsLoading] = useState(false);
    const [initialValues, setInitialValues] = useState([])
    const [action, setAction] = useState(false);

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        onSubmit: (_values, { resetForm }) => {
            updateData();
            resetForm()
        },
    });
    const { values, dirty, handleSubmit, setFieldValue } = formik



    const fetchData = async () => {
        setIsLoading(true);
        try {
            dispatch(fetchModules())
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    const updateData = async () => {
        try {
            setIsLoading(true);
            await putApi("api/modules/edit", values);
            fetchData()
            // setAction((pre) => !pre);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    // useEffect(() => {
    //     fetchData();
    // }, [action]);

    useEffect(() => {
        setInitialValues(modules);
    }, [modules]);

    return (
        <>
            <Card>
                <Flex justifyContent={"space-between"} alignItems={"center"} mb={5}>
                    <Box>
                        <Text color={"secondaryGray.900"} fontSize="22px" fontWeight="700">
                            Active Deactive Module
                        </Text>
                    </Box>
                    <Button
                        onClick={() => navigate("/admin-setting")}
                        variant="brand"
                        size="sm"
                        leftIcon={<IoIosArrowBack />}
                        ml={2}
                    >
                        Back
                    </Button>
                </Flex>
                <HSeparator />
                <Flex
                    mt={5}
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
                            {values?.length > 0 && values?.map((item, index) => (
                                <>
                                    <GridItem colSpan={6} >
                                        <Text fontSize="15px" fontWeight="700"> {item?.moduleName} </Text>
                                    </GridItem>
                                    <GridItem colSpan={6} >
                                        <Switch
                                            onChange={(e) => setFieldValue(`[${index}].isActive`, e.target.checked)}
                                            isChecked={item?.isActive} />
                                    </GridItem>
                                </>
                            ))}

                            <GridItem colSpan={12} mt={3} >
                                <Button
                                    colorScheme="brand"
                                    onClick={handleSubmit}
                                    disabled={!dirty}
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
