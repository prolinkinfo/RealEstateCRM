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

function ContactImport() {

    const location = useLocation();
    const { fileData } = location.state || {};
    const [importedFileFields, setImportedFileFields] = useState([]);
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const [importedFileData, setImportedFileData] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem('user'))._id;

    const columns = [
        { Header: 'Fields In Crm', accessor: 'crmFields' },
        { Header: 'Fields In File', accessor: 'fileFields' },
    ];

    const fieldsInCrm = [
        { Header: 'First Name', accessor: 'firstName' },
        { Header: "Last Name", accessor: "lastName" },
        { Header: "Title", accessor: "title" },
        { Header: "Email", accessor: "email" },
        { Header: "Phone Number", accessor: "phoneNumber" },
        { Header: "Mobile Number", accessor: "mobileNumber" },
        { Header: "Physical Address", accessor: "physicalAddress" },
        { Header: "Mailling Address", accessor: "mailingAddress" },
        { Header: "Preferred Contact Method", accessor: "preferredContactMethod" },
        { Header: "Lead Source", accessor: "leadSource" },
        { Header: "Referral Source", accessor: "referralSource" },
        { Header: "Campaign Source", accessor: "campaignSource" },
        { Header: "Lead Status", accessor: "leadStatus" },
        { Header: "Lead Rating", accessor: "leadRating" },
        { Header: "Lead Conversion Probability", accessor: "leadConversionProbability" },
        { Header: "Notes and Comments", accessor: "notesandComments" },
        { Header: "Tags Or Labels For Categorizing Contacts", accessor: "tagsOrLabelsForcategorizingcontacts" },
        { Header: "Birthday", accessor: "birthday" },
        { Header: "Anniversary", accessor: "anniversary" },
        { Header: "Key Milestones", accessor: "keyMilestones" },
        { Header: "Date of Birth", accessor: "dob" },
        { Header: "Gender", accessor: "gender" },
        { Header: "Occupation", accessor: "occupation" },
        { Header: "Interests Or Hobbies", accessor: "interestsOrHobbies" },
        { Header: "Communication Frequency", accessor: "communicationFrequency" },
        { Header: "Preferences", accessor: "preferences" },
        { Header: "LinkedIn Profile URL", accessor: "linkedInProfile" },
        { Header: "Facebook", accessor: "facebookProfile" },
        { Header: "Twitter Username", accessor: "twitterHandle" },
        { Header: "Other Social Media Profiles URL", accessor: "otherProfiles" },
        { Header: "Assigned Agent or Team Member", accessor: "agentOrTeamMember" },
        { Header: "Internal Notes or Comments for Team Collaboration", accessor: "internalNotesOrComments" },
        { Header: "Lead Deleted", accessor: "deleted" },
    ];

    const initialValues = {
        firstName: "",
        lastName: "",
        title: "",
        email: "",
        phoneNumber: "",
        mobileNumber: "",
        physicalAddress: "",
        mailingAddress: "",
        preferredContactMethod: "",
        leadSource: "",
        referralSource: "",
        campaignSource: "",
        leadStatus: "",
        leadRating: "",
        leadConversionProbability: "",
        notesandComments: "",
        tagsOrLabelsForcategorizingcontacts: "",
        birthday: "",
        anniversary: "",
        keyMilestones: "",
        dob: "",
        gender: "",
        occupation: "",
        interestsOrHobbies: "",
        communicationFrequency: "",
        preferences: "",
        linkedInProfile: "",
        facebookProfile: "",
        twitterHandle: "",
        otherProfiles: "",
        agentOrTeamMember: "",
        internalNotesOrComments: "",
        createBy: "",
        deleted: "",
        createBy: "",
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values, { resetForm }) => {

            const contactsData = importedFileData?.map((item, ind) => {
                const birthday = moment(item[values.birthday || "birthday"]);
                const anniversary = moment(item[values.anniversary || "anniversary"]);
                const dob = moment(item[values.dob || "dob"]);

                return {
                    firstName: item[values.firstName || "firstName"] || '',
                    lastName: item[values.lastName || "lastName"] || '',
                    title: item[values.title || "title"] || '',
                    email: item[values.email || "email"] || '',
                    phoneNumber: item[values.phoneNumber || "phoneNumber"] || '',
                    mobileNumber: item[values.mobileNumber || "mobileNumber"] || '',
                    physicalAddress: item[values.physicalAddress || "physicalAddress"] || '',
                    mailingAddress: item[values.mailingAddress || "mailingAddress"] || '',
                    preferredContactMethod: item[values.preferredContactMethod || "preferredContactMethod"] || '',
                    leadSource: item[values.leadSource || "leadSource"] || '',
                    referralSource: item[values.referralSource || "referralSource"] || '',
                    campaignSource: item[values.campaignSource || "campaignSource"] || '',
                    leadStatus: item[values.leadStatus || "leadStatus"] || '',
                    leadRating: item[values.leadRating || "leadRating"] || '',
                    leadConversionProbability: item[values.leadConversionProbability || "leadConversionProbability"] || '',
                    notesandComments: item[values.notesandComments || "notesandComments"] || '',
                    tagsOrLabelsForcategorizingcontacts: item[values.tagsOrLabelsForcategorizingcontacts || "tagsOrLabelsForcategorizingcontacts"] || '',
                    birthday: birthday.isValid() ? item[values.birthday || "birthday"] || '' : '',
                    anniversary: anniversary.isValid() ? item[values.anniversary || "anniversary"] || '' : '',
                    keyMilestones: item[values.keyMilestones || "keyMilestones"] || '',
                    dob: dob.isValid() ? item[values.dob || "dob"] || '' : '',
                    gender: item[values.gender || "gender"] || '',
                    occupation: item[values.occupation || "occupation"] || '',
                    interestsOrHobbies: item[values.interestsOrHobbies || "interestsOrHobbies"] || '',
                    communicationFrequency: item[values.communicationFrequency || "communicationFrequency"] || '',
                    preferences: item[values.preferences || "preferences"] || '',
                    linkedInProfile: item[values.linkedInProfile || "linkedInProfile"] || '',
                    facebookProfile: item[values.facebookProfile || "facebookProfile"] || '',
                    twitterHandle: item[values.twitterHandle || "twitterHandle"] || '',
                    otherProfiles: item[values.otherProfiles || "otherProfiles"] || '',
                    agentOrTeamMember: item[values.agentOrTeamMember || "agentOrTeamMember"] || '',
                    internalNotesOrComments: item[values.internalNotesOrComments || "internalNotesOrComments"] || '',
                    deleted: item[values.deleted || "deleted"] || false,
                    createBy: JSON.parse(localStorage.getItem('user'))._id,
                    createdDate: new Date()
                }
            });

            AddData(contactsData);
        }
    })

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const AddData = async (contacts) => {
        try {
            setIsLoding(true);
            let response = await postApi('api/contact/addMany', contacts)
            if (response.status === 200) {
                toast.success(`Contacts imported successfully`)
                resetForm();
                navigate('/contacts');
            }
        } catch (e) {
            console.error(e);
            toast.error(`Contacts import failed`)
            resetForm();
            navigate('/contacts');
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
                    navigate("/contacts");
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
                    navigate("/contacts");
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

export default ContactImport