import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import {
    Box,
    Flex,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    Select,
    Button,
    Grid,
    GridItem,
    Text
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { postApi } from 'services/api';
import { toast } from 'react-toastify';
import moment from 'moment';
import ExcelJS from 'exceljs';
import Card from 'components/card/Card';

function PropertyImport() {

    const location = useLocation();
    const { fileData } = location.state || {};
    const [importedFileFields, setImportedFileFields] = useState([]);
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const [importedFileData, setImportedFileData] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem("user"))?._id;
    const [filterProperty, setFilterProperty] = useState([]);

    const columns = [
        { Header: 'Fields In Crm', accessor: 'crmFields' },
        { Header: 'Fields In File', accessor: 'fileFields' },
    ];

    const fieldsInCrm = [
        { Header: 'Property Type', accessor: 'propertyType' },
        { Header: "Property Address", accessor: "propertyAddress" },
        { Header: "Listing Price", accessor: "listingPrice" },
        { Header: "Square Footage", accessor: "squareFootage" },
        { Header: "Number of Bedrooms", accessor: "numberofBedrooms" },
        { Header: "Number of Bathrooms", accessor: "numberofBathrooms" },
        { Header: "Year Built", accessor: "yearBuilt" },
        { Header: "Property Description", accessor: "propertyDescription" },
        { Header: "Lot Size", accessor: "lotSize" },
        { Header: "Parking Availability", accessor: "parkingAvailability" },
        { Header: "Appliances Included", accessor: "appliancesIncluded" },
        { Header: "Heating And Cooling Systems", accessor: "heatingAndCoolingSystems" },
        { Header: "Flooring Type", accessor: "flooringType" },
        { Header: "Exterior Features", accessor: "exteriorFeatures" },
        { Header: "Community Amenities", accessor: "communityAmenities" },
        // { Header: "", accessor: "propertyPhotos" },
        // { Header: "", accessor: "virtualToursOrVideos" },
        // { Header: "", accessor: "floorPlans" },
        // { Header: "", accessor: "propertyDocuments" },
        // { Header: "", accessor: "purchaseHistory" },
        { Header: "Listing Status", accessor: "listingStatus" },
        { Header: "Listing Agent Or Team", accessor: "listingAgentOrTeam" },
        { Header: "Listing Date", accessor: "listingDate" },
        { Header: "Marketing Description", accessor: "marketingDescription" },
        { Header: "Multiple Listing Service", accessor: "multipleListingService" },
        { Header: "Previous Owners", accessor: "previousOwners" },
        { Header: "Property Taxes", accessor: "propertyTaxes" },
        { Header: "Homeowners Association", accessor: "homeownersAssociation" },
        { Header: "Mortgage Information", accessor: "mortgageInformation" },
        { Header: "Sellers", accessor: "sellers" },
        { Header: "Buyers", accessor: "buyers" },
        { Header: "Property Managers", accessor: "propertyManagers" },
        { Header: "Contractors Or Service Providers", accessor: "contractorsOrServiceProviders" },
        { Header: "internalNotesOrComments", accessor: "internalNotesOrComments" }
    ];

    const initialValues = {
        propertyType: "",
        propertyAddress: "",
        listingPrice: "",
        squareFootage: "",
        numberofBedrooms: "",
        numberofBathrooms: "",
        yearBuilt: "",
        propertyDescription: "",
        lotSize: "",
        parkingAvailability: "",
        appliancesIncluded: "",
        heatingAndCoolingSystems: "",
        flooringType: "",
        exteriorFeatures: "",
        communityAmenities: "",
        // propertyPhotos: "",
        // virtualToursOrVideos: "",
        // floorPlans: "",
        // propertyDocuments: "",
        // purchaseHistory: "",
        listingStatus: "",
        listingAgentOrTeam: "",
        listingDate: "",
        marketingDescription: "",
        multipleListingService: "",
        previousOwners: "",
        propertyTaxes: "",
        homeownersAssociation: "",
        mortgageInformation: "",
        sellers: "",
        buyers: "",
        propertyManagers: "",
        contractorsOrServiceProviders: "",
        internalNotesOrComments: "",
        createBy: '',
        deleted: '',
        createdDate: ''
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values, { resetForm }) => {

            const propertiesData = importedFileData?.map((item, ind) => {
                const listingDate = moment(item[values.listingDate || "listingDate"]);
                const numberofBedrooms = item[values.numberofBedrooms || "numberofBedrooms"] || '';
                const numberofBathrooms = item[values.numberofBathrooms || "numberofBathrooms"] || '';
                const yearBuilt = item[values.yearBuilt || "yearBuilt"] || '';
                const previousOwners = item[values.previousOwners || "previousOwners"] || '';

                return {
                    propertyType: item[values.propertyType || "propertyType"] || '',
                    propertyAddress: item[values.propertyAddress || "propertyAddress"] || '',
                    listingPrice: item[values.listingPrice || "listingPrice"] || '',
                    squareFootage: item[values.squareFootage || "squareFootage"] || '',
                    numberofBedrooms: parseInt(numberofBedrooms) || null,
                    numberofBathrooms: parseInt(numberofBathrooms, 10) || null,
                    yearBuilt: parseInt(yearBuilt, 10) || '',
                    propertyDescription: item[values.propertyDescription || "propertyDescription"] || '',
                    lotSize: item[values.lotSize || "lotSize"] || '',
                    parkingAvailability: item[values.parkingAvailability || "parkingAvailability"] || '',
                    appliancesIncluded: item[values.appliancesIncluded || "appliancesIncluded"] || '',
                    heatingAndCoolingSystems: item[values.heatingAndCoolingSystems || "heatingAndCoolingSystems"] || '',
                    flooringType: item[values.flooringType || "flooringType"] || '',
                    exteriorFeatures: item[values.exteriorFeatures || "exteriorFeatures"] || '',
                    communityAmenities: item[values.communityAmenities || "communityAmenities"] || '',
                    // propertyPhotos: "",
                    // virtualToursOrVideos: "",
                    // floorPlans: "",
                    // propertyDocuments: "",
                    // purchaseHistory: "",
                    listingStatus: item[values.listingStatus || "listingStatus"] || '',
                    listingAgentOrTeam: item[values.listingAgentOrTeam || "listingAgentOrTeam"] || '',
                    listingDate: listingDate.isValid() ? item[values.listingDate || "listingDate"] || '' : '',
                    marketingDescription: item[values.marketingDescription || "marketingDescription"] || '',
                    multipleListingService: item[values.multipleListingService || "multipleListingService"] || '',
                    previousOwners: parseInt(previousOwners, 10) || null,
                    propertyTaxes: item[values.propertyTaxes || "propertyTaxes"] || '',
                    homeownersAssociation: item[values.homeownersAssociation || "homeownersAssociation"] || '',
                    mortgageInformation: item[values.mortgageInformation || "mortgageInformation"] || '',
                    sellers: item[values.sellers || "sellers"] || '',
                    buyers: item[values.buyers || "buyers"] || '',
                    propertyManagers: item[values.propertyManagers || "propertyManagers"] || '',
                    contractorsOrServiceProviders: item[values.contractorsOrServiceProviders || "contractorsOrServiceProviders"] || '',
                    internalNotesOrComments: item[values.internalNotesOrComments || "internalNotesOrComments"] || '',
                    createBy: userId,
                    deleted: item[values.deleted || "deleted"] || false,
                    createdDate: new Date(),
                }
            });

            console.log("values ", values)
            // AddData(propertiesData);
        }
    })

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const AddData = async (properties) => {
        try {
            setIsLoding(true);
            let response = await postApi('api/property/addMany', properties)
            if (response.status === 200) {
                toast.success(`Properties imported successfully`)
                resetForm();
                navigate('/properties');
            }
        } catch (e) {
            console.error(e);
            toast.error(`Properties import failed`)
            resetForm();
            navigate('/properties');
        }
        finally {
            setIsLoding(false)
        }
    };

    const parseFileData = async (file) => {
        const reader = new FileReader();
        const extension = file.name.split('.').pop().toLowerCase();

        reader.onload = async ({ target }) => {

            if (extension === 'csv') {
                const csv = Papa.parse(target.result, {
                    header: true,
                });
                const parsedData = csv?.data;

                if (parsedData && parsedData.length > 0) {
                    setImportedFileData(parsedData);
                    const fileHeadingFields = Object.keys(parsedData[0]);
                    setImportedFileFields(fileHeadingFields);
                } else {
                    toast.error("Empty or invalid CSV file");
                    navigate("/properties");
                }

            } else if (extension === 'xlsx') {
                const data = new Uint8Array(target.result);
                const workbook = new ExcelJS.Workbook();

                await workbook.xlsx.load(data);

                const worksheet = workbook.getWorksheet(1);
                const jsonData = [];

                // Iterate over rows and cells
                worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                    const rowData = {};
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        rowData[worksheet.getCell(1, colNumber).value] = cell.value;
                    });
                    jsonData.push(rowData);
                });
                jsonData?.splice(0, 1);
                setImportedFileData(jsonData);

                if (jsonData && jsonData.length > 0) {
                    const fileHeadingFields = Object.keys(jsonData[0]);
                    setImportedFileFields(fileHeadingFields);
                } else {
                    toast.error("Empty or invalid XLSX file");
                    navigate("/properties");
                }
            }
        };

        if (extension === 'csv') {
            reader.readAsText(file);
        } else if (extension === 'xlsx') {
            const blob = new Blob([file]);
            reader.readAsArrayBuffer(blob);
        }
    };

    useEffect(() => {
        if (fileData && fileData.length > 0) {
            const firstFile = fileData[0];
            parseFileData(firstFile);
        }
    }, [fileData]);

    // const filterProperty = fieldsInCrm.filter(field => importedFileFields.find(data => field.accessor === data || field.Header === data))
    // const filterProperty = importedFileFields.filter(field => fieldsInCrm.find(data => field === data.accessor || field === data.Header))

    useEffect(() => {
        const filterPropertyData = importedFileFields.filter(field => {
            const result = fieldsInCrm.find(data => field === data?.accessor || field === data?.Header);
            if (result) {
                setFieldValue(result?.accessor, field);
                return true;
            }
            return false;
        });
        setFilterProperty(filterPropertyData);
    }, [importedFileFields]);


    return (
        <>
            <Card overflowY={"auto"} className="importTable">
                <Text color={"secondaryGray.900"}
                    fontSize="22px"
                    fontWeight="700"
                    mb='20px'
                >Import Properties </Text>
                {/* <Table variant="simple" color="gray.500" mb="24px">
                    <Thead pe="10px" borderColor={borderColor}>
                        <Tr>
                            {
                                columns.map((column, index) => (
                                    <Th pe="10px" key={index} borderColor={borderColor}>
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                            fontSize={{ sm: "14px", lg: "16px" }}
                                            color=" secondaryGray.900"
                                        >
                                            <span style={{ textTransform: "uppercase" }}>
                                                {column.Header}
                                            </span>
                                        </Flex>
                                    </Th>
                                ))
                            }
                        </Tr>
                    </Thead>
                    <Tbody overflowY={"auto"}>
                        {
                            fieldsInCrm?.map((item) => (
                                <Tr key={item.id}>
                                    <Td>{item.Header}</Td>
                                    <Td>
                                        <Select
                                            variant="flushed"
                                            fontWeight='500'
                                            isSearchable
                                            placeholder={'Select Field In File'}
                                            value={values[item.accessor]}
                                            name={item.accessor}
                                            onChange={handleChange}
                                        >
                                            {
                                                importedFileFields?.map(field => (
                                                    <option value={field} key={field}>{field}</option>
                                                ))
                                            }
                                        </Select>
                                    </Td>
                                </Tr>
                            ))
                        }
                    </Tbody>
                </Table> */}
                <Grid templateColumns="repeat(12, 1fr)" mb={3} pb={2} gap={1} borderBottom={'1px solid #e2e8f0'}>
                    {
                        columns.map((column, index) => (
                            <GridItem key={index} colSpan={{ base: 6 }} fontWeight={'600'} fontSize={{ sm: "14px", lg: "14px" }} color="secondaryGray.900" style={{ textTransform: "uppercase" }}>
                                {column.Header}
                            </GridItem>
                        ))
                    }
                </Grid>
                <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={1} overflowY={'auto'}>
                    {
                        fieldsInCrm?.map((item, index) => (
                            <>
                                <GridItem colSpan={{ base: 6 }} key={item.id} mt='10px'>
                                    {item.Header}
                                </GridItem>
                                <GridItem colSpan={{ base: 4 }}>
                                    <Select
                                        variant="flushed"
                                        fontWeight='500'
                                        isSearchable
                                        value={values[item.accessor]}
                                        name={item.accessor}
                                        onChange={handleChange}
                                    >
                                        <option value=''> {filterProperty ? filterProperty.find((data) => (item.Header === data || item.accessor === data) && data) ? filterProperty.find((data) => (item.Header === data || item.accessor === data) && data) : 'Select Field In File' : 'Select Field In File'}</option>                                        {
                                            importedFileFields?.map(field => (
                                                <option value={field} key={field}>{field}</option>
                                            ))
                                        }
                                    </Select>
                                </GridItem>
                            </>
                        ))
                    }
                </Grid>

                <Flex Flex justifyContent={'end'} mt='5' >
                    <Button size="sm" onClick={() => handleSubmit()} variant="brand">Save</Button>
                </Flex>
            </Card>
        </>
    )
}

export default PropertyImport