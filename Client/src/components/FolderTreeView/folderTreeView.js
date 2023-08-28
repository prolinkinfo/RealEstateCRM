import { DeleteIcon, DownloadIcon, LinkIcon, ViewIcon } from '@chakra-ui/icons';
import { Collapse, Flex, List, ListIcon, ListItem, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { FcOpenedFolder } from 'react-icons/fc';
import { FiChevronDown, FiChevronRight, FiFile } from 'react-icons/fi';
import Delete from 'views/admin/document/component/Delete';
import LinkModel from 'views/admin/document/component/LinkModel';

const FolderTreeView = ({ data, deleteFile, item, download, name, isFile, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    // const user = localStorage.getItem('user');
    const [deleteModel, setDelete] = useState(false);
    const [linkModel, setLinkModel] = useState(false);
    const [id, setId] = useState(false);


    const handleToggle = () => {
        setIsOpen(!isOpen);
    };
    const isFolder = !isFile && !!children;

    const handleClick = (data) => {
        download(data)
    }

    const deletedata = (data) => {
        setDelete(true)
        setId(data)
    }

    const handleLinkClick = (data) => {
        setLinkModel(true)
        setId(data)
    }

    function isImageUrl(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
        const urlExtension = url.substring(url.lastIndexOf('.')).toLowerCase();
        return imageExtensions.includes(urlExtension);
    }
    return (
        <List width={'100%'} >
            <ListItem alignItems={'center'} display={'flex'} >
                <Text alignItems={'center'} justifyContent={'space-between'} display={'flex'} width={'100%'} onClick={isFolder ? handleToggle : undefined} _hover={{ cursor: 'pointer', textDecoration: 'none' }}>
                    <Flex width={'70%'} alignItems={'center'}>
                        <ListIcon as={isFile ? FiFile : FcOpenedFolder} />
                        {isFolder && (isOpen ? <FiChevronDown /> : <FiChevronRight />)}
                        {name}
                    </Flex>
                    {item?.createByName ? <Text>({item?.createByName})</Text> : null}
                    {!isFolder &&
                        <Text>
                            <LinkIcon ml={3} cursor={'pointer'} onClick={() => handleLinkClick(data?._id)} />
                            {isImageUrl(data?.img) && <ViewIcon ml={3} cursor={'pointer'} color={'green'} onClick={() => window.open(data?.img)} />}
                            <DownloadIcon ml={3} cursor={'pointer'} onClick={() => handleClick(data?._id)} />
                            <DeleteIcon ml={3} cursor={'pointer'} color={'red'} onClick={() => deletedata(data?._id)} />
                        </Text>
                    }
                    <Delete isOpen={deleteModel} onClose={setDelete} method='one' deleteFile={deleteFile} id={id} />
                    <LinkModel isOpen={linkModel} onClose={setLinkModel} id={id} />
                </Text>
            </ListItem>
            {isFolder && (
                <Collapse in={isOpen} animateOpacity>
                    <List styleType="disc" ml={4}>
                        {children}
                    </List>
                </Collapse>
            )}
        </List>
    );
};


export default FolderTreeView
