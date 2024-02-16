import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import { useEffect, useState } from 'react'
import { getApi, postApi } from 'services/api'
import CheckTable from './propertyTable'

const PropertyModel = (props) => {
    const { onClose, isOpen, fetchData, id, interestProperty } = props
    const [selectedValues, setSelectedValues] = useState([]);
    const [isLoding, setIsLoding] = useState(false)


    const columns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'property Type', accessor: 'propertyType' },
        { Header: "property Address", accessor: "propertyAddress", },
        { Header: "listing Price", accessor: "listingPrice", },
        { Header: "square Footage", accessor: "squareFootage", },
        { Header: "year Built", accessor: "yearBuilt", },
    ];
    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))
    const fetchPropertyData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'superAdmin' ? 'api/property/' : `api/property/?createBy=${user._id}`);
        if (result && result.status == 200) {
            setData(result?.data);
        }
        setIsLoding(false)
    }
    const uniqueValues = [...new Set(selectedValues)];

    const handleSubmit = async () => {
        try {
            setIsLoding(true)
            let result = await postApi(`api/contact/add-property-interest/${id}`, uniqueValues);
            if (result && result.status == 200) {
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
        interestProperty?.map((item) => setSelectedValues((prevSelectedValues) => [...prevSelectedValues, item]))
        fetchPropertyData()
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
                        </Flex> : <CheckTable tableData={data} selectedValues={selectedValues} setSelectedValues={setSelectedValues} columnsData={columns} title="Properties" />}
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
