import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import { useEffect, useState } from 'react'
import { postApi } from 'services/api'
import { fetchPropertyData } from '../../../../redux/slices/propertySlice'
import { useDispatch, useSelector } from 'react-redux'
import CommonCheckTable from 'components/reactTable/checktable'
import { fetchPropertyCustomFiled } from '../../../../redux/slices/propertyCustomFiledSlice'

const PropertyModel = (props) => {
    const { onClose, isOpen, fetchData, id, interestProperty } = props
    const [selectedValues, setSelectedValues] = useState([]);
    const [isLoding, setIsLoding] = useState(false)
    // const [data, setData] = useState([])
    const [propertyData, setPropertyData] = useState([]);
    const [columns, setColumns] = useState([]);

    const dispatch = useDispatch()
    const data = useSelector((state) => state.propertyData.data)

    const fetchCustomDataFields = async () => {
        setIsLoding(true);
        const result = await dispatch(fetchPropertyCustomFiled())
        setPropertyData(result?.payload?.data);

        const tempTableColumns = [
            { Header: "#", accessor: "_id", isSortable: false, width: 10 },
            ...result?.payload?.data?.[0]?.fields?.filter((field) => field?.isTableField === true)?.map((field) => ({ Header: field?.label, accessor: field?.name })),
        ];

        setColumns(tempTableColumns);
        setIsLoding(false);
    }
    const uniqueValues = [...new Set(selectedValues)];

    const handleSubmit = async () => {
        try {
            setIsLoding(true)
            let result = await postApi(`api/contact/add-property-interest/${id}`, uniqueValues);
            if (result && result.status === 200) {
                fetchData()
                onClose()
            }
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setIsLoding(false)
        }
    }
    useEffect(() => {
        dispatch(fetchPropertyData())
        fetchCustomDataFields()
    }, [])

    useEffect(() => {
        interestProperty?.map((item) => setSelectedValues((prevSelectedValues) => [...prevSelectedValues, item]))
    }, [interestProperty])

    return (
        <Modal onClose={onClose} size='full' isOpen={isOpen} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Select Interested Property</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isLoding ?
                        <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                            <Spinner />
                        </Flex>
                        :
                        <CommonCheckTable
                            title={'Properties'}
                            isLoding={isLoding}
                            columnData={columns ?? []}
                            // dataColumn={columns ?? []}
                            allData={data ?? []}
                            tableData={data}
                            tableCustomFields={propertyData?.[0]?.fields?.filter((field) => field?.isTableField === true) || []}
                            AdvanceSearch={() => ""}
                            ManageGrid={false}
                            deleteMany={false}
                            selectedValues={selectedValues}
                            setSelectedValues={setSelectedValues}
                            selectType="multiple"
                            customSearch={false}
                        />
                    }
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" variant='brand' onClick={handleSubmit} disabled={isLoding ? true : false}> {isLoding ? <Spinner /> : 'Save'}</Button>
                    <Button size="sm" sx={{
                        marginLeft: 2,
                        textTransform: "capitalize",
                    }} variant="outline"
                        colorScheme="red" onClick={() => onClose()}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    )
}

export default PropertyModel
