import React from 'react';
import { Grid, GridItem, Heading, FormLabel, Input, Text, InputLeftElement, InputGroup, Checkbox, Select, RadioGroup, Radio, HStack, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Box } from '@chakra-ui/react'; // Assuming you are using Chakra UI
import { HSeparator } from 'components/separator/Separator';
import { EmailIcon, PhoneIcon, StarIcon } from '@chakra-ui/icons';

const CustomForm = ({ moduleData, values, handleChange, handleBlur, errors, touched, setFieldValue }) => {
    return (
        <Grid templateColumns="repeat(12, 1fr)" gap={3}>
            {moduleData?.headings?.length > 0 ?
                <>
                    {
                        moduleData?.headings?.map((item, ind) => (
                            <>
                                <GridItem colSpan={{ base: 12 }} key={ind}>
                                    {ind !== 0 && <HSeparator />}
                                    <Heading as="h1" size="md" mt='10px'>
                                        {ind + 1}. {item?.heading}
                                    </Heading>
                                </GridItem>
                                {
                                    moduleData?.fields?.filter((itm) => itm?.belongsTo === item?._id)?.map((field, index) => (
                                        <GridItem colSpan={{ base: 12, sm: 6 }} key={index}>
                                            {field.type === 'check' ? '' : <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px' htmlFor={field.name}>{field.label} {field.validation && field.validation.find((validation) => validation.require) && (
                                                <span style={{ color: 'red' }}>*</span>
                                            )}</FormLabel>}
                                            {field.type === 'range' ?
                                                <>
                                                    {values.leadRating || 0}
                                                    <Slider ml={2} aria-label='slider-ex-1' colorScheme='yellow' value={values.leadRating} min={field?.validation[1]?.value} max={field?.validation[2]?.value} step={.1} defaultValue={0} onChange={(value) => setFieldValue(field.name, value)} >
                                                        <SliderTrack>
                                                            <SliderFilledTrack />
                                                        </SliderTrack>
                                                        <SliderThumb boxSize={6}>
                                                            <Box color='yellow.300' as={StarIcon} />
                                                        </SliderThumb>
                                                    </Slider>
                                                </>
                                                : field.type === 'radio' ?
                                                    <RadioGroup
                                                        name={field.name}
                                                        value={values[field.name]}
                                                        onChange={(value) => setFieldValue(field.name, value)}
                                                    >
                                                        <HStack spacing="24px">
                                                            {field.options.map(option => (
                                                                <Radio key={option._id} value={option.value}>
                                                                    {option.name}
                                                                </Radio>
                                                            ))}
                                                        </HStack>
                                                    </RadioGroup> :
                                                    field.type === 'select' ? <Select
                                                        fontSize='sm'
                                                        id={field.name}
                                                        name={field.name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values[field.name]}
                                                        fontWeight='500'
                                                        borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                                                    >
                                                        {field.options.map(option => (
                                                            <option key={option._id} value={option.value}>
                                                                {option.name}
                                                            </option>
                                                        ))}
                                                    </Select> : field.type === 'check' ? <Checkbox
                                                        isChecked={values[field.name]}
                                                        onChange={() => setFieldValue(field.name, !values[field.name])}
                                                    >
                                                        {field.label}
                                                    </Checkbox> :
                                                        <>
                                                            <InputGroup>
                                                                {field.type === 'tel' ? <InputLeftElement
                                                                    pointerEvents="none"
                                                                    children={<PhoneIcon color="gray.300" borderRadius="16px" />}
                                                                /> : field.type === 'email' && <InputLeftElement
                                                                    pointerEvents="none"
                                                                    children={<EmailIcon color="gray.300" borderRadius="16px" />}
                                                                />
                                                                }
                                                                <Input
                                                                    fontSize='sm'
                                                                    type={field.type}
                                                                    id={field.name}
                                                                    name={field.name}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={values[field.name]}
                                                                    fontWeight='500'
                                                                    placeholder={`Enter ${field.label}`}
                                                                    borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                                                                />
                                                            </InputGroup>
                                                        </>}
                                            {touched[field?.name] && errors?.[field?.name] ? (
                                                <Text mb='10px' color={'red'} fontSize='sm' textTransform={'capitalize'}> {errors?.[field?.name]}</Text>
                                            ) : null}
                                        </GridItem>
                                    ))
                                }
                            </>
                        ))
                    }
                    <>
                        {moduleData?.fields?.filter((itm) => !itm?.belongsTo)?.map((field, i) => (
                            <GridItem colSpan={{ base: 12, sm: 6 }} key={i}>
                                {field.type === 'check' ? '' : <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px' htmlFor={field.name}>{field.label} {field.validation && field.validation.find((validation) => validation.require) && (
                                    <span style={{ color: 'red' }}>*</span>
                                )}</FormLabel>}
                                {field.type === 'range' ?
                                    <>
                                        {values.leadRating || 0}
                                        <Slider ml={2} aria-label='slider-ex-1' colorScheme='yellow' min={field?.validation[1]?.value} max={field?.validation[2]?.value} step={.1} defaultValue={0} onChange={(value) => setFieldValue(field.name, value)} >
                                            <SliderTrack>
                                                <SliderFilledTrack />
                                            </SliderTrack>
                                            <SliderThumb boxSize={6}>
                                                <Box color='yellow.300' as={StarIcon} />
                                            </SliderThumb>
                                        </Slider>
                                    </>
                                    : field.type === 'radio' ?
                                        <RadioGroup
                                            name={field.name}
                                            value={values[field.name]}
                                            onChange={(value) => setFieldValue(field.name, value)}
                                        >
                                            <HStack spacing="24px">
                                                {field.options.map(option => (
                                                    <Radio key={option._id} value={option.value}>
                                                        {option.name}
                                                    </Radio>
                                                ))}
                                            </HStack>
                                        </RadioGroup> :
                                        field.type === 'select' ? <Select
                                            fontSize='sm'
                                            id={field.name}
                                            name={field.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values[field.name]}
                                            fontWeight='500'
                                            borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                                        >
                                            <option value="">Select {field.label}</option>
                                            {field.options.map(option => (
                                                <option key={option._id} value={option.value}>
                                                    {option.name}
                                                </option>
                                            ))}
                                        </Select> : field.type === 'check' ? <Checkbox
                                            isChecked={values[field.name]}
                                            onChange={() => setFieldValue(field.name, !values[field.name])}
                                        >
                                            {field.label}
                                        </Checkbox> :
                                            <>
                                                <InputGroup>
                                                    {field.type === 'tel' && <InputLeftElement
                                                        pointerEvents="none"
                                                        children={<PhoneIcon color="gray.300" borderRadius="16px" />}
                                                    />}
                                                    <Input
                                                        fontSize='sm'
                                                        type={field.type}
                                                        id={field.name}
                                                        name={field.name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values[field.name]}
                                                        fontWeight='500'
                                                        placeholder={`Enter ${field.label}`}
                                                        borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                                                    />
                                                </InputGroup>
                                            </>}
                                {touched[field?.name] && errors?.[field?.name] ? (
                                    <Text mb='10px' fontSize='sm' color={'red'}> {errors?.[field?.name]}</Text>
                                ) : null}
                            </GridItem>
                        ))}
                    </>
                </>
                :
                <>
                    {moduleData?.fields?.filter((itm) => !itm?.belongsTo)?.map((field, index) => (
                        <GridItem colSpan={{ base: 12, sm: 6 }} key={index}>
                            {field.type === 'check' ? '' : <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px' htmlFor={field.name}>{field.label} {field.validation && field.validation.find((validation) => validation.require) && (
                                <span style={{ color: 'red' }}>*</span>
                            )}</FormLabel>}
                            {field.type === 'range' ?
                                <>
                                    {values.leadRating || 0}
                                    <Slider ml={2} aria-label='slider-ex-1' colorScheme='yellow' min={field?.validation[1]?.value} max={field?.validation[2]?.value} step={.1} defaultValue={0} onChange={(value) => setFieldValue(field.name, value)} >
                                        <SliderTrack>
                                            <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb boxSize={6}>
                                            <Box color='yellow.300' as={StarIcon} />
                                        </SliderThumb>
                                    </Slider>
                                </>
                                : field.type === 'radio' ?
                                    <RadioGroup
                                        name={field.name}
                                        value={values[field.name]}
                                        onChange={(value) => setFieldValue(field.name, value)}
                                    >
                                        <HStack spacing="24px">
                                            {field.options.map(option => (
                                                <Radio key={option._id} value={option.value}>
                                                    {option.name}
                                                </Radio>
                                            ))}
                                        </HStack>
                                    </RadioGroup> :
                                    field.type === 'select' ? <Select
                                        fontSize='sm'
                                        id={field.name}
                                        name={field.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values[field.name]}
                                        fontWeight='500'
                                        borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                                    >
                                        <option value="">Select {field.label}</option>
                                        {field.options.map(option => (
                                            <option key={option._id} value={option.value}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </Select> : field.type === 'check' ? <Checkbox
                                        isChecked={values[field.name]}
                                        onChange={() => setFieldValue(field.name, !values[field.name])}
                                    >
                                        {field.label}
                                    </Checkbox> :
                                        <>
                                            <InputGroup>
                                                {field.type === 'tel' && <InputLeftElement
                                                    pointerEvents="none"
                                                    children={<PhoneIcon color="gray.300" borderRadius="16px" />}
                                                />}
                                                <Input
                                                    fontSize='sm'
                                                    type={field.type}
                                                    id={field.name}
                                                    name={field.name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values[field.name]}
                                                    fontWeight='500'
                                                    placeholder={`Enter ${field.label}`}
                                                    borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                                                />
                                            </InputGroup>
                                        </>}
                            {touched[field?.name] && errors?.[field?.name] ? (
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors?.[field?.name]}</Text>
                            ) : null}
                        </GridItem>
                    ))}
                </>
            }

        </Grid>
    );
};

export default CustomForm;