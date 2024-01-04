import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useStatStyles, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getsender, getsenderFull } from '../config/ChatLogics'
import { ProfileModal } from './miscellaneous'
import { ViewIcon } from '@chakra-ui/icons'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'
import io from "socket.io-client"
import Lottie from 'lottie-react'
import animationData from "../animation/typing.json"
const ENDPOINT = "http://localhost:5000"
var socket, selectedChatCompaire;

const SingleChat = ({ fetchagain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState()
    const [messages, setMessages] = useState([])
    const [loading, setloading] = useState(false)
    const [newMessage, setnewMessage] = useState()
    const toast = useToast()
    const [typing, setTiping] = useState(false)
    const [istyping, setIsTiping] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)
    const defaultOptions = {
        loop: true,
        autoplay: true,
        Animation: animationData,
        rendererSettings: {
            preserveAspectratio: "xMidYmid slice"
        }

    };


    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            setloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            axios.get(`api/message/${selectedChat._id}`, config).then(res => {

                setloading(false);
                setMessages(res.data);
                socket.emit("join chat", selectedChat._id)

            })
        } catch (error) {
            toast({
                title: "Error getting messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    };
    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('setup', user)
        socket.on('connected', () => {
            setSocketConnected(true)
        })
        socket.on("typing", () => setIsTiping(true))
        socket.on("stop typing", () => setIsTiping(false))

    }, [])

    useEffect(() => {
        fetchMessages();
        selectedChatCompaire = selectedChat
    }, [selectedChat])

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChatCompaire || selectedChatCompaire._id !== newMessageRecieved.chat._id) {
                //notif
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })



    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                };

                setnewMessage("")

                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)
                socket.emit("stop typing", selectedChat._id)
                console.log(data)
                socket.emit("new-message", data)
                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: "error sending message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                })
            }
        }
    }
    const typingHandler = (e) => {
        setnewMessage(e.target.value)
        if (!socketConnected) return
        if (!typing) {
            setTiping(true)
            socket.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTiping(false)
            }
        }, timerLength)
    }





    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="work sans"
                        display='flex'
                        justifyContent={{ base: "space-between" }}
                        alignItems={"center"}
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>{getsender(user, selectedChat.users)}
                                <ProfileModal user={getsenderFull(user, selectedChat.users)} >
                                    <IconButton
                                        display={{ base: "flex" }}
                                        icon={<ViewIcon />}

                                    />
                                </ProfileModal>
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchagain={fetchagain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display={'flex'}
                        flexDir="column"
                        justifyContent={"flex-end"}
                        p={3}
                        bg='#E8E8E8'
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflow="hidden"
                    >
                        {!loading || !messages ?
                            (<>
                                <Box
                                    display={'flex'}
                                    flexDir={"column"}
                                    overflowY={"scroll"}
                                    overflowX={'hidden'}
                                >
                                    <ScrollableChat messages={messages} />
                                </Box>
                            </>)
                            :
                            (<Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />)}
                        <FormControl
                            onKeyDown={sendMessage}
                            isRequired
                            mt={3}
                        >
                            {istyping ? <div
                                style={{ marginBottom: 15, marginLeft: 15, width: "100px" }}>
                                <Lottie

                                    // options={defaultOptions}
                                    animationData={animationData}
                                />
                            </div> : <></>}
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder='Enter a message'
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    h="100%"
                >
                    <Text
                        fontSize="3xl"
                        pb={3}
                        fontFamily="work sans"
                    >
                        Click on user to start chating
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat