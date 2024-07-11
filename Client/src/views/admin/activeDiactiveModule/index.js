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

const Index = () => {
    const textColor = useColorModeValue("gray.500", "white");

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

    const updateData = async () => {
        try {
            setIsLoading(true);
            await putApi("api/modules/edit", values);

            setAction((pre) => !pre);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchData = async () => {
        setIsLoading(true);
        try {
            let responseAllData = await getApi(`api/modules`);
            setInitialValues(responseAllData?.data)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
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
