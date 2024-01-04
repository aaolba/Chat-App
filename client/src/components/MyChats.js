import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Avatar, AvatarGroup, Box, Button, Stack, Text, space, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatUsersLoading from './ChatUsersLoading'
import { getsender, getsenderpic } from '../config/ChatLogics'
import GroupChatModal from './miscellaneous/GroupChatModal'

const MyChats = ({ fetchagain }) => {
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()
    const toast = useToast()
    const [loggedUser, setLoggedUser] = useState()


    const fetchChats = async () => {

        try {
            const config =
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            await axios.get("/api/chat", config).then((res) => {
                setChats(res.data)
            }

            )
            console.log(chats)

        } catch (err) {
            toast({
                title: 'error occured.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')))
        fetchChats()

    }, [fetchagain])






    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "31%" }}
            borderRadius={"lg"}
            borderWidth={"1px"}
            m={4}
            h={'89.7vh'}
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "20px", lg: "28px" }}
                fontFamily={"work sans"}
                display={"flex"}
                w={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                chats
                <GroupChatModal>

                    <Button
                        display={'flex'}
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        new group chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display={"flex"}
                flexDir={"column"}
                p={3}
                bg={"#F8F8F8"}
                w={"100%"}
                h={"100%"}
                borderRadius={"lg"}
                overflowY={"hidden"}
            >
                {chats.length > 0 ? (
                    <Stack
                        overflowY="scroll"
                    >
                        {chats.map((chat) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor='pointer'
                                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                            >

                                {!chat.isGroupChat ? (
                                    <Box
                                        display={'flex'}
                                        justifyContent={'space-between'}
                                        alignItems={"center"}
                                    >
                                        <Box
                                            display={'flex'}
                                            justifyContent={"space-evenly"}
                                            alignItems={"center"}

                                        >
                                            <Avatar
                                                size={"sm"}
                                                cursor={"pointer"}
                                                name={user.name}
                                                src={getsenderpic(loggedUser, chat.users)}
                                                mr={2}
                                            />
                                            <Text> {getsender(loggedUser, chat.users)}</Text>
                                        </Box>
                                        <i className='fas fa-user'></i>

                                    </Box>
                                ) : (
                                    <Box
                                        display={'flex'}
                                        justifyContent={'space-between'}
                                        alignItems={"center"}
                                    >
                                        <Box
                                            display={'flex'}
                                            justifyContent={"space-evenly"}
                                            alignItems={"center"}
                                        >
                                            <AvatarGroup mr={2} size='sm' max={2} >
                                                {chat.users.map(user => (
                                                    <Avatar key={user._id} name={user.name} src={user.pic} />
                                                ))
                                                }

                                            </AvatarGroup>
                                            <Text> {chat.chatName}</Text>
                                        </Box>
                                        <i class="fas fa-users"></i>                                    </Box>

                                )}

                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatUsersLoading />
                )
                }
            </Box>
        </Box>
    )
}

export default MyChats