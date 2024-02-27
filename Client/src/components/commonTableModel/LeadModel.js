import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import LeadTable from './Lead'
import { getApi } from 'services/api'
import { postApi } from 'services/api'
import Spinner from 'components/spinner/Spinner'
import { GiClick } from "react-icons/gi";

const ContactModel = (props) => {
    const { onClose, isOpen, fieldName, setFieldValue,data } = props
    const [selectedValues, setSelectedValues] = useState();
    const [isLoding, setIsLoding] = useState(false)
    // const [data, setData] = useState([])

    const columns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'Lead Name', accessor: 'leadName', width: 20 },
        { Header: "Lead Email", accessor: "leadEmail", },
        { Header: "Lead PhoneNumber", accessor: "leadPhoneNumber", },
        { Header: "Lead Address", accessor: "leadAddress", },
        { Header: "Lead Status", accessor: "leadStatus", },
        { Header: "Lead Owner", accessor: "leadOwner", },
        { Header: "Lead Score", accessor: "leadScore", },
    ];

    const user = JSON.parse(localStorage.getItem("user"))
    // const fetchLeadData = async () => {
    //     setIsLoding(true)
    //     let result = await getApi(user.role === 'superAdmin' ? 'api/lead/' : `api/lead/?createBy=${user._id}`);
    //     if (result && result.status == 200) {
    //         setData(result?.data);
    //     }
    //     setIsLoding(false)
    // }

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

    // useEffect(() => {
    //     fetchLeadData()
    // }, [])

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
                        </Flex> : <LeadTable tableData={data} selectedValues={selectedValues} setSelectedValues={setSelectedValues} columnsData={columns} title="Lead" />}
                </ModalBody>
                <ModalFooter>
                    <Button variant='brand' size='sm' me={2} onClick={handleSubmit} disabled={isLoding ? true : false} leftIcon={<GiClick />}> {isLoding ? <Spinner /> : 'Select'}</Button>
                    <Button variant='outline' size='sm' colorScheme='red' onClick={() => onClose()}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    )
}

export default ContactModel
