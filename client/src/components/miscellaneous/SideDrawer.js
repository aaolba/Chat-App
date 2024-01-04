import {
    Avatar,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    Tooltip,
    useToast
}
    from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks'
import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { ChatState } from '../../context/ChatProvider'
import ProfileModal from './ProfileModal'
import axios from 'axios'
import ChatUsersLoading from '../ChatUsersLoading'
import UserListItem from '../userAvatar/UserListItem'

const SideDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()



    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    "Authorization": `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post('/api/chat', { userId }, config)
            console.log(data)
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats])
            }
            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch (err) {
            toast({
                title: 'error getting the chat.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'enter something to search.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            })
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    "Authorization": `Bearer ${user?.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)

        } catch (err) {
            toast({
                title: 'failed to load search results.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }

    const logoutHandler = () => {
        localStorage.removeItem('userInfo')
        navigate('/')
    }
    return (
        <>
            <Box
                display={'flex'}
                justifyContent={"space-between"}
                alignItems={"center"}
                bg={"white"}
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth={"5px"}
            >
                <Tooltip label="search users to chat" hasArrow placement='bottom-end'>
                    <Button
                        variant={"ghost"}
                        onClick={onOpen}
                    >
                        <i className='fas fa-search'></i>
                        <Text
                            display={{ base: "none", md: "flex" }}
                            px={4}
                        > Search users </Text>
                    </Button>
                </Tooltip>
                <Text
                    fontSize={"2xl"} fontFamily={"work sans"}
                >
                    chat
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize={"2xl"} m={1} />
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size={"sm"} cursor={"pointer"} name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem
                                onClick={logoutHandler}
                            >Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer
                placement='left'
                onClose={onClose}
                isOpen={isOpen}
            >
                <DrawerOverlay />
                <DrawerContent >
                    <DrawerHeader
                        borderBottomWidth="1px"
                    >
                        search users</DrawerHeader>
                    <DrawerBody>
                        <Box
                            display="flex"
                            pb={2}
                        >
                            <Input
                                placeholder='search by name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                onClick={handleSearch}
                            >go</Button>
                        </Box>
                        {
                            loading ? (
                                <ChatUsersLoading />
                            ) : (
                                searchResult.map(user => (
                                    <UserListItem
                                        key={user._id}
                                        handleFunction={() => accessChat(user._id)}
                                        user={user} />
                                )
                                )
                            )
                        }
                        {loadingChat && <Spinner ml="auto" d="flex" />}
                    </DrawerBody>
                </DrawerContent >
            </Drawer>
        </>
    )
}

export default SideDrawer