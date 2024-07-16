import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Spinner from 'components/spinner/Spinner'
import { GiClick } from "react-icons/gi";
import CommonCheckTable from 'components/reactTable/checktable';
import { useDispatch } from 'react-redux';
import { getApi } from 'services/api';
import { fetchAccountData } from '../../redux/slices/accountSlice';
import { toast } from 'react-toastify';
import moment from 'moment';

const OpprtunityModel = (props) => {
    const { onClose, isOpen, fieldName, setFieldValue, data } = props
    const title = "Opprtunities";
    const dispatch = useDispatch();
    // const [data, setData] = useState([]);

    const [isLoding, setIsLoding] = useState(false);
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
    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        {
            Header: 'Opportunity Name', accessor: 'opportunityName',
        },
        {
            Header: 'Account Name', accessor: 'accountName'
        },
        {
            Header: 'Opportunity Amount', accessor: 'opportunityAmount',
        },
        {
            Header: 'Expected Close Date', accessor: 'expectedCloseDate', cell: (cell) => (
                <div>{moment(cell?.value).format("YYYY-MM-DD")}</div>
            )
        },
        {
            Header: 'Sales Stage', accessor: 'salesStage',
        },

    ];

    const [columns, setColumns] = useState([...tableColumns]);
    const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    const dataColumn = tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

    // const fetchData = async () => {
    //     setIsLoding(true)
    //     const result = await dispatch(fetchAccountData())

    //     if (result.payload.status === 200) {
    //         setData(result?.payload?.data);
    //     } else {
    //         toast.error("Failed to fetch data", "error");
    //     }
    //     setIsLoding(false)
    // }

    // useEffect(() => {
    //     fetchData()
    // }, [])

    return (
        <Modal onClose={onClose} size='full' isOpen={isOpen} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Select Opportunity</ModalHeader>
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

export default OpprtunityModel
