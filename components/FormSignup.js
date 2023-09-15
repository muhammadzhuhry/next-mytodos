'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios';
import { useState } from 'react'
import { SERVICES } from '@/config';
import { BASIC_AUTH } from '@/constant';
import { useRouter } from 'next/navigation';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

export default function FormSignup() {
  const toast = useToast();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const displayToast = (title, description, status) => {
    toast({
      position: "top-right",
      title,
      description,
      status,
      duration: 5000,
      isClosable: true, 
    });
  }

  const handleLoginSuccess = (res) => {
    displayToast("Register User Success", res.data.message, "success");
    router.push('/login');
  }

  const handleLoginError = (error) => {
    if (error.response) {
      displayToast("Register User Error", error.response.data.message, "error");
    } else {
      displayToast("Register User Error", "An error occurred while registering user. Please try again." ,"error");
    }
  }

  const handleSignup = async () => {
    setIsLoading(true);
    const payload = {
      name,
      email,
      password
    };

    try {
      const res = await axios.post(`${SERVICES.BASE_URL}/register`, payload, BASIC_AUTH.token);

      handleLoginSuccess(res);
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
    >
      <Stack width={'100%'} spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up 
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of mytodos apps features ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                 type={showPassword ? 'text' : 'password'}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)} 
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={5} pt={2}>
              <Button
                isLoading={isLoading}
                loadingText="Submitting..."
                fontSize="sm"
                colorScheme="teal"
                onClick={handleSignup}
              >
                Sign up
              </Button>
              <Text align={'center'}>
                Already a user? <Link href="/login" color={'blue.400'}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}