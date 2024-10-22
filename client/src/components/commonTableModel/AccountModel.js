import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Spinner from 'components/spinner/Spinner'
import { GiClick } from "react-icons/gi";
import CommonCheckTable from 'components/reactTable/checktable';
import { useDispatch } from 'react-redux';
import { getApi } from 'services/api';
import { fetchAccountData } from '../../redux/slices/accountSlice';
import { toast } from 'react-toastify';

const AccountModel = (props) => {
    const { onClose, isOpen, fieldName, setFieldValue, data, type, billingState, billingCity, billingPostalCode, billingCountry, billingStreet } = props
    const title = "Account";
    const dispatch = useDispatch();
    // const [data, setData] = useState([]);

    const [isLoding, setIsLoding] = useState(false);
    const [leadData, setLeadData] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);
    const accountData = data?.length > 0 && data?.find((item) => item?._id === selectedValues)
    const handleSubmit = async () => {
        try {
            setIsLoding(true)
            setFieldValue(fieldName, selectedValues)
            // if (type === "quotes") {
            //     setFieldValue(billingStreet, accountData?.billingStreet)
            //     setFieldValue(billingState, accountData?.billingState)
            //     setFieldValue(billingCity, selectedValues?.billingCity)
            //     setFieldValue(billingPostalCode, selectedValues?.billingPostalcode)
            //     setFieldValue(billingCountry, selectedValues?.billingCountry)
            // }
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
        { Header: 'Account Name', accessor: 'name' },
        { Header: 'Office Phone', accessor: 'officePhone', },
        { Header: 'Fax', accessor: 'fax', },
        { Header: 'Email Address', accessor: 'emailAddress', },
    ];

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
                <ModalHeader>Select Account</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isLoding ?
                        <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                            <Spinner />
                        </Flex> :
                        <CommonCheckTable
                            title={title}
                            isLoding={isLoding}
                            columnData={tableColumns ?? []}
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

export default AccountModel
