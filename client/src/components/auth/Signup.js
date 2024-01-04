import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
const Signup = () => {
    const navigate = useNavigate()
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmpassword, setConfirmpassword] = useState()
    const [pic, setPic] = useState()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const postDetails = (pics) => {
        //to be changed => send the file to the backend and from the backend generate the url 
        setLoading(true)
        if (pics === undefined) {
            toast({
                title: 'please select an image.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/png") {
            const data = new FormData()
            data.append('file', pics)
            data.append("upload_preset", 'chat-app')
            data.append("cloud_name", "dn2iz9z6b")
            fetch("https://api.cloudinary.com/v1_1/dn2iz9z6b/upload", {
                method: 'POST',
                body: data
            }).then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString())
                    console.log(data.url.toString())
                    setLoading(false)
                }).catch((err) => {
                    console.log(err)
                    setLoading(false)
                })
        } else {
            toast({
                title: 'please select an image.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
        }
    }

    const submitHandler = async () => {
        setLoading(true)
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: 'fill all the felds.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
        }
        if (confirmpassword != password) {
            toast({
                title: 'passwords do not match.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
            return
        }

        try {
            const config = {
                headers: {
                    "content-type": "application/json",
                }
            }
            const { data } = await axios.post(
                '/api/user',
                { name, email, password, pic },
                config
            )
            toast({
                title: 'registration successful.',
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
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='enter your name' onChange={(e) => setName(e.target.value)} />
            </FormControl>


            <FormControl id='email' isRequired>
                <FormLabel>E-mail</FormLabel>
                <Input placeholder='enter your e-mail' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>


            <FormControl id='password' isRequired>
                <FormLabel>password</FormLabel>
                <InputGroup>
                    <Input
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



            <FormControl id='confirm-password' isRequired>
                <FormLabel>confirm password</FormLabel>
                <InputGroup>
                    <Input
                        placeholder='confirm your password'
                        type={show ? 'text' : 'password'}
                        onChange={(e) => setConfirmpassword(e.target.value)}

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


            <FormControl id='pic'>
                <FormLabel
                    textAlign={'center'}
                    mt={4}
                    borderWidth={1}
                    w={'45%'}
                    color={'white'}
                    borderRadius={'lg'}
                    bg={'#402C78'}
                    p={2}

                >upload your picutre</FormLabel>
                <Input
                    display={'none'}
                    type='file'
                    accept='image/*'
                    p={1.5}
                    onChange={(e) => postDetails(e.target.files[0])} />
            </FormControl>

            <Button
                colorScheme='blue'
                width={'100%'}
                mt={15}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign up
            </Button>
        </VStack>
    )
}

export default Signup