import TaskList from '@/components/TaskList';
import { Container } from '@chakra-ui/react';


export default function TaskPage() {
  return (
    <Container maxW="container.sm" mt={10}>
      <TaskList />
    </Container>
  );
}
