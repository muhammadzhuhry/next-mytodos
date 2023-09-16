import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import axios from 'axios';
import { SERVICES } from '@/config';
import { BASIC_AUTH, STORAGES } from '@/constant';
import { useRouter } from 'next/navigation';
import { getLocalStorage } from '@/utils/storage';
import { setJWTAuth } from '@/utils/formatter';

export default function AddTaskModal({ isOpen, onClose }) {
  const toast = useToast();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [done, setDone ] = useState(false);
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

  const handleSuccess = (res) => {
    displayToast("Success to save task", res.data.message, "success");
    router.refresh();
    onClose();
  }

  const handleError = (error) => {
    if (error.response) {
      displayToast("Failed to save task", error.response.data.message ,"error");
    } else {
      displayToast("Failed to save task", "An error occurred while inserting task. Please try again." ,"error");
    }
  }

  const resetForm = () => {
    setTitle('');
    setDone(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const payload = {
      title,
      done
    };

    const accessToken = getLocalStorage(STORAGES.ACCESS_TOKEN);
    if (!accessToken) {
      router.push('/login');
      return
    }

    const JWT_AUTH = setJWTAuth(accessToken);
    
    await axios.post(`${SERVICES.BASE_URL}/tasks`, payload, JWT_AUTH)
      .then((response) => {
        handleSuccess(response);
      })
      .catch((error) => {
        handleError(error);
      })
      .finally(setIsLoading(false))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Task</ModalHeader>
        <ModalBody>
          <FormControl id="title">
            <FormLabel>Task Title</FormLabel>
            <Input
              type='text'
              placeholder='Enter task title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl id="done">
            <FormLabel>Done</FormLabel>
            <Select placeholder='Select' value={done} onChange={(e) => setDone(e.target.value === 'true')}>
              <option value={true}>True</option>
              <option value={false}>False</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button 
            isLoading={isLoading}
            loadingText='Saving...'
            colorScheme='teal'
            mx={2}
            fontSize={'sm'}
            onClick={handleSave}
          >
            Add
          </Button>
          <Button 
            onClick={() => {
              onClose();
              resetForm();
            }}
            mx={2}
            fontSize={'sm'}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
