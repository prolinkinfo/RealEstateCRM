import { AddIcon } from '@chakra-ui/icons'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import CheckTable from './propertyTable'
import { getApi } from 'services/api'
import { postApi } from 'services/api'

const PropertyModel = (props) => {
    const { onClose, isOpen, fetchData, id, interestProperty } = props
    const [selectedValues, setSelectedValues] = useState([]);


    const columns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 10
        },
        { Header: 'property Type', accessor: 'propertyType' },
        { Header: "property Address", accessor: "propertyAddress", },
        { Header: "listing Price", accessor: "listingPrice", },
        { Header: "square Footage", accessor: "squareFootage", },
        { Header: "year Built", accessor: "yearBuilt", },
    ];
    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))
    const fetchPropertyData = async () => {
        let result = await getApi(user.role === 'admin' ? 'api/property/' : `api/property/?createBy=${user._id}`);
        if (result && result.status == 200) {
            setData(result?.data);
        }
    }
    const uniqueValues = [...new Set(selectedValues)];

    const handleSubmit = async () => {
        let result = await postApi(`api/contact/add-property-interest/${id}`, uniqueValues);
        if (result && result.status == 200) {
            fetchData()
            onClose()
        }
    }


    useEffect(() => {
        interestProperty?.map((item) => setSelectedValues((prevSelectedValues) => [...prevSelectedValues, item]))
        fetchPropertyData()
    }, [interestProperty])

    return (
        <Modal onClose={onClose} size='full' isOpen={isOpen} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Select Intrasted Property</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <CheckTable tableData={data} selectedValues={selectedValues} setSelectedValues={setSelectedValues} columnsData={columns} title="Property Table" />
                </ModalBody>
                <ModalFooter>
                    <Button variant='brand' onClick={handleSubmit} leftIcon={<AddIcon />}>Add</Button>
                    <Button onClick={() => onClose()}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    )
}

export default PropertyModel
