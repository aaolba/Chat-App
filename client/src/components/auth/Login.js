import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useToast } from '@chakra-ui/react'
import axios from 'axios'

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [show, setShow] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)


    const submitHandler = async () => {
        setLoading(true)
        if (!email || !password) {
            toast({
                title: 'fill all the felds.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
        }
        try {
            const config = {
                headers: {
                    "content-type": "application/json",
                }
            }
            const { data } = await axios.post(
                '/api/user/login',
                { email, password },
                config
            )
            toast({
                title: 'login successful.',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            localStorage.setItem("userInfo", JSON.stringify(data))
            navigate('/chats')
            setLoading(false)
        } catch (error) {
            toast({
                title: 'rerror occured.',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
        }
    }

    return (
        <VStack spacing={'5px'} color={'black'}>

            <FormControl id='email' isRequired>
                <FormLabel>E-mail</FormLabel>
                <Input
                    placeholder='enter your e-mail'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </FormControl>


            <FormControl id='password' isRequired>
                <FormLabel>password</FormLabel>
                <InputGroup>
                    <Input
                        value={password}
                        placeholder='enter your password'
                        type={show ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}

                    />
                    <InputRightElement
                        width={'4.5rem'}
                    >
                        <Button
                            h={'1.75rem'}
                            size={'sm'}
                            onClick={() => setShow(!show)}
                        >
                            {show ? 'hide' : 'show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme='blue'
                width={'100%'}
                mt={15}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>
            <Button
                colorScheme='red'
                variant={'solid'}
                width={'100%'}
                onClick={() => {
                    setEmail("guest@guest.com")
                    setPassword('guest')
                }}
            >
                Login as guest
            </Button>
        </VStack>
    )
}

export default Login