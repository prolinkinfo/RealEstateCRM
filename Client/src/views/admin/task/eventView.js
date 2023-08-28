import { CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { DrawerFooter, Grid, GridItem, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BiLink } from 'react-icons/bi'
import { getApi } from 'services/api'
import EditTask from './components/editTask'
import DeleteTask from './components/deleteTask'
import moment from 'moment'
import { Link } from 'react-router-dom'

const EventView = (props) => {
    const { onClose, isOpen, info } = props
    const [data, setData] = useState()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"))

    const fetchData = async () => {
        if (info) {
            let result = await getApi('api/task/view/', info?.event ? info?.event?._def?.extendedProps?._id : info);
            setData(result?.data);
        }
    }

    useEffect(() => {
        fetchData()
    }, [info])

    return (
        <Modal isOpen={isOpen} size={'md'} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    Task
                    <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                </ModalHeader>
                <ModalBody>

                    <Grid templateColumns="repeat(12, 1fr)" gap={3} >

                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Title </Text>
                            <Text>{data?.title ? data?.title : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task category </Text>
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
                        <GridItem colSpan={{ base: 12 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> assignment To  </Text>
                            {/* <Text>{data?.assignmentToName ? data?.assignmentToName : ' - '}</Text> */}
                            <Link to={data?.assignmentTo ? user?.role !== 'admin' ? `/contactView/${data?.assignmentTo}` : `/admin/contactView/${data?.assignmentTo}` : user?.role !== 'admin' ? `/leadView/${data?.assignmentToLead}` : `/admin/leadView/${data?.assignmentToLead}`}>
                                <Text color='green.400' sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{data?.assignmentToName ? data?.assignmentToName : ' - '}</Text>
                            </Link>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }} >
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
                    <IconButton variant='outline' onClick={() => setEdit(true)} borderRadius="10px" size="md" icon={<EditIcon />} />
                    <IconButton colorScheme='red' onClick={() => setDelete(true)} ml={3} borderRadius="10px" size="md" icon={<DeleteIcon />} />

                    <EditTask fetchData={props.fetchData} isOpen={edit} onClose={setEdit} viewClose={onClose} id={info?.event ? info?.event?._def?.extendedProps?._id : info} />
                    <DeleteTask fetchData={props.fetchData} isOpen={deleteModel} onClose={setDelete} viewClose={onClose} url='api/task/delete/' method='one' id={info?.event ? info?.event?._def?.extendedProps?._id : info} />
                </DrawerFooter>
            </ModalContent>
        </Modal>
    )
}

export default EventView
