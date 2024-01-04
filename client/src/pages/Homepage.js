import React, { useEffect } from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import Login from '../components/auth/Login'
import Signup from '../components/auth/Signup'
import { useNavigate } from 'react-router-dom'
const Homepage = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        if (!userInfo) {
            navigate('/')
        } else {
            navigate("/chats")
        }
    }, [navigate])

    return (
        <Container maxW='xl' centerContent>
            <Box
                display={"flex"}
                justifyContent="center"
                p={3}
                bg={'white'}
                w="100%"
                m='40px 0 15px 0'
                borderRadius='lg'
                borderWidth='1px'
            >
                <Text
                    fontSize={'4xl'}
                    fontFamily="Work sans"
                    color={"black"}
                >Chat App</Text>
            </Box>
            <Box
                bg={'white'}
                w={'100%'}
                borderRadius={'lg'}
                borderWidth={'1px'}
                p={4}
                color={'black'}
            >

                <Tabs variant='soft-rounded'>
                    <TabList mb={'1em'}>
                        <Tab w={'50%'}>Login</Tab>
                        <Tab w={'50%'}>Sign up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Homepage