import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Menu, Heading, MenuButton, Select, Checkbox, GridItem, Text, MenuItem, Grid, MenuList, FormLabel, Input } from '@chakra-ui/react';
import Card from 'components/card/Card'
import { useFormik } from 'formik';
import React, { useState } from 'react'
import * as Yup from 'yup';

const CustomFeild = () => {

    const [moduleName, setModuleName] = useState('')

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
            // Handle form submission
            console.log('Form values:', values);
        },
    })


    const { values, handleSubmit, handleChange, handleBlur, touched, errors } = formik;

    return (
        <Card>

            <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Box >
                    <Text color={"secondaryGray.900"}
                        fontSize="22px"
                        fontWeight="700">Custom Feild</Text>
                </Box>
                <Box>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
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
            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                <GridItem colSpan={{ base: 6 }}>
                    <Heading as="h1" size="md" >
                        1. Basic Lead Information
                    </Heading>
                    <Button display='flex' size='sm' colorScheme='gray' ms='4px' mt={4} fontSize='md' fontWeight='500' mb='8px'>
                        Lead Name
                    </Button>
                    <Button display='flex' ms='4px' fontSize='md' fontWeight='500' mb='8px'>
                        Lead Email
                    </Button>
                    <Button display='flex' ms='4px' fontSize='md' fontWeight='500' mb='8px'>
                        Lead Phone Number
                    </Button>
                    <Button display='flex' ms='4px' fontSize='md' fontWeight='500' mb='8px'>
                        Lead Address
                    </Button>
                </GridItem>
                <GridItem colSpan={{ base: 6 }}>
                    <Heading as="h1" size="md" >
                        2. Lead Source and Details
                    </Heading>
                    <Button display='flex' ms='4px' mt={4} fontSize='md' fontWeight='500' mb='8px'>
                        Lead Source
                    </Button>
                    <Button display='flex' ms='4px' fontSize='md' fontWeight='500' mb='8px'>
                        Lead Status
                    </Button>
                    <Button display='flex' ms='4px' fontSize='md' fontWeight='500' mb='8px'>
                        Lead Source Details
                    </Button>
                    <Button display='flex' ms='4px' fontSize='md' fontWeight='500' mb='8px'>
                        Lead Campaign
                    </Button>
                </GridItem>
            </Grid>


            <Flex justifyContent={'end'} mt='5'>
                <Button onClick={handleSubmit} variant="brand" size='sm'>Add Feild</Button>
            </Flex>
        </Card>
    )
}

export default CustomFeild