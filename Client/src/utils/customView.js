// import React from 'react'
// import { Grid, GridItem, Box, Heading, Text } from '@chakra-ui/react'
// import Card from 'components/card/Card'
// import moment from 'moment'
// import { HSeparator } from "components/separator/Separator";

// const CustomView = ({ data, toCamelCase, fieldData }) => {

//     const headingLength = data?.headings?.length % 3
//     const headingLengthMd = data?.headings?.length % 2
//     const lastLength = data?.headings.length - headingLength
//     const lastLengthMd = data?.headings.length - headingLengthMd

//     // Define a function to determine the colSpan value
//     const getColSpanLg = (ind, lastLength, headingLength) => {
//         if (ind < lastLength) {
//             return (ind + 1) > lastLength ? 6 : 4;
//         } else {
//             return headingLength === 1 ? 12 : ((ind + 1) > lastLength ? 6 : 4);
//         }
//     };
//     const getColSpanMd = (ind, lastLengthMd, headingLengthMd) => {
//         if (ind < lastLengthMd) {
//             return (ind + 1) > lastLengthMd ? 4 : 6;
//         } else {
//             return headingLengthMd === 1 ? 12 : ((ind + 1) > lastLengthMd ? 4 : 6);
//         }
//     };
//     return (
//         <Grid templateColumns="repeat(12, 1fr)" gap={3}>
//             {data?.headings?.length > 0 ? <>
//                 {data?.headings?.map((item, ind) => (
//                     <>
//                         <GridItem colSpan={{
//                             base: 12, md: getColSpanMd(ind, lastLengthMd, headingLengthMd), lg: getColSpanLg(ind, lastLength, headingLength)
//                         }} key={ind}>
//                             <Card>
//                                 <Grid templateColumns="repeat(12, 1fr)" gap={3}>
//                                     <GridItem colSpan={12}>
//                                         <Heading as="h1" size="md" mb='10px'>
//                                             {ind + 1}. {item?.heading}
//                                         </Heading>
//                                         <HSeparator />
//                                     </GridItem>
//                                     {
//                                         data?.fields?.filter((itm) => itm?.belongsTo === item?._id)?.map((field) => (
//                                             <GridItem colSpan={{ base: 12, md: 6 }} key={field?.name}>
//                                                 <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> {field?.label}</Text>
//                                                 <Text color={'blackAlpha.900'} fontSize="sm" > {(fieldData && (fieldData[field?.name] !== undefined ? fieldData[field?.name] : "N/A")) || "N/A"}</Text>
//                                             </GridItem>
//                                         ))
//                                     }
//                                 </Grid>
//                             </Card>
//                         </GridItem>
//                     </>)
//                 )}
//             </> :
//                 <GridItem colSpan={{
//                     base: 12,
//                 }}>

//                     <Card>
//                         <Grid templateColumns="repeat(12, 1fr)" gap={3}>
//                             <GridItem colSpan={12}>
//                                 <Heading as="h1" size="md" mb='10px'>
//                                     {data?.moduleName} view page
//                                 </Heading>
//                                 <HSeparator />
//                             </GridItem>
//                             {
//                                 data?.fields?.map((field) => (
//                                     <GridItem colSpan={{ base: 12, md: 6 }} key={field?.name}>
//                                         <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> {field?.label}</Text>
//                                         <Text color={'blackAlpha.900'} fontSize="sm" > {(fieldData && (fieldData[field?.name] !== undefined ? fieldData[field?.name] : "N/A")) || "N/A"}</Text>
//                                     </GridItem>
//                                 ))
//                             }
//                         </Grid>
//                     </Card>
//                 </GridItem>
//             }
//         </Grid>
//     )
// }

// export default CustomView
// import React, { useState } from 'react'
// import { Grid, GridItem, Box, Heading, Text, Input } from '@chakra-ui/react'
// import Card from 'components/card/Card'
// import moment from 'moment'
// import { HSeparator } from "components/separator/Separator";
// import { putApi } from 'services/api';
// import { useParams } from 'react-router-dom';
// import { useFormik } from 'formik';
// import * as yup from 'yup'
// import { generateValidationSchema } from 'utils';

// const CustomView = ({ data, toCamelCase, fieldData, moduleId, fetchData }) => {
//     const [editableField, setEditableField] = useState(null);
//     const [editableValue, setEditableValue] = useState('');
//     const param = useParams()

//     const handleDoubleClick = (fieldName, value) => {
//         setEditableField(fieldName);
//         setEditableValue(value);
//     };
//     const handleChange = (event) => {
//         setEditableValue(event.target.value);
//     };

//     const formik = useFormik({
//         initialValues: fieldData,
//         enableReinitialize: true,
//         validationSchema: yup.object().shape(generateValidationSchema(data?.fields)),
//         onSubmit: (values, { resetForm }) => {
//             EditData();
//         },
//     });


//     const EditData = async () => {
//         let payload = {
//             ...formik.values,
//             moduleId: moduleId
//         }
//         payload[`${editableField}`] = editableValue
//         try {
//             // setIsLoding(true)
//             let response = await putApi(`api/form/edit/${param.id}`, payload)
//             if (response.status === 200) {
//                 setEditableField(null);
//                 fetchData()
//             }
//         } catch (e) {
//             console.log(e);
//         }
//         finally {
//             // setIsLoding(false)
//         }
//     };

//     const handleBlur = (e) => {
//         formik.handleSubmit()
//     };

//     const headingLength = data?.headings?.length % 3;
//     const headingLengthMd = data?.headings?.length % 2;
//     const lastLength = data?.headings.length - headingLength;
//     const lastLengthMd = data?.headings.length - headingLengthMd;

//     // Define a function to determine the colSpan value
//     const getColSpanLg = (ind, lastLength, headingLength) => {
//         if (ind < lastLength) {
//             return (ind + 1) > lastLength ? 6 : 4;
//         } else {
//             return headingLength === 1 ? 12 : ((ind + 1) > lastLength ? 6 : 4);
//         }
//     };
//     const getColSpanMd = (ind, lastLengthMd, headingLengthMd) => {
//         if (ind < lastLengthMd) {
//             return (ind + 1) > lastLengthMd ? 4 : 6;
//         } else {
//             return headingLengthMd === 1 ? 12 : ((ind + 1) > lastLengthMd ? 4 : 6);
//         }
//     };

//     return (
//         <Grid templateColumns="repeat(12, 1fr)" gap={3}>
//             {data?.headings?.length > 0 ? (
//                 <>
//                     {data?.headings?.map((item, ind) => (
//                         <GridItem colSpan={{
//                             base: 12, md: getColSpanMd(ind, lastLengthMd, headingLengthMd), lg: getColSpanLg(ind, lastLength, headingLength)
//                         }} key={ind}>
//                             <Card>
//                                 <Grid templateColumns="repeat(12, 1fr)" gap={3}>
//                                     <GridItem colSpan={12}>
//                                         <Heading as="h1" size="md" mb='10px'>
//                                             {ind + 1}. {item?.heading}
//                                         </Heading>
//                                         <HSeparator />
//                                     </GridItem>
//                                     {
//                                         data?.fields?.filter((itm) => itm?.belongsTo === item?._id)?.map((field) => (
//                                             <GridItem colSpan={{ base: 12, md: 6 }} key={field?.name}>
//                                                 <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">{field?.label}</Text>
//                                                 {editableField === field?.name ? (
//                                                     <Input
//                                                         value={editableValue}
//                                                         onChange={handleChange}
//                                                         onBlur={handleBlur}
//                                                         autoFocus
//                                                         borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
//                                                     />
//                                                 ) : (
//                                                     <Text
//                                                         color={'blackAlpha.900'}
//                                                         fontSize="sm"
//                                                         onDoubleClick={() => handleDoubleClick(field?.name, fieldData && (fieldData[field?.name] !== undefined ? fieldData[field?.name] : "N/A"))}
//                                                     >
//                                                         {(fieldData && (fieldData[field?.name] !== undefined ? fieldData[field?.name] : "N/A")) || "N/A"}
//                                                     </Text>
//                                                 )}
//                                             </GridItem>
//                                         ))
//                                     }
//                                 </Grid>
//                             </Card>
//                         </GridItem>
//                     ))}
//                 </>
//             ) : (
//                 <GridItem colSpan={{ base: 12 }}>
//                     <Card>
//                         <Grid templateColumns="repeat(12, 1fr)" gap={3}>
//                             <GridItem colSpan={12}>
//                                 <Heading as="h1" size="md" mb='10px'>
//                                     {data?.moduleName} view page
//                                 </Heading>
//                                 <HSeparator />
//                             </GridItem>
//                             {data?.fields?.map((field) => (
//                                 <GridItem colSpan={{ base: 12, md: 6 }} key={field?.name}>
//                                     <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">{field?.label}</Text>
//                                     {editableField === field?.name ? (
//                                         <Input
//                                             value={editableValue}
//                                             onChange={handleChange}
//                                             onBlur={handleBlur}
//                                             autoFocus
//                                         />
//                                     ) : (
//                                         <Text
//                                             color={'blackAlpha.900'}
//                                             fontSize="sm"
//                                             onDoubleClick={() => handleDoubleClick(field?.name, fieldData && (fieldData[field?.name] !== undefined ? fieldData[field?.name] : "N/A"))}
//                                         >
//                                             {(fieldData && (fieldData[field?.name] !== undefined ? fieldData[field?.name] : "N/A")) || "N/A"}
//                                         </Text>
//                                     )}
//                                 </GridItem>
//                             ))}
//                         </Grid>
//                     </Card>
//                 </GridItem>
//             )}
//         </Grid>
//     );
// };

