import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { SERVICES } from '../config'
import { BASIC_AUTH, STORAGES } from '../constant'
import { useRouter } from 'next/navigation';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function FormLogin() {
  const toast = useToast();
  const router = useRouter();

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
    localStorage.setItem(STORAGES.ACCESS_TOKEN, res.data.data);
    displayToast("Login Success", res.data.message, "success");
    router.push('/tasks');
  }

  const handleLoginError = (error) => {
    if (error.response) {
      displayToast("Login Error", error.response.data.message, "error");
    } else {
      displayToast("Login Error", "An error occurred while logging in. Please try again." ,"error");
    }
  }

  const handleLogin = async () => {
    setIsLoading(true);
    const payload = {
      email,
      password
    };

    try {
      const res = await axios.post(`${SERVICES.BASE_URL}/login`, payload, BASIC_AUTH.token);

      handleLoginSuccess(res);
      
    } catch (error) {
      handleLoginError(error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
    >
      <Stack width={'100%'} spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to start using mytodos apps ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
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
                    onClick={() => setShowPassword((showPassword) => !showPassword)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={5}>
              <Button
                isLoading={isLoading}
                loadingText='Loading...'
                colorScheme="teal"
                fontSize="sm"
                onClick={handleLogin}
              >
                Login
              </Button>
              <Text align="center">
                Don&apos;t have an account? <Link href="/signup" color={'blue.400'}>Signup</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}