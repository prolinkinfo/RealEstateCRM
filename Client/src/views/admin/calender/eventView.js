import { CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { DrawerFooter, Grid, GridItem, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BiLink } from 'react-icons/bi'
import { getApi } from 'services/api'
import EditTask from './components/editTask'
import DeleteTask from './components/deleteTask'
import moment from 'moment'

const EventView = (props) => {
    const { onClose, isOpen, info } = props
    const [data, setData] = useState()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);

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
                    Event
                    <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                </ModalHeader>
                <ModalBody>

                    <Grid templateColumns="repeat(12, 1fr)" gap={3} >

                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Event Title </Text>
                            <Text>{data?.title ? data?.title : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Event category </Text>
                            <Text>{data?.category ? data?.category : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Event start </Text>
                            <Text>{data?.start ? moment(data?.start).format('L LT') : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Event end  </Text>
                            <Text>{data?.end ? moment(data?.end).format('L LT') : moment(data?.start).format('L')}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Event Link </Text>
                            {data?.url ?
                                <a target='_blank' href={data?.url}>
                                    <IconButton borderRadius="10px" size="md" icon={<BiLink />} />
                                </a> : '-'
                            }
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 6 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Event reminder </Text>
                            <Text>{data?.reminder ? data?.reminder : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> assignment To  </Text>
                            <Text>{data?.assignmentToName ? data?.assignmentToName : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Event createBy </Text>
                            <Text>{data?.createByName ? data?.createByName : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Event Description</Text>
                            <Text>{data?.description ? data?.description : ' - '}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }} >
                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Event notes </Text>
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
