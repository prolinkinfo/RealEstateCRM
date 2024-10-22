import { CloseIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import { DrawerFooter, Flex, Grid, GridItem, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Spinner from "components/spinner/Spinner"
import moment from 'moment'
import { useEffect, useState } from 'react'
import { BiLink } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { getApi } from 'services/api'
import { useNavigate } from 'react-router-dom';

const ViewCalender = (props) => {
    const { onClose, isOpen, info, fetchData, setAction, action, access, contactAccess, leadAccess } = props
    const [data, setData] = useState()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate()

    const fetchViewData = async () => {
        if (info?.event?.groupId === "task") {
            setIsLoding(true)
            let result = await getApi('api/task/view/', info?.event ? info?.event?.id : info);
            setData(result?.data);
            setIsLoding(false)
        } else if (info?.event?.groupId === "call") {
            setIsLoding(true)
            let result = await getApi('api/call/view/', info?.event ? info?.event?.id : info);
            setData(result?.data);
            setIsLoding(false)

        } else if (info?.event?.groupId === "meeting") {
            setIsLoding(true)
            let result = await getApi('api/meeting/view/', info?.event ? info?.event?.id : info);
            setData(result?.data);
            setIsLoding(false)

        } else if (info?.event?.groupId === "email") {
            setIsLoding(true)
            let result = await getApi('api/email/view/', info?.event ? info?.event?.id : info);
            setData(result?.data);
            setIsLoding(false)
        }
    }

    useEffect(() => {
        fetchViewData()
    }, [action, info])

    const handleViewOpen = () => {
        if (info?.event) {
            navigate(`/view/${info?.event?.id}`)
        }
        else {
            navigate(`/view/${info}`)
        }
    }
    return (
        <div> <Modal isOpen={isOpen} size={'md'} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    <span style={{ textTransform: "capitalize" }}>{info?.event?.groupId}</span>
                    <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                </ModalHeader>
                {isLoding ?
                    <Flex justifyContent={'center'} alignItems={'center'} mb={30} width="100%" >
                        <Spinner />
                    </Flex> : <>

                        <ModalBody>
                            <Grid templateColumns="repeat(12, 1fr)" gap={3} >
                                {data && Object.keys(data).length > 0 && Object.keys(data)?.map((item) =>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> {item}</Text>
                                        <Text>{data[item] ? data[item] : ' - '}</Text>
                                    </GridItem>
                                )}
                            </Grid>
                           
                        </ModalBody>
                        <DrawerFooter>
                            {access?.view || user?.role === "superAdmin" && <IconButton variant='outline' colorScheme={'green'} onClick={() => handleViewOpen()} borderRadius="10px" size="md" icon={<ViewIcon />} />}
                            {access?.update || user?.role === "superAdmin" && <IconButton variant='outline' onClick={() => setEdit(true)} ml={3} borderRadius="10px" size="md" icon={<EditIcon />} />}
                            {access?.delete || user?.role === "superAdmin" && <IconButton colorScheme='red' onClick={() => setDelete(true)} ml={3} borderRadius="10px" size="md" icon={<DeleteIcon />} />}

                        </DrawerFooter>
                    </>}
            </ModalContent>
        </Modal></div>
    )
}

export default ViewCalender