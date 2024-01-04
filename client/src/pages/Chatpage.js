import { Box } from "@chakra-ui/react"
import { ChatState } from "../context/ChatProvider"
import { ChatBox, MyChats } from '../components'
import { SideDrawer } from "../components/miscellaneous"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
const Chatpage = () => {

    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()
    const navigate = useNavigate()
    const [fetchagain, setFetchAgain] = useState(false)
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        if (!userInfo) {
            navigate('/')
        } else {
            navigate("/chats")
        }
    }, [navigate])
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box
                display="flex"
                justifyContent="space-between"
            >
                {user && <MyChats fetchagain={fetchagain} />}
                {user && <ChatBox fetchagain={fetchagain} setFetchAgain={setFetchAgain} />}

            </Box>

        </div>
    )
}

export default Chatpage