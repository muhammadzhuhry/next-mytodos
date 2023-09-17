import { STORAGES } from "@/constant";
import { setJWTAuth } from "@/utils/formatter";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import axios from 'axios';
import { SERVICES } from "@/config";
import { getLocalStorage } from "@/utils/storage";
import { useRouter } from "next/navigation";

export default function DeleteTaskModal({ isOpen, onClose, taskId }) {
  const toast = useToast();
  const router = useRouter();

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
    console.log('success',res)
    displayToast("Success to delete task", res.data.message, "success");
    router.refresh();
    onClose();
  }

  const handleError = (error) => {
    console.log('error',error);
    if (error.response) {
      displayToast("Failed to delete task", error.response.data.message ,"error");
    } else {
      displayToast("Failed to delete task", "An error occurred while deleting task. Please try again." ,"error");
    }
  }

  const handleDelete = async () => {
    setIsLoading(true);

    const accessToken = getLocalStorage(STORAGES.ACCESS_TOKEN);
    if (!accessToken) {
      router.push('/login');
      return
    }

    const JWT_AUTH = setJWTAuth(accessToken);

    await axios.delete(`${SERVICES.BASE_URL}/task/${taskId}`, JWT_AUTH)
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
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete this task? {taskId}
        </ModalBody>
        <ModalFooter>
          <Button
           isLoading={isLoading}
           loadingText='Deleting...'
           colorScheme="red"
           mx={2}
           fontSize={'sm'}
           onClick={() => { 
            handleDelete(); 
            onClose(); 
            }}
          >
            Yes
          </Button>
          <Button 
           onClick={onClose}
           mx={2}
           fontSize={'sm'}
          >
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
