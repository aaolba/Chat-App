import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import UserListItem from '../userAvatar/UserListItem'
import axios from 'axios'
import UserBadgeItems from '../userAvatar/UserBadgeItems'
import { config } from 'dotenv'
const GroupChatModal = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast()
    const { user, setUser, selectedChat, setSelectedChat, chats, setChats } = ChatState()




    const handleDelete = (toBeDeleted) => {
        setSelectedUsers(selectedUsers.filter(sel => selectedUsers._id != toBeDeleted._id))
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'user already added.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return
        }
        setSelectedUsers([...selectedUsers, userToAdd])
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
            setSearchResults(data)
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

    useEffect(() => {
        setSearchResults([])
        handleSearch(search)
    }, [search])
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'please fill all the fealds.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
        try {
            config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.post('/api/chat/groupe', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config)
            setChats([data, ...chats])
            onClose()
            toast({
                title: 'new group chat created.',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        } catch (err) {
            toast({
                title: 'failed to create chat.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }
    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        fontFamily={"work sans"}
                        display={'flex'}
                        justifyContent={"center"}
                    >create group chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        flexDir={"column"}
                        alignItems={"center"}
                    >
                        <FormControl>
                            <Input
                                placeholder='chat name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='add user'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box
                            display="flex"
                        >
                            {selectedUsers.map((user) => (

                                <UserBadgeItems
                                    key={user._id}
                                    user={user}
                                    handleFunction={(user) => handleDelete(user)}
                                />
                            ))}
                        </Box>
                        {
                            loading ? <div>loading</div> : (
                                searchResults?.slice(0, 4).map(user => (
                                    <UserListItem key={user._id}
                                        handleFunction={() => handleGroup(user)}
                                        user={user}
                                    />))
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='blue'
                            mr={3}
                            onClick={handleSubmit}
                        >
                            create
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal