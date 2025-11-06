import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Icon
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { FiUpload, FiFileText, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ label, value, helpText, icon, colorScheme = "blue" }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Card bg={bgColor} borderColor={borderColor} borderWidth={1}>
      <CardBody>
        <Stat>
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={1}>
              <StatLabel fontSize="sm" color="gray.600">{label}</StatLabel>
              <StatNumber fontSize="2xl">{value}</StatNumber>
              {helpText && <StatHelpText fontSize="xs">{helpText}</StatHelpText>}
            </VStack>
            <Icon as={icon} w={8} h={8} color={`${colorScheme}.500`} />
          </HStack>
        </Stat>
      </CardBody>
    </Card>
  );
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mock data for demonstration
  const stats = [
    {
      label: "Total Receipts",
      value: "0",
      helpText: "No receipts uploaded yet",
      icon: FiFileText,
      colorScheme: "blue"
    },
    {
      label: "Total Amount",
      value: "$0.00",
      helpText: "Awaiting first receipt",
      icon: FiDollarSign,
      colorScheme: "green"
    },
    {
      label: "This Month",
      value: "0",
      helpText: "November 2024",
      icon: FiCalendar,
      colorScheme: "purple"
    }
  ];

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box bg="white" shadow="sm" borderBottomWidth={1}>
        <Container maxW="7xl" py={4}>
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Heading size="lg" color="blue.600">
                📄 Receipt Tracker
              </Heading>
              <Badge colorScheme="green" variant="subtle">
                Dashboard
              </Badge>
            </HStack>
            
            <Menu>
              <MenuButton as={Button} rightIcon={<FiChevronDown />} variant="ghost">
                <HStack spacing={2}>
                  <Avatar size="sm" name={user?.email} />
                  <Text fontSize="sm">{user?.email}</Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Welcome Section */}
          <VStack spacing={4} textAlign="center">
            <Heading size="xl">Welcome to Your Dashboard!</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Start by uploading your first receipt. Our AI will automatically extract 
              vendor information, amounts, dates, and categories for you.
            </Text>
            <Button
              size="lg"
              colorScheme="blue"
              leftIcon={<Icon as={FiUpload} />}
              px={8}
            >
              Upload Your First Receipt
            </Button>
          </VStack>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                label={stat.label}
                value={stat.value}
                helpText={stat.helpText}
                icon={stat.icon}
                colorScheme={stat.colorScheme}
              />
            ))}
          </SimpleGrid>

          {/* Empty State */}
          <Card>
            <CardBody>
              <VStack spacing={6} py={12} textAlign="center">
                <Icon as={FiFileText} w={16} h={16} color="gray.400" />
                <VStack spacing={2}>
                  <Heading size="md" color="gray.600">No Receipts Yet</Heading>
                  <Text color="gray.500" maxW="md">
                    Upload your first receipt to see your expense tracking in action. 
                    Our AI will process it and extract all the important details automatically.
                  </Text>
                </VStack>
                <Button colorScheme="blue" leftIcon={<Icon as={FiUpload} />}>
                  Upload Receipt
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Card>
              <CardBody>
                <VStack spacing={4} align="start">
                  <Heading size="md">Recent Activity</Heading>
                  <Text color="gray.600">
                    Your recent receipt uploads and processing results will appear here.
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    No activity yet - upload your first receipt to get started!
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <VStack spacing={4} align="start">
                  <Heading size="md">Expense Categories</Heading>
                  <Text color="gray.600">
                    View your spending breakdown by category once you upload receipts.
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Categories will be automatically detected: Restaurant, Groceries, Gas, etc.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}