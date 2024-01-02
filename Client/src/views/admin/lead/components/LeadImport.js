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

function LeadImport() {

    const location = useLocation();
    const { fileData } = location.state || {};
    const [importedFileFields, setImportedFileFields] = useState([]);
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const [importedFileData, setImportedFileData] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const navigate = useNavigate();

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
        { Header: "Lead Deleted", accessor: "deleted" },
        { Header: "Lead Created By", accessor: "createBy" },
        { Header: "Lead Update Date", accessor: "updatedDate" },
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
        updatedDate: '',
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
                const updatedDate = moment(item[values.updatedDate || "updatedDate"]);

                return {
                    leadName: item[values.leadName || "leadName"] || '',
                    leadEmail: item[values.leadEmail || "leadEmail"] || '',
                    leadPhoneNumber: item[values.leadPhoneNumber || "leadPhoneNumber"] || '',
                    leadAddress: item[values.leadAddress || "leadAddress"] || '',
                    leadOwner: item[values.leadOwner || "leadOwner"] || '',
                    leadScore: item[values.leadScore || "leadScore"] || '',
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
                    leadConversionRate: item[values.leadConversionRate || "leadConversionRate"] || '',
                    leadNurturingStage: item[values.leadNurturingStage || "leadNurturingStage"] || '',
                    deleted: item[values.deleted || "deleted"] || false,
                    createBy: JSON.parse(localStorage.getItem('user'))._id,
                    updatedDate: updatedDate.isValid() ? item[values.updatedDate || "updatedDate"] || '' : '',
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
            toast.success(`Leads import failed`)
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

export default LeadImport