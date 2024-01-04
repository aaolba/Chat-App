import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat'






const ChatBox = ({ fetchagain, setFetchAgain }) => {



    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()




    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg={"white"}
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth='1px'
            m={4}
            h={'89.7vh'}
        >
            <SingleChat fetchagain={fetchagain} setFetchAgain={setFetchAgain} />
        </Box>
    )
}

export default ChatBox