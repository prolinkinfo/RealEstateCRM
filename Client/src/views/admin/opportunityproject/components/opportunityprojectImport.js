import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import {
    Flex,
    useColorModeValue,
    Select,
    Button,
    Text,
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
    const { fileData, customFields } = location.state || {};
    const [importedFileFields, setImportedFileFields] = useState([]);
    const [importedFileData, setImportedFileData] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const navigate = useNavigate();
    const [filterLead, setFilterLead] = useState([]);

    const columns = [
        { Header: 'Fields In Crm', accessor: 'crmFields' },
        { Header: 'Fields In File', accessor: 'fileFields' },
    ];

    const initialFieldValues = Object.fromEntries(
        (customFields || []).map(field => [field?.name, ''])
    );
    const initialValues = {
        ...initialFieldValues
    };

    const fieldsInCrm = [
        ...customFields?.map((field) => ({ Header: field?.label, accessor: field?.name, type: field?.type, formikType: field?.validations?.find(obj => obj.hasOwnProperty('formikType')) }))
    ];

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values, { resetForm }) => {

            const leadsData = importedFileData?.map((item, ind) => {
                const lead = {
                    createdDate: new Date(),
                    deleted: item[values.deleted || "deleted"] || false,
                    createBy: JSON.parse(localStorage.getItem('user'))._id,
                };

                fieldsInCrm?.forEach(field => {
                    const selectedField = values[field?.accessor];
                    const fieldValue = item[selectedField] || '';

                    if (field?.type?.toLowerCase() === "date") {
                        lead[field?.accessor] = moment(fieldValue).isValid() ? fieldValue : '';
                    } else if (field?.type?.toLowerCase() === "number" && ['positive', 'negative'].includes(field?.formikType?.toLowerCase())) {
                        lead[field?.accessor] = parseFloat(fieldValue) || '';
                    } else if (field?.type?.toLowerCase() === "number") {
                        lead[field?.accessor] = parseInt(fieldValue, 10) || '';
                    } else {
                        lead[field?.accessor] = fieldValue;
                    }
                });

                return lead;
            });

            AddData(leadsData);
        }
    })

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const AddData = async (leads) => {
        try {
            setIsLoding(true);
            let response = await postApi('api/add', leads)
            if (response.status === 200) {
                toast.success(`opportunityroject imported successfully`)
                resetForm();
                navigate('/opportunityroject');
            }
        } catch (e) {
            console.error(e);
            toast.error(`opportunityroject import failed`)
            resetForm();
            navigate('/opportunityroject');
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
                    navigate("/opportunityproject");
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

    useEffect(() => {
        const filterLeadData = importedFileFields?.filter(field => {
            const result = fieldsInCrm?.find(data => field === data?.accessor || field === data?.Header);
            if (result) {
                setFieldValue(result?.accessor, field);
                return true;
            }
            return false;
        });
        setFilterLead(filterLeadData);
    }, [importedFileFields]);
}

export default LeadImport