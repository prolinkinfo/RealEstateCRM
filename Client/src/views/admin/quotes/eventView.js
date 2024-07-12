import { CloseIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import { DrawerFooter, Flex, Grid, GridItem, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Spinner from "components/spinner/Spinner"
import moment from 'moment'
import { useEffect, useState } from 'react'
import { BiLink } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { getApi } from 'services/api'
import { useNavigate } from 'react-router-dom';
import AddEdit from './components/AddEdit'

const EventView = (props) => {
    const { onClose, isOpen, id, fetchData, setAction, action, access, contactAccess, leadAccess } = props
    const [data, setData] = useState()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate()

    const fetchViewData = async () => {
        if (id) {
            setIsLoding(true)
            let result = await getApi('api/task/view/', id?.event ? id?.event?.id : id);
            setData(result?.data);
            setIsLoding(false)
        }
    }

    useEffect(() => {
        fetchViewData()
    }, [action, id])

    const handleViewOpen = () => {
        if (id?.event) {
            navigate(`/view/${id?.event?.id}`)
        }
        else {
            navigate(`/view/${id}`)
        }
    }
    return (
        <>
            <Modal isOpen={isOpen} size={'md'} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader justifyContent='space-between' display='flex' >
                        Task
                        <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                    </ModalHeader>
                    {isLoding ?
                        <Flex justifyContent={'center'} alignItems={'center'} mb={30} width="100%" >
                            <Spinner />
                        </Flex> : <>
                            <ModalBody>
                                <Grid templateColumns="repeat(12, 1fr)" gap={3} >

                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Title </Text>
                                        <Text>{data?.title ? data?.title : ' - '}</Text>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Related To </Text>
                                        <Text>{data?.category ? data?.category : ' - '}</Text>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task start </Text>
                                        <Text>{data?.start ? moment(data?.start).format('L LT') : ' - '}</Text>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task end  </Text>
                                        <Text>{data?.end ? moment(data?.end).format('L LT') : moment(data?.start).format('L')}</Text>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Link </Text>
                                        {data?.url ?
                                            <a target='_blank' href={data?.url}>
                                                <IconButton borderRadius="10px" size="md" icon={<BiLink />} />
                                            </a> : '-'
                                        }
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task reminder </Text>
                                        <Text>{data?.reminder ? data?.reminder : ' - '}</Text>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> assignment To  </Text>
                                        {data?.assignTo ?
                                            <Link to={contactAccess?.view && `/contactView/${data?.assignTo}`}>
                                                <Text color={contactAccess?.view ? 'blue.500' : 'blackAlpha.900'} sx={{ '&:hover': { color: contactAccess?.view ? 'blue.500' : 'blackAlpha.900', textDecoration: contactAccess?.view ? 'underline' : 'none' } }}>{data?.assignToName ? data?.assignToName : ' - '}</Text>
                                            </Link> : <Link to={leadAccess?.view && `/leadView/${data?.assignToLead}`}>
                                                <Text color={leadAccess?.view ? 'blue.500' : 'blackAlpha.900'} sx={{ '&:hover': { color: leadAccess?.view ? 'blue.500' : 'blackAlpha.900', textDecoration: leadAccess?.view ? 'underline' : 'none' } }}>{data?.assignToName ? data?.assignToName : ' - '}</Text>
                                            </Link>
                                        }
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task createBy </Text>
                                        <Text>{data?.createByName ? data?.createByName : ' - '}</Text>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Description</Text>
                                        <Text>{data?.description ? data?.description : ' - '}</Text>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task notes </Text>
                                        <Text>{data?.notes ? data?.notes : ' - '}</Text>
                                    </GridItem>
                                </Grid>

                            </ModalBody>
                            <DrawerFooter>
                                {(access?.view || user?.role === "superAdmin") && <IconButton variant='outline' colorScheme={'green'} onClick={() => handleViewOpen()} borderRadius="10px" size="md" icon={<ViewIcon />} />}
                                {(access?.update || user?.role === "superAdmin") && <IconButton variant='outline' onClick={() => setEdit(true)} ml={3} borderRadius="10px" size="md" icon={<EditIcon />} />}
                                {(access?.delete || user?.role === "superAdmin") && <IconButton colorScheme='red' onClick={() => setDelete(true)} ml={3} borderRadius="10px" size="md" icon={<DeleteIcon />} />}
                                <AddEdit isOpen={edit} fetchData={fetchData} onClose={() => setEdit(false)} userAction={"edit"} id={id} setAction={setAction} />
                                {/* <EditTask setAction={setAction} isOpen={edit} onClose={setEdit} viewClose={onClose} id={id?.event ? id?.event?.id : id} from="view" /> */}
                                {/* <DeleteTask fetchData={props.fetchData} isOpen={deleteModel} onClose={setDelete} viewClose={onClose} url='api/task/delete/' method='one' id={id?.event ? id?.event?.id : id} /> */}
                            </DrawerFooter>
                        </>}
                </ModalContent>
            </Modal>
        </>
    )
}

export default EventView
