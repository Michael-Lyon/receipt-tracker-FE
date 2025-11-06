import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Icon,
  useColorModeValue,
  Image,
  Progress
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiFileText, FiDollarSign, FiCalendar, FiArrowLeft, FiCheck } from 'react-icons/fi';

const DemoStep = ({ stepNumber, title, description, isActive = false, isCompleted = false }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.600', 'blue.300');

  return (
    <Card 
      bg={isActive ? activeBg : bgColor} 
      borderColor={isActive ? activeColor : borderColor} 
      borderWidth={2}
      shadow={isActive ? "md" : "sm"}
      h="100%"
    >
      <CardBody p={{ base: 4, md: 6, lg: 8 }} h="100%">
        {/* Mobile Layout - Horizontal */}
        <HStack spacing={4} align="start" display={{ base: "flex", md: "none" }} h="100%">
          <Box
            w={10}
            h={10}
            borderRadius="full"
            bg={isCompleted ? "green.500" : isActive ? activeColor : "gray.300"}
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
            flexShrink={0}
            fontSize="sm"
          >
            {isCompleted ? <Icon as={FiCheck} /> : stepNumber}
          </Box>
          <VStack spacing={2} align="start" flex={1}>
            <Heading size="sm" color={isActive ? activeColor : "inherit"}>
              {title}
            </Heading>
            <Text color="gray.600" fontSize="sm">
              {description}
            </Text>
          </VStack>
        </HStack>

        {/* Tablet and Desktop Layout - Vertical */}
        <VStack spacing={4} align="center" display={{ base: "none", md: "flex" }} h="100%" textAlign="center">
          <Box
            w={{ base: 12, md: 14 }}
            h={{ base: 12, md: 14 }}
            borderRadius="full"
            bg={isCompleted ? "green.500" : isActive ? activeColor : "gray.300"}
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
            flexShrink={0}
            fontSize={{ base: "lg", md: "xl" }}
          >
            {isCompleted ? <Icon as={FiCheck} boxSize={6} /> : stepNumber}
          </Box>
          <VStack spacing={2} flex={1}>
            <Heading size={{ base: "sm", md: "md" }} color={isActive ? activeColor : "inherit"}>
              {title}
            </Heading>
            <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} lineHeight="base">
              {description}
            </Text>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

const MockReceiptCard = ({ vendor, amount, date, category, isProcessing = false }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Card bg={bgColor} borderColor={borderColor} borderWidth={1} h="100%">
      <CardBody p={{ base: 4, md: 6 }} h="100%">
        <VStack spacing={3} align="start" h="100%">
          <HStack justify="space-between" w="100%">
            <Heading size={{ base: "xs", md: "sm" }} flex={1}>{vendor}</Heading>
            <Badge 
              colorScheme={category === 'Restaurant' ? 'orange' : category === 'Groceries' ? 'green' : 'blue'}
              fontSize={{ base: "xs", md: "sm" }}
            >
              {category}
            </Badge>
          </HStack>
          <HStack justify="space-between" w="100%" flex={1} align="end">
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="green.600">₦{amount}</Text>
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">{date}</Text>
          </HStack>
          {isProcessing && (
            <Box w="100%">
              <Text fontSize="xs" color="blue.600" mb={1}>Processing with AI...</Text>
              <Progress size="sm" colorScheme="blue" isIndeterminate />
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default function DemoPage() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  const mockReceipts = [
    { vendor: "Starbucks Coffee", amount: "12.45", date: "Nov 5, 2024", category: "Restaurant" },
    { vendor: "Whole Foods Market", amount: "87.23", date: "Nov 4, 2024", category: "Groceries" },
    { vendor: "Shell Gas Station", amount: "45.60", date: "Nov 3, 2024", category: "Gas" },
    { vendor: "McDonald's", amount: "8.99", date: "Nov 2, 2024", category: "Restaurant" }
  ];

  const demoSteps = [
    {
      title: "Upload Receipt",
      description: "Take a photo or upload an image of your receipt"
    },
    {
      title: "AI Processing",
      description: "Our OCR technology extracts vendor, amount, date, and category"
    },
    {
      title: "Review & Categorize",
      description: "Verify the extracted information and adjust categories if needed"
    },
    {
      title: "Track & Analyze",
      description: "View your expenses in an organized dashboard with analytics"
    }
  ];

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box bg="white" shadow="sm" borderBottomWidth={1}>
        <Container maxW="7xl" py={4}>
          <HStack spacing={4}>
            <Button
              leftIcon={<Icon as={FiArrowLeft} />}
              variant="ghost"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            <Heading size="lg" color="blue.600">
              📄 Receipt Tracker Demo
            </Heading>
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        <VStack spacing={12} align="stretch">
          {/* Hero Section */}
          <VStack spacing={6} textAlign="center">
            <Heading size={{ base: "lg", md: "xl", lg: "2xl" }}>See How It Works</Heading>
            <Text 
              fontSize={{ base: "md", md: "lg" }} 
              color="gray.600" 
              maxW={{ base: "100%", md: "2xl", lg: "3xl" }} 
              px={{ base: 4, md: 8, lg: 0 }}
            >
              Experience the power of AI-driven receipt processing. Upload a receipt image 
              and watch as our system automatically extracts all the important information.
            </Text>
            
            {/* Mobile Layout */}
            <VStack spacing={3} w="100%" display={{ base: "flex", md: "none" }}>
              <Button 
                colorScheme="blue" 
                size="md"
                leftIcon={<Icon as={FiUpload} />}
                w="100%"
                maxW="300px"
              >
                Try Live Demo
              </Button>
              <HStack spacing={3} w="100%" justify="center">
                <Button 
                  variant="outline" 
                  size="md"
                  onClick={() => navigate('/demo-dashboard')}
                  flex={1}
                  maxW="140px"
                >
                  View Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="md"
                  onClick={() => navigate('/auth')}
                  flex={1}
                  maxW="140px"
                >
                  Sign Up Free
                </Button>
              </HStack>
            </VStack>

            {/* Tablet and Desktop Layout */}
            <HStack spacing={{ base: 3, md: 4 }} display={{ base: "none", md: "flex" }} wrap="wrap" justify="center">
              <Button 
                colorScheme="blue" 
                size="lg"
                leftIcon={<Icon as={FiUpload} />}
              >
                Try Live Demo
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/demo-dashboard')}
              >
                View Dashboard
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                onClick={() => navigate('/auth')}
              >
                Sign Up Free
              </Button>
            </HStack>
          </VStack>

          {/* Demo Steps */}
          <VStack spacing={{ base: 6, md: 8 }}>
            <Heading size={{ base: "lg", md: "xl" }} textAlign="center">How It Works</Heading>
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 4 }} 
              spacing={{ base: 4, md: 6, lg: 8 }} 
              w="100%"
            >
              {demoSteps.map((step, index) => (
                <DemoStep
                  key={index}
                  stepNumber={index + 1}
                  title={step.title}
                  description={step.description}
                  isActive={index === 1}
                  isCompleted={index === 0}
                />
              ))}
            </SimpleGrid>
          </VStack>

          {/* Mock Dashboard Preview */}
          <VStack spacing={8}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl">Your Dashboard Preview</Heading>
              <Text fontSize="lg" color="gray.600">
                Once processed, your receipts appear in an organized dashboard
              </Text>
            </VStack>

            {/* Stats Cards */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Card>
                <CardBody>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color="gray.600">Total Receipts</Text>
                      <Text fontSize="2xl" fontWeight="bold">127</Text>
                      <Text fontSize="xs" color="green.500">+12 this month</Text>
                    </VStack>
                    <Icon as={FiFileText} w={8} h={8} color="blue.500" />
                  </HStack>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color="gray.600">Total Spent</Text>
                      <Text fontSize="2xl" fontWeight="bold">$3,247.89</Text>
                      <Text fontSize="xs" color="red.500">+$284 this month</Text>
                    </VStack>
                    <Icon as={FiDollarSign} w={8} h={8} color="green.500" />
                  </HStack>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color="gray.600">This Month</Text>
                      <Text fontSize="2xl" fontWeight="bold">23</Text>
                      <Text fontSize="xs" color="blue.500">November 2024</Text>
                    </VStack>
                    <Icon as={FiCalendar} w={8} h={8} color="purple.500" />
                  </HStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Recent Receipts */}
            <Box w="100%">
              <Heading size="md" mb={4}>Recent Receipts</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                {mockReceipts.map((receipt, index) => (
                  <MockReceiptCard
                    key={index}
                    vendor={receipt.vendor}
                    amount={receipt.amount}
                    date={receipt.date}
                    category={receipt.category}
                    isProcessing={index === 0}
                  />
                ))}
              </SimpleGrid>
            </Box>
          </VStack>

          {/* CTA Section */}
          <VStack spacing={6} textAlign="center" py={12}>
            <Heading size="xl">Ready to Get Started?</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Join thousands of users who are already tracking their expenses efficiently 
              with our AI-powered receipt processing system.
            </Text>
            <HStack spacing={4}>
              <Button colorScheme="blue" size="lg" onClick={() => navigate('/auth')}>
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/')}>
                Learn More
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}