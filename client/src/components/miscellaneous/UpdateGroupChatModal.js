import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import UserBadgeItems from '../userAvatar/UserBadgeItems'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, selectedChat, setSelectedChat } = ChatState()
    const [groupName, setGroupName] = useState("")
    const [loading, setLoading] = useState(false)
    const [searchResult, setSearchResult] = useState([])
    const [search, setSearch] = useState("")
    const [renameLoading, setRenameLoading] = useState(false)

    const toast = useToast()

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: 'only admin can remove.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            await axios.put('/api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: user1._id
            }, config).then((res) => {
                if (user1._id === user._id)
                    setSelectedChat()
                else
                    setSelectedChat(res.data)
            })
            fetchMessages()
            // user1._id === user._id ? selectedChat() : selectedChat()
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (err) {
            toast({
                title: 'error .',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            setLoading(false)
        }
    }
    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: 'user already exists in group.',
                status: 'worning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            return
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'only admin can add someone to group.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: user1._id
            }, config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (err) {
            toast({
                title: 'error occured.',
                description: err.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            setLoading(false)
        }
    }
    const handleRename = async () => {
        if (!groupName) return

        try {
            setRenameLoading(false)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupName
            }, config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (err) {
            toast({
                title: 'error occured.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setRenameLoading(false)
        }
        setGroupName('')
    }
    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) return
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.get(`/api/user?search=${query}`, config)
            setLoading(false)
            setSearchResult(data)
            console.log(data)
        } catch (err) {
            toast({
                title: 'error occured.',
                description: "failed to load the search results",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }
    return (
        <>
            <IconButton
                icon={<ViewIcon />}
                onClick={onOpen}
                display={{ base: "flex" }}
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily="work sans"
                        display='flex'
                        justifyContent='center'
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            w="100%"
                            display="flex"
                            flexWrap="wrap"
                            pb={3}
                        >
                            {selectedChat.users.map((u) => (
                                <UserBadgeItems
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl
                            display={"flex"}
                        >
                            <Input
                                placeholder='chat Name'
                                mb={3}
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                            <Button
                                variant={'solid'}
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='add user to group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {
                            loading ? (
                                <Spinner size='lg' />
                            ) : (
                                searchResult?.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleAddUser(user)}
                                    />
                                ))
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleRemove(user)}>
                            leave group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal