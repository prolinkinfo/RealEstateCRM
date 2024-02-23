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
    Text,
    TableContainer,
    Grid,
    GridItem
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { postApi } from 'services/api';
import { toast } from 'react-toastify';
import moment from 'moment';
import ExcelJS from 'exceljs';
import Card from 'components/card/Card';

function LeadImport() {

    const location = useLocation();
    const { fileData } = location.state || {};
    const [importedFileFields, setImportedFileFields] = useState([]);
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const [importedFileData, setImportedFileData] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const navigate = useNavigate();
    const [filterLead, setFilterLead] = useState([]);

    const columns = [
        { Header: 'Fields In Crm', accessor: 'crmFields' },
        { Header: 'Fields In File', accessor: 'fileFields' },
    ];

    const fieldsInCrm = [
        { Header: 'Lead Name', accessor: 'leadName', width: 20 },
        { Header: "Lead Email", accessor: "leadEmail" },
        { Header: "Lead PhoneNumber", accessor: "leadPhoneNumber" },
        { Header: "Lead Address", accessor: "leadAddress" },
        { Header: "Lead Owner", accessor: "leadOwner" },
        { Header: "Lead Score", accessor: "leadScore" },
        { Header: "Lead Source", accessor: "leadSource" },
        { Header: "Lead Status", accessor: "leadStatus" },
        { Header: "Lead Source Channel", accessor: "leadSourceChannel" },
        { Header: "Lead Assigned Agent", accessor: "leadAssignedAgent" },
        { Header: "Lead Creation Date", accessor: "leadCreationDate" },
        { Header: "Lead conversion Date", accessor: "leadConversionDate" },
        { Header: "Lead FollowUp Date", accessor: "leadFollowUpDate" },
        { Header: "Lead FollowUp Status", accessor: "leadFollowUpStatus" },
        { Header: "Lead Communication Preferences", accessor: "leadCommunicationPreferences" },
        { Header: "Lead Engagement Level", accessor: "leadEngagementLevel" },
        { Header: "Lead Conversion Rate", accessor: "leadConversionRate" },
        { Header: "Lead Nurturing Stage", accessor: "leadNurturingStage" },
        { Header: "Lead Next Action", accessor: "leadNextAction" },
        { Header: "Lead Nurturing Workflow", accessor: "leadNurturingWorkflow" },
        { Header: "Lead Campaign", accessor: "leadCampaign" },
        { Header: "Lead Source Medium", accessor: "leadSourceMedium" },
    ];

    const initialValues = {
        leadName: '',
        leadEmail: '',
        leadPhoneNumber: '',
        leadAddress: '',
        leadOwner: '',
        leadScore: '',
        leadSource: '',
        leadStatus: '',
        leadSourceChannel: '',
        leadAssignedAgent: '',
        leadOwner: '',
        leadCreationDate: '',
        leadConversionDate: '',
        leadFollowUpDate: '',
        leadFollowUpStatus: '',
        leadCommunicationPreferences: '',
        leadEngagementLevel: '',
        leadConversionRate: '',
        leadNurturingStage: '',
        deleted: '',
        createBy: '',
        leadNextAction: '',
        leadNurturingWorkflow: '',
        leadCampaign: '',
        leadSourceMedium: '',
        createdDate: ''
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values, { resetForm }) => {

            const leadsData = importedFileData?.map((item, ind) => {
                const leadCreationDate = moment(item[values.leadCreationDate || "leadCreationDate"]);
                const leadConversionDate = moment(item[values.leadConversionDate || "leadConversionDate"]);
                const leadFollowUpDate = moment(item[values.leadFollowUpDate || "leadFollowUpDate"]);
                const leadScore = item[values.leadScore || "leadScore"] || '';
                const leadConversionRate = item[values.leadConversionRate || "leadConversionRate"] || '';

                return {
                    leadName: item[values.leadName || "leadName"] || '',
                    leadEmail: item[values.leadEmail || "leadEmail"] || '',
                    leadPhoneNumber: item[values.leadPhoneNumber || "leadPhoneNumber"] || '',
                    leadAddress: item[values.leadAddress || "leadAddress"] || '',
                    leadOwner: item[values.leadOwner || "leadOwner"] || '',
                    leadScore: parseInt(leadScore, 10) || null,
                    leadSource: item[values.leadSource || "leadSource"] || '',
                    leadStatus: item[values.leadStatus || "leadStatus"] || '',
                    leadSourceChannel: item[values.leadSourceChannel || "leadSourceChannel"] || '',
                    leadAssignedAgent: item[values.leadAssignedAgent || "leadAssignedAgent"] || '',
                    leadOwner: item[values.leadOwner || "leadOwner"] || '',
                    leadCreationDate: leadCreationDate.isValid() ? item[values.leadCreationDate || "leadCreationDate"] || '' : '',
                    leadConversionDate: leadConversionDate.isValid() ? item[values.leadConversionDate || "leadConversionDate"] || '' : '',
                    leadFollowUpDate: leadFollowUpDate.isValid() ? item[values.leadFollowUpDate || "leadFollowUpDate"] || '' : '',
                    leadFollowUpStatus: item[values.leadFollowUpStatus || "leadFollowUpStatus"] || '',
                    leadCommunicationPreferences: item[values.leadCommunicationPreferences || "leadCommunicationPreferences"] || '',
                    leadEngagementLevel: item[values.leadEngagementLevel || "leadEngagementLevel"] || '',
                    leadConversionRate: parseFloat(leadConversionRate) || null,
                    leadNurturingStage: item[values.leadNurturingStage || "leadNurturingStage"] || '',
                    deleted: item[values.deleted || "deleted"] || false,
                    createBy: JSON.parse(localStorage.getItem('user'))._id,
                    leadNextAction: item[values.leadNextAction || "leadNextAction"] || '',
                    leadNurturingWorkflow: item[values.leadNurturingWorkflow || "leadNurturingWorkflow"] || '',
                    leadCampaign: item[values.leadCampaign || "leadCampaign"] || '',
                    leadSourceMedium: item[values.leadSourceMedium || "leadSourceMedium"] || '',
                    createdDate: new Date()
                }
            });

            AddData(leadsData);
        }
    })

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const AddData = async (leads) => {
        try {
            setIsLoding(true);
            let response = await postApi('api/lead/addMany', leads)
            if (response.status === 200) {
                toast.success(`Leads imported successfully`)
                resetForm();
                navigate('/lead');
            }
        } catch (e) {
            console.error(e);
            toast.error(`Leads import failed`)
            resetForm();
            navigate('/lead');
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
                    navigate("/lead");
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
                    navigate("/lead");
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

    // const filterLead = fieldsInCrm.filter(field => importedFileFields.find(data => field.accessor === data || field.Header === data))
    // const filterLead = importedFileFields.filter(field => fieldsInCrm.find(data => field === data.accessor || field === data.Header))

    useEffect(() => {
        const filterContactData = importedFileFields?.filter(field => {
            const result = fieldsInCrm?.find(data => field === data?.accessor || field === data?.Header);
            if (result) {
                setFieldValue(result?.accessor, field);
                return true;
            }
            return false;
        });
        setFilterLead(filterContactData);
    }, [importedFileFields]);

    return (
        <>
            <Card overflowY={"auto"} className="importTable">
                <Text color={"secondaryGray.900"}
                    fontSize="22px"
                    fontWeight="700"
                    mb='20px'
                >Import Leads</Text>
                {/* <TableContainer overflowY={'auto'}>
                    <Table variant="simple" color="gray.500" mb="24px" >
                        <Thead pe="10px" borderColor={borderColor} >
                            <Tr>
                                {
                                    columns.map((column, index) => (
                                        <Th pe="10px" key={index} borderColor={borderColor}>
                                            <Flex
                                                justify="space-between"
                                                align="center"
                                                fontSize={{ sm: "14px", lg: "14px" }}
                                                color=" secondaryGray.900"
                                                styles={{ zIndex: 1 }}
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
                                fieldsInCrm?.map((item, index) => (
                                    <Tr key={item.id}>
                                        <Td>{item.Header}</Td>
                                        <Td >
                                            <Select
                                                variant="flushed"
                                                fontWeight='500'
                                                isSearchable
                                                value={values[item.accessor]}
                                                name={item.accessor}
                                                onChange={handleChange}
                                            >
                                                <option value=''> {importedFileFields ? filterLead.map((data) => data.accessor)[index] ? filterLead.map((data) => data.accessor)[index] : 'Select Field In File' : 'Select Field In File'}</option>
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
                </TableContainer> */}
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
                                        <option value=''> {filterLead ? filterLead.find((data) => (item.Header === data || item.accessor === data) && data) ? filterLead.find((data) => (item.Header === data || item.accessor === data) && data) : 'Select Field In File' : 'Select Field In File'}</option>
                                        {
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

export default LeadImport