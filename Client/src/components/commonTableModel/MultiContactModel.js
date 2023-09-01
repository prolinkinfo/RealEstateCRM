import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ContactTable from './Contact.js'
import { getApi } from 'services/api'
import { postApi } from 'services/api'
import Spinner from 'components/spinner/Spinner'
import { GiClick } from "react-icons/gi";

const MultiContactModel = (props) => {
    const { onClose, isOpen, fieldName, setFieldValue } = props
    const [selectedValues, setSelectedValues] = useState([]);
    const [isLoding, setIsLoding] = useState(false)
    const [data, setData] = useState([])

    const columns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'title', accessor: 'title' },
        { Header: "first Name", accessor: "firstName" },
        { Header: "last Name", accessor: "lastName" },
        { Header: "phone Number", accessor: "phoneNumber" },
        { Header: "Email Address", accessor: "email" },
        { Header: "physical Address", accessor: "physicalAddress" },
        { Header: "mailing Address", accessor: "mailingAddress" },
        { Header: "Contact Method", accessor: "preferredContactMethod" },
    ];

    const user = JSON.parse(localStorage.getItem("user"))
    const fetchContactData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'admin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
        if (result && result.status == 200) {
            setData(result?.data);
        }
        setIsLoding(false)
    }
    const uniqueValues = [...new Set(selectedValues)];

    const handleSubmit = async () => {
        try {
            setIsLoding(true)
            onClose()
            setFieldValue(fieldName, uniqueValues)
            // setSelectedValues([])
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setIsLoding(false)
        }
    }

    useEffect(() => {
        fetchContactData()
    }, [])

    return (
        <Modal onClose={onClose} size='full' isOpen={isOpen} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Select Contact</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isLoding ?
                        <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                            <Spinner />
                        </Flex> : <ContactTable tableData={data} type='multi' selectedValues={selectedValues} setSelectedValues={setSelectedValues} columnsData={columns} title="Contact" />}
                </ModalBody>
                <ModalFooter>
                    <Button variant='brand' onClick={handleSubmit} disabled={isLoding ? true : false} leftIcon={<GiClick />}> {isLoding ? <Spinner /> : 'Select'}</Button>
                    <Button onClick={() => onClose()}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    )
}

export default MultiContactModel
