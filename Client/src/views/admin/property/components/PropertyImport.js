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
    Button
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { postApi } from 'services/api';
import { toast } from 'react-toastify';
import moment from 'moment';
import ExcelJS from 'exceljs';

function PropertyImport() {

    const location = useLocation();
    const { fileData } = location.state || {};
    const [importedFileFields, setImportedFileFields] = useState([]);
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const [importedFileData, setImportedFileData] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem("user"))?._id;

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
        { Header: "internalNotesOrComments", accessor: "internalNotesOrComments" },
        { Header: "Property Deleted", accessor: "deleted" },
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
                
                return {
                    propertyType: item[values.propertyType || "propertyType"] || '',
                    propertyAddress: item[values.propertyAddress || "propertyAddress"] || '',
                    listingPrice: item[values.listingPrice || "listingPrice"] || '',
                    squareFootage: item[values.squareFootage || "squareFootage"] || '',
                    numberofBedrooms: item[values.numberofBedrooms || "numberofBedrooms"] || '',
                    numberofBathrooms: item[values.numberofBathrooms || "numberofBathrooms"] || '',
                    yearBuilt: item[values.yearBuilt || "yearBuilt"] || '',
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
                    previousOwners: item[values.previousOwners || "previousOwners"] || '',
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

            AddData(propertiesData);
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
            toast.success(`Properties import failed`)
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
                setImportedFileData(parsedData);

                const fileHeadingFields = Object.keys(parsedData[0]);
                setImportedFileFields(fileHeadingFields);

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
                setImportedFileData(jsonData);

                const fileHeadingFields = Object.keys(jsonData[0]);
                setImportedFileFields(fileHeadingFields);
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

    return (
        <>
            <Box overflowY={"auto"} className="table-fix-container">
                <Table variant="simple" color="gray.500" mb="24px">
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
                </Table>
            </Box>
            <Box mt={5}>
                <Button onClick={() => handleSubmit()} variant="brand">Next</Button>
            </Box>
        </>
    )
}

export default PropertyImport