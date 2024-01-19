import { ChevronDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Menu, Heading, MenuButton, Select, Checkbox, GridItem, Text, MenuItem, Grid, MenuList, FormLabel, Input } from '@chakra-ui/react';
import Card from 'components/card/Card'
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import Addfield from './addfield'
import { getApi } from 'services/api';

const CustomField = () => {
    const [addFieldModel, setAddFieldModel] = useState(false);
    const [moduleName, setModuleName] = useState('')
    const [data, setData] = useState([])
    console.log(data)
    const fields = [
        {
            id: 1,
            name: 'lead',
            fields: [{
                name: 'name',
                label: 'Name',
                type: 'text',
                validation: [
                    { require: true, message: 'Please Enter Name' },
                    { min: true, value: 0, message: '' },
                    { max: true, value: 10, message: '' },
                    { match: true, value: '/^\d{10}$/', message: '' }
                ]
            }, {
                name: 'name',
                label: 'Name',
                type: 'text',
                validation: [
                    { require: true, message: 'Please Enter Name' },
                    { min: true, value: 0, message: '' },
                    { max: true, value: 10, message: '' },
                    { match: true, value: '/^\d{10}$/', message: '' }
                ]
            }]
        },
        {
            id: 2,
            name: 'contact',
            fields: [{
                name: 'fieldname',
                label: 'Name',
                type: 'text',
                validation: [
                    { require: true, message: 'Please Enter Name' },
                    { min: true, value: 0, message: '' },
                    { max: true, value: 10, message: '' },
                    { match: true, value: '/^\d{10}$/', message: '' }
                ]
            }, {
                name: 'name',
                label: 'Name',
                type: 'text',
                validation: [
                    { require: true, message: 'Please Enter Name' },
                    { min: true, value: 0, message: '' },
                    { max: true, value: 10, message: '' },
                    { match: true, value: '/^\d{10}$/', message: '' }
                ]
            },
            ]
        },
    ];
    // const formik = useFormik({
    //     initialValues: {
    //         // Set initial values based on your form fields
    //         name: '',
    //         // Add more fields as needed
    //     },
    //     validate: (values) => {
    //         const errors = {};

    //         fields.forEach((field) => {
    //             const { name, validation } = field;

    //             validation.forEach(({ require, min, max, match, value, message }) => {
    //                 const fieldValue = values[name];

    //                 if (require && !fieldValue) {
    //                     errors[name] = message;
    //                 } else if (min && fieldValue.length < min) {
    //                     errors[name] = message;
    //                 } else if (max && fieldValue.length > max) {
    //                     errors[name] = message;
    //                 } else if (match && value instanceof RegExp && fieldValue && !fieldValue.match(value)) {
    //                     errors[name] = message;
    //                 }
    //             });
    //         });

    //         return errors;
    //     },
    //     onSubmit: (values) => {
    //         // Handle form submission
    //         console.log('Form values:', values);
    //     },
    // });

    const fetchData = async () => {
        if (moduleName) {
            let response = await getApi(`api/custom-field/?moduleName=${moduleName}`);
            setData(response?.data);
        } else if (!moduleName) {
            setData([])
        }
    }
    useEffect(() => {
        fetchData()
    }, [moduleName])

    const initialValues = {
        name: '',
        label: '',
        type: '', require: false, message: '',
        min: false, minValue: '', minMessage: '',
        max: false, maxValue: '', maxMessage: '',
        match: false, matchValue: '', matchMessage: '',
    }

    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            console.log('Form values:', values);
        },
    })

    const { values, handleSubmit, handleChange, handleBlur, touched, errors } = formik;

    return (
        <>
            <Card>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Box >
                        <Text color={"secondaryGray.900"}
                            fontSize="22px"
                            fontWeight="700"
                        >Custom Field</Text>
                    </Box>
                    <Box>
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline">
                                {moduleName ? moduleName : 'Select Module'}
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={() => setModuleName('')}>Select Module</MenuItem>
                                {fields?.map((item, id) => (
                                    <MenuItem key={id} onClick={() => setModuleName(item.name)}>{item.name}</MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Box>
                </Flex>
                <Grid templateColumns="repeat(12, 1fr)" gap={3} mt={5}>
                    {data[0]?.fields?.map((item, i) => (
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <Flex alignItems={"center"} justifyContent={"space-between"} className="CustomFieldName" >
                                <Text display='flex' size='sm' colorScheme='gray' ms='4px' mt={4} fontSize='md' fontWeight='500' mb='8px' >
                                    {item?.label}
                                </Text>
                                <span className="EditDelete">
                                    <Button size='sm' variant='outline' me={2}><EditIcon /></Button>
                                    <Button size='sm' variant='outline' me={2}><DeleteIcon /></Button>
                                </span>
                            </Flex>
                        </GridItem>
                    ))}
                </Grid>
                <Flex justifyContent={'end'} mt='5'>
                    {data?.length === 0 && <Button onClick={() => setAddFieldModel(true)} variant="brand" size='sm'>Add Field</Button>}
                </Flex>
            </Card>

            <Addfield isOpen={addFieldModel} onClose={setAddFieldModel} field={data[0]?.fields} moduleId={data[0]?._id} />

        </>
    )
}

export default CustomField