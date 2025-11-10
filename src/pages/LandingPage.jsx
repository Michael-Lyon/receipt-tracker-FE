import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiEye, FiBarChart, FiShield } from 'react-icons/fi';

const FeatureCard = ({ icon, title, description }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={6}
      bg={bgColor}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="lg"
      shadow="sm"
      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
    >
      <VStack spacing={4} align="start">
        <Icon as={icon} w={8} h={8} color="blue.500" />
        <Heading size="md">{title}</Heading>
        <Text color="gray.600">{description}</Text>
      </VStack>
    </Box>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.50, purple.50)',
    'linear(to-r, gray.900, gray.800)'
  );

  const features = [
    {
      icon: FiUpload,
      title: "Smart Upload",
      description: "Simply upload receipt images and let AI extract all the important information automatically."
    },
    {
      icon: FiEye,
      title: "AI-Powered OCR",
      description: "Advanced optical character recognition extracts vendor, amount, date, and category from any receipt."
    },
    {
      icon: FiBarChart,
      title: "Expense Tracking",
      description: "View, filter, and manage all your expenses in one organized dashboard."
    },
    {
      icon: FiShield,
      title: "Secure & Private",
      description: "Your financial data is protected with enterprise-grade security and encryption."
    }
  ];

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      {/* Header */}
      <Container maxW="7xl" py={4}>
        <HStack justify="space-between" align="center">
          <HStack spacing={3}>
            <Heading size="lg" color="blue.600">
              📄 Receipt Tracker
            </Heading>
            <Badge colorScheme="green" variant="subtle">
              AI-Powered
            </Badge>
          </HStack>
          <HStack spacing={3} display={{ base: "none", md: "flex" }}>
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button colorScheme="blue" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </HStack>
          
          {/* Mobile menu button */}
          <HStack spacing={2} display={{ base: "flex", md: "none" }}>
            <Button size="sm" colorScheme="blue" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </HStack>
        </HStack>
      </Container>

      {/* Hero Section */}
      <Container maxW="6xl" py={{ base: 10, md: 20 }}>
        <VStack spacing={8} textAlign="center">
          <Heading
            size={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            lineHeight="shorter"
            maxW="4xl"
          >
            Transform Your Receipt Management with{' '}
            <Text as="span" color="blue.500">
              AI-Powered Intelligence
            </Text>
          </Heading>
          
          <Text fontSize="xl" color="gray.600" maxW="2xl">
            Upload receipt images and automatically extract vendor information, amounts, 
            dates, and categories. Built for Toplorgical Nigeria Ltd with cutting-edge 
            OCR technology.
          </Text>

          <VStack spacing={4} w="100%" maxW={{ base: "100%", md: "auto" }}>
            <HStack spacing={4} wrap="wrap" justify="center" w="100%">
              <Button
                size={{ base: "md", md: "lg" }}
                colorScheme="blue"
                px={{ base: 6, md: 8 }}
                onClick={() => navigate('/auth')}
                w={{ base: "100%", sm: "auto" }}
                maxW={{ base: "300px", sm: "auto" }}
              >
                Start Tracking Receipts
              </Button>
              <Button
                size={{ base: "md", md: "lg" }}
                variant="outline"
                colorScheme="blue"
                px={{ base: 6, md: 8 }}
                onClick={() => navigate('/demo')}
                w={{ base: "100%", sm: "auto" }}
                maxW={{ base: "300px", sm: "auto" }}
              >
                View Demo
              </Button>
            </HStack>
            
            {/* Demo Dashboard Direct Access */}
            <Button
              size={{ base: "sm", md: "md" }}
              variant="ghost"
              colorScheme="blue"
              onClick={() => navigate('/demo-dashboard')}
              w={{ base: "100%", sm: "auto" }}
              maxW={{ base: "250px", sm: "auto" }}
            >
              🔍 Try Interactive Dashboard
            </Button>
          </VStack>
        </VStack>
      </Container>

      {/* Features Section */}
      <Container maxW="6xl" py={{ base: 10, md: 20 }}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl">Powerful Features</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Everything you need to manage your business expenses efficiently
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Container maxW="4xl" py={{ base: 10, md: 20 }}>
        <Box
          bg="blue.600"
          color="white"
          p={12}
          borderRadius="xl"
          textAlign="center"
        >
          <VStack spacing={6}>
            <Heading size="lg">Ready to Get Started?</Heading>
            <Text fontSize="lg" opacity={0.9}>
              Join thousands of businesses already using AI to streamline their expense tracking
            </Text>
            <Button
              size="lg"
              bg="white"
              color="blue.600"
              px={8}
              _hover={{ bg: 'gray.100' }}
              onClick={() => navigate('/auth')}
            >
              Create Your Account
            </Button>
          </VStack>
        </Box>
      </Container>

      {/* Footer */}
      <Container maxW="7xl" py={8} borderTopWidth={1}>
        <HStack justify="space-between" align="center">
          <Text color="gray.600">
            © 2024 Receipt Tracker. Built for Toplorgical Nigeria Ltd.
          </Text>
          <HStack spacing={6}>
            <Text color="gray.500" fontSize="sm">Privacy</Text>
            <Text color="gray.500" fontSize="sm">Terms</Text>
            <Text color="gray.500" fontSize="sm">Support</Text>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}