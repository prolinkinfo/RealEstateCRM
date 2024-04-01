import { CloseIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import { DrawerFooter, Flex, Grid, GridItem, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Spinner from "components/spinner/Spinner"
import moment from 'moment'
import { useEffect, useState } from 'react'
import { BiLink } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { getApi } from 'services/api'
// import DeleteTask from './components/deleteTask'
// import EditTask from './components/editTask'
import { useNavigate } from 'react-router-dom';

const CallView = (props) => {
    const { onClose, isOpen, info, fetchData, setAction, action, access, contactAccess, leadAccess } = props
    const [data, setData] = useState();
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate()

    const fetchViewData = async () => {
        if (info) {
            setIsLoding(true)
            let result = await getApi('api/phoneCall/view/', info?.event ? info?.event?.id : info);
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
        <Modal isOpen={isOpen} size={'md'} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    Call
                    <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                </ModalHeader>
                {isLoding ?
                    <Flex justifyContent={'center'} alignItems={'center'} mb={30} width="100%" >
                        <Spinner />
                    </Flex> : <>

                        <ModalBody>
                            <Grid templateColumns="repeat(12, 1fr)" gap={3} >

                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Recipient </Text>
                                    <Text>{data?.recipient ? data?.recipient : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Sender Name  </Text>
                                    <Text>{data?.senderName ? data?.senderName :'-'}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Start Date </Text>
                                    <Text>{data?.startDate ? moment(data?.startDate).format('lll ') : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> End Date </Text>
                                    <Text>{data?.endDate ? moment(data?.endDate).format('lll ') : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Call Duration</Text>
                                    <Text>{data?.callDuration ? data?.callDuration :'-'}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Created By</Text>
                                    <Text>{data?.createByName ? data?.createByName :'-'}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Call Notes</Text>
                                    <Text>{data?.callNotes ? data?.callNotes :'-'}</Text>
                                </GridItem>
                                {/* <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Related To </Text>
                                    <Text>{data?.category ? data?.category : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task start </Text>
                                    <Text>{data?.start ? moment(data?.start).format('L LT') : ' - '}</Text>
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
                                    {data?.assignmentTo ?
                                        <Link to={contactAccess?.view && `/contactView/${data?.assignmentTo}`}>
                                            <Text color={contactAccess?.view ? 'blue.500' : 'blackAlpha.900'} sx={{ '&:hover': { color: contactAccess?.view ? 'blue.500' : 'blackAlpha.900', textDecoration: contactAccess?.view ? 'underline' : 'none' } }}>{data?.assignmentToName ? data?.assignmentToName : ' - '}</Text>
                                        </Link> : <Link to={leadAccess?.view && `/leadView/${data?.assignmentToLead}`}>
                                            <Text color={leadAccess?.view ? 'blue.500' : 'blackAlpha.900'} sx={{ '&:hover': { color: leadAccess?.view ? 'blue.500' : 'blackAlpha.900', textDecoration: leadAccess?.view ? 'underline' : 'none' } }}>{data?.assignmentToName ? data?.assignmentToName : ' - '}</Text>
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
                                </GridItem> */}
                            </Grid>

                        </ModalBody>
                        <DrawerFooter>
                            {access?.view && <IconButton variant='outline' colorScheme={'green'} onClick={() => handleViewOpen()} borderRadius="10px" size="md" icon={<ViewIcon />} />}
                            {access?.update && <IconButton variant='outline' onClick={() => setEdit(true)} ml={3} borderRadius="10px" size="md" icon={<EditIcon />} />}
                            {access?.delete && <IconButton colorScheme='red' onClick={() => setDelete(true)} ml={3} borderRadius="10px" size="md" icon={<DeleteIcon />} />}

                            {/* <EditTask setAction={setAction} isOpen={edit} onClose={setEdit} viewClose={onClose} id={info?.event ? info?.event?.id : info} from="view" />
                            <DeleteTask fetchData={props.fetchData} isOpen={deleteModel} onClose={setDelete} viewClose={onClose} url='api/task/delete/' method='one' id={info?.event ? info?.event?.id : info} /> */}
                        </DrawerFooter>
                    </>}
            </ModalContent>
        </Modal>
    )
}

export default CallView
