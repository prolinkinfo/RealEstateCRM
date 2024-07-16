import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Spinner from 'components/spinner/Spinner'
import { GiClick } from "react-icons/gi";
import CommonCheckTable from 'components/reactTable/checktable';
import { fetchLeadCustomFiled } from '../../redux/slices/leadCustomFiledSlice';
import { useDispatch } from 'react-redux';
import { fetchLeadData } from '../../redux/slices/leadSlice';

const ContactModel = (props) => {
    const { onClose, isOpen, fieldName, setFieldValue, data } = props
    const title = "Leads";
    const dispatch = useDispatch();

    const [isLoding, setIsLoding] = useState(false);
    const [columns, setColumns] = useState([]);
    const [leadData, setLeadData] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);

    const handleSubmit = async () => {
        try {
            setIsLoding(true)
            setFieldValue(fieldName, selectedValues)
            onClose()
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setIsLoding(false)
        }
    }

    const fetchCustomDataFields = async () => {
        setIsLoding(true);

        const result = await dispatch(fetchLeadCustomFiled());
        setLeadData(result?.payload?.data);

        const tempTableColumns = [
            { Header: "#", accessor: "_id", isSortable: false, width: 10 },
            {
                Header: "Status", accessor: "leadStatus", isSortable: true, center: true,
                cell: ({ row }) => (
                    row.original.leadStatus
                )
            },
            ...(result?.payload?.data?.[0]?.fields?.filter((field) => field?.isTableField === true)?.map((field) => (field?.name !== "leadStatus" && { Header: field?.label, accessor: field?.name })) || []),
        ];

        setColumns(tempTableColumns);
        setIsLoding(false);
    }

    useEffect(() => {
        dispatch(fetchLeadData())
        fetchCustomDataFields();
    }, [])

    return (
        <Modal onClose={onClose} size='full' isOpen={isOpen} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Select Lead</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isLoding ?
                        <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                            <Spinner />
                        </Flex> :
                        <CommonCheckTable
                            title={title}
                            isLoding={isLoding}
                            columnData={columns ?? []}
                            // dataColumn={columns ?? []}
                            allData={data ?? []}
                            tableData={data}
                            tableCustomFields={leadData?.[0]?.fields?.filter((field) => field?.isTableField === true) || []}
                            AdvanceSearch={() => ""}
                            ManageGrid={false}
                            deleteMany={false}
                            selectedValues={selectedValues}
                            setSelectedValues={setSelectedValues}
                            selectType="single"
                            customSearch={false}
                        />
                    }
                </ModalBody>
                <ModalFooter>
                    <Button variant='brand' size='sm' me={2} disabled={isLoding ? true : false} leftIcon={<GiClick />} onClick={handleSubmit}> {isLoding ? <Spinner /> : 'Select'}</Button>
                    <Button variant='outline' size='sm' colorScheme='red' onClick={() => onClose()}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    )
}

export default ContactModel