// export default CustomView;


import React, { useState } from 'react';
import { Grid, GridItem, Heading, Text, Input, FormControl, FormErrorMessage, Select } from '@chakra-ui/react';
import Card from 'components/card/Card';
import moment from 'moment';
import { HSeparator } from "components/separator/Separator";
import { putApi } from 'services/api';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { generateValidationSchema } from 'utils';
import { toast } from 'react-toastify';

const CustomView = ({ data, toCamelCase, fieldData, moduleId, fetchData, editUrl, id }) => {
    const param = useParams();
    const [editableField, setEditableField] = useState(null);
    const [editableFieldName, setEditableFieldName] = useState(null);

    const formik = useFormik({
        initialValues: fieldData,
        enableReinitialize: true,
        validationSchema: yup.object().shape(generateValidationSchema(data?.fields)),
        onSubmit: async (values) => {
            let payload = {
                ...values,
                moduleId: moduleId
            };
            try {
                let response = await putApi(editUrl ? editUrl : `api/form/edit/${param.id}`, payload);
                if (response.status === 200) {
                    setEditableField(null)
                    toast.success(`${editableFieldName} Update successfully`)
                    fetchData();
                }
            } catch (e) {
                console.log(e);
                toast.success(`server error`)
            }
        },
    });

    const handleDoubleClick = (fieldName, value, lable) => {
        formik.setFieldValue(fieldName, value);
        setEditableField(fieldName)
        setEditableFieldName(lable)
    };

    const handleBlur = (e) => {
        formik.handleSubmit();
    };

    const headingLength = data?.headings?.length % 3;
    const headingLengthMd = data?.headings?.length % 2;
    const lastLength = data?.headings.length - headingLength;
    const lastLengthMd = data?.headings.length - headingLengthMd;

    const getColSpanLg = (ind, lastLength, headingLength) => {
        if (ind < lastLength) {
            return (ind + 1) > lastLength ? 6 : 4;
        } else {
            return headingLength === 1 ? 12 : ((ind + 1) > lastLength ? 6 : 4);
        }
    };

    const getColSpanMd = (ind, lastLengthMd, headingLengthMd) => {
        if (ind < lastLengthMd) {
            return (ind + 1) > lastLengthMd ? 4 : 6;
        } else {
            return headingLengthMd === 1 ? 12 : ((ind + 1) > lastLengthMd ? 4 : 6);
        }
    };

    return (
        <Grid templateColumns="repeat(12, 1fr)" gap={3} id={id}>
            {data?.headings?.length > 0 ? (
                <>
                    {data?.headings?.map((item, ind) => (
                        <GridItem colSpan={{
                            base: 12, md: getColSpanMd(ind, lastLengthMd, headingLengthMd), lg: getColSpanLg(ind, lastLength, headingLength)
                        }} key={ind}>
                            <Card>
                                <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                    <GridItem colSpan={12}>
                                        <Heading as="h1" size="md" mb='10px'>
                                            {ind + 1}. {item?.heading}
                                        </Heading>
                                        <HSeparator />
                                    </GridItem>
                                    {
                                        data?.fields?.filter((itm) => itm?.belongsTo === item?._id)?.map((field) => (
                                            <GridItem colSpan={{ base: 12, md: 6 }} key={field?.name}>
                                                <FormControl isInvalid={formik.errors[field?.name] && formik.touched[field?.name]}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">{field?.label}</Text>
                                                    {editableField === field?.name || formik.errors[field?.name] ? (
                                                        field?.type === "select" || field?.type === "radio" ?
                                                            <Select
                                                                fontSize='sm'
                                                                id={field?.name}
                                                                name={field?.name}
                                                                onChange={formik.handleChange}
                                                                onBlur={handleBlur}
                                                                value={formik.values[field?.name] || ''}
                                                                fontWeight='500'
                                                                borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                            >
                                                                {field?.options?.map(option => (
                                                                    <option key={option._id} value={option.value}>
                                                                        {option.name}
                                                                    </option>))}
                                                            </Select>
                                                            : field?.type === "text" ?
                                                                <Input
                                                                    value={formik.values[field?.name] || ''}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={handleBlur}
                                                                    autoFocus
                                                                    borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                                    name={field?.name}
                                                                />
                                                                : field?.type === "tel" ?
                                                                    <Input
                                                                        value={formik.values[field?.name] || ''}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={handleBlur}
                                                                        autoFocus
                                                                        borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                                        name={field?.name}
                                                                    />
                                                                    : field?.type === "email" ?
                                                                        <Input
                                                                            value={formik.values[field?.name] || ''}
                                                                            onChange={formik.handleChange}
                                                                            onBlur={handleBlur}
                                                                            autoFocus
                                                                            borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                                            name={field?.name}
                                                                        /> : field?.type === "date" ?
                                                                            <Input
                                                                                value={formik.values[field?.name] || ''}
                                                                                onChange={formik.handleChange}
                                                                                onBlur={handleBlur}
                                                                                autoFocus
                                                                                type='date'
                                                                                borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                                                name={field?.name}
                                                                            /> : field?.type === "url" ?
                                                                                <Input
                                                                                    value={formik.values[field?.name] || ''}
                                                                                    onChange={formik.handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    autoFocus
                                                                                    type='url'
                                                                                    borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                                                    name={field?.name}
                                                                                />
                                                                                : field?.type === "range" ?
                                                                                    <Input
                                                                                        value={formik.values[field?.name] || ''}
                                                                                        onChange={formik.handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        autoFocus
                                                                                        type='range'
                                                                                        borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                                                        name={field?.name}
                                                                                    />
                                                                                    :
                                                                                    <Input
                                                                                        value={formik.values[field?.name] || ''}
                                                                                        onChange={formik.handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        autoFocus
                                                                                        borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                                                        name={field?.name}
                                                                                    />

                                                    ) : (
                                                        <Text
                                                            color={'blackAlpha.900'}
                                                            fontSize="sm"
                                                            onDoubleClick={() => handleDoubleClick(field?.name, fieldData && (fieldData[field?.name] !== undefined ? fieldData[field?.name] : "N/A"), field?.label)}
                                                        >
                                                            {(fieldData && (fieldData[field?.name] !== undefined ? fieldData[field?.name] : "N/A")) || "N/A"}
                                                        </Text>
                                                    )}
                                                    <FormErrorMessage>{formik.errors[field?.name]}</FormErrorMessage>
                                                </FormControl>
                                            </GridItem>
                                        ))
                                    }
                                </Grid>
                            </Card>
                        </GridItem>
                    ))}
                </>
            ) : (
                <GridItem colSpan={{ base: 12 }}>
                    <Card>
                        <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                            <GridItem colSpan={12}>
                                <Heading as="h1" size="md" mb='10px'>
                                    {data?.moduleName} view page
                                </Heading>
                                <HSeparator />
                            </GridItem>
                            {data?.fields?.map((field) => (
                                <GridItem colSpan={{ base: 12, md: 6 }} key={field?.name}>
                                    <FormControl isInvalid={formik.errors[field?.name] && formik.touched[field?.name]}>
                                        <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">{field?.label}</Text>
                                        {editableField === field?.name || formik.errors[field?.name] ? (
                                            field?.type === "select" || field?.type === "radio" ?
                                                <Select
                                                    fontSize='sm'
                                                    id={field?.name}
                                                    name={field?.name}
                                                    onChange={formik.handleChange}
                                                    onBlur={handleBlur}
                                                    value={formik.values[field?.name] || ''}
                                                    fontWeight='500'
                                                    borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                >
                                                    {field?.options?.map(option => (
                                                        <option key={option._id} value={option.value}>
                                                            {option.name}
                                                        </option>))}
                                                </Select>
                                                : field?.type === "text" ?
                                                    <Input
                                                        value={formik.values[field?.name] || ''}
                                                        onChange={formik.handleChange}
                                                        onBlur={handleBlur}
                                                        autoFocus
                                                        borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                        name={field?.name}
                                                    />
                                                    : field?.type === "tel" ?
                                                        <Input
                                                            value={formik.values[field?.name] || ''}
                                                            onChange={formik.handleChange}
                                                            onBlur={handleBlur}
                                                            autoFocus
                                                            borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                            name={field?.name}
                                                        />
                                                        : field?.type === "email" ?
                                                            <Input
                                                                value={formik.values[field?.name] || ''}
                                                                onChange={formik.handleChange}
                                                                onBlur={handleBlur}
                                                                autoFocus
                                                                borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                                name={field?.name}
                                                            /> : field?.type === "date" ?
                                                                <Input
                                                                    value={formik.values[field?.name] || ''}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={handleBlur}
                                                                    autoFocus
                                                                    type='date'
                                                                    borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                                    name={field?.name}
                                                                /> : field?.type === "url" ?
                                                                    <Input
                                                                        value={formik.values[field?.name] || ''}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={handleBlur}
                                                                        autoFocus
                                                                        type='url'
                                                                        borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                                        name={field?.name}
                                                                    />
                                                                    : field?.type === "range" ?
                                                                        <Input
                                                                            value={formik.values[field?.name] || ''}
                                                                            onChange={formik.handleChange}
                                                                            onBlur={handleBlur}
                                                                            autoFocus
                                                                            type='range'
                                                                            borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                                            name={field?.name}
                                                                        />
                                                                        :
                                                                        <Input
                                                                            value={formik.values[field?.name] || ''}
                                                                            onChange={formik.handleChange}
                                                                            onBlur={handleBlur}
                                                                            autoFocus
                                                                            borderColor={formik.errors[field?.name] && formik.touched[field?.name] ? "red.300" : null}
                                                                            name={field?.name}
                                                                        />


                                        ) : (
                                            <Text
                                                color={'blackAlpha.900'}
                                                fontSize="sm"
                                                onDoubleClick={() => handleDoubleClick(field?.name, fieldData && (fieldData[field?.name] !== undefined ? fieldData[field?.name] : "N/A"), field?.label)}
                                            >
                                                {(fieldData && (fieldData[field?.name] !== undefined ? fieldData[field?.name] : "N/A")) || "N/A"}
                                            </Text>
                                        )}
                                        <FormErrorMessage>{formik.errors[field?.name]}</FormErrorMessage>
                                    </FormControl>
                                </GridItem>
                            ))}
                        </Grid>
                    </Card>
                </GridItem>
            )}
        </Grid>
    );
};

export default CustomView;
