import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';

export default function TestPage() {
  return (
    <Box p={8} maxW="md" mx="auto" textAlign="center">
      <VStack spacing={6}>
        <Heading color="blue.600">🎉 Frontend is Working!</Heading>
        <Text fontSize="lg">
          The Receipt Tracker frontend is now running successfully with Chakra UI.
        </Text>
        <Button colorScheme="blue" size="lg">
          Test Button
        </Button>
        <Text fontSize="sm" color="gray.600">
          Backend API: https://receipttrackerbe-production.up.railway.app/
          <br />
          Frontend: http://localhost:5173
        </Text>
      </VStack>
    </Box>
  );
}