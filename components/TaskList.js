import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Heading,
  Text,
  IconButton,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Stack,
  Button,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { SERVICES } from '@/config';
import { STORAGES } from '@/constant';
import { useRouter } from 'next/navigation';
import { setJWTAuth } from '@/utils/formatter';
import { getLocalStorage } from '@/utils/storage';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import AddTaskModal from './AddTaskModal';

export default function TaskList() {
  // next enhancement:
  // 1. handling when token expired
  // 2. fix why hit api twice

  const toast = useToast();
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  const onOpenAddTask = () => setAddTaskOpen(true);
  const onCloseAddTask = () => setAddTaskOpen(false);

  const displayToast = useCallback((title, description, status) => {
    toast({
      position: "top-right",
      title,
      description,
      status,
      duration: 5000,
      isClosable: true, 
    });
  }, [toast]);

  useEffect(() => {
    const accessToken = getLocalStorage(STORAGES.ACCESS_TOKEN);
    if (!accessToken) {
      router.push('/login');
      return
    }

    const JWT_AUTH = setJWTAuth(accessToken);

    const handleSuccess = (res) => {
      console.log('masuk suces')
      const response = res.data;
      setTasks(response.data);
      displayToast("Success fetch tasks list", res.data.message, "success");
    }
  
    const handleError = (error) => {
      console.log(error)
      if (error.response) {
        displayToast("Failed to fetch tasks list", error.response.data.message, "error");
      } else {
        displayToast("Failed to fetch tasks list", "An error occurred while fetching the data. Please try again.", "error");
      }
    }

    axios.get(`${SERVICES.BASE_URL}/tasks`, JWT_AUTH)
      .then((response) => {
        handleSuccess(response);
      })
      .catch((error) => {
        handleError(error);
      });
  }, [displayToast, router]);
  

  return (
    <div>
      <Stack align={'center'}>
      <Heading fontSize={'4xl'}>MyTodos.</Heading>
      <Text fontSize={'lg'} color={'gray.600'}>
            here goes yours task list 📝
      </Text>
      </Stack>
      <Button 
        my={10}
        colorScheme='teal'
        width='100%'
        leftIcon={<AddIcon />}
        variant={'solid'}
        onClick={onOpenAddTask}
      >
        Add New Task
      </Button>

      <AddTaskModal isOpen={addTaskOpen} onClose={onCloseAddTask} />

      <TableContainer>
      <Table variant='striped' size='md'>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Task</Th>
            <Th>Done</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
        { 
          tasks.length > 0 ? (
            tasks.map(task => (
              <Tr key={task.id}>
                <Td>{task.id}</Td>
                <Td>{task.title}</Td>
                <Td>{task.done ? <Text color={'green.500'}>Yes</Text> : <Text color={'red.500'}>No</Text>}</Td>
                <Td>
                  <IconButton 
                    icon={<EditIcon />}
                    aria-label='edit task'
                    mx={2}
                    colorScheme='cyan'
                    variant='outline'
                  />
                  <IconButton 
                    icon={<DeleteIcon />}
                    aria-label='delete task'
                    mx={2}
                    colorScheme='red'
                    variant='outline'
                  />
                </Td>
              </Tr>
            )) 
          ) : (
            <Tr>
              <Td colSpan={4} textAlign={'center'}>No tasks available.</Td>
            </Tr>
          )
        }
        </Tbody>
      </Table>
      </TableContainer>
    </div>
  );
}
