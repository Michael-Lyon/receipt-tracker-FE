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
  Icon,
  Flex,
  Spacer,
  Progress
} from '@chakra-ui/react';
import { FiChevronDown, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { FiUpload, FiFileText, FiDollarSign, FiCalendar, FiDownload, FiFilter } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ label, value, helpText, icon, colorScheme = "blue", trend }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Card bg={bgColor} borderColor={borderColor} borderWidth={1}>
      <CardBody>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color="gray.600">{label}</Text>
            <Text fontSize="2xl" fontWeight="bold">{value}</Text>
            {helpText && (
              <HStack spacing={1}>
                {trend && (
                  <Icon 
                    as={trend > 0 ? FiTrendingUp : FiTrendingDown} 
                    color={trend > 0 ? "green.500" : "red.500"}
                    size="sm"
                  />
                )}
                <Text fontSize="xs" color={trend > 0 ? "green.500" : trend < 0 ? "red.500" : "gray.500"}>
                  {helpText}
                </Text>
              </HStack>
            )}
          </VStack>
          <Icon as={icon} w={8} h={8} color={`${colorScheme}.500`} />
        </HStack>
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


  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box bg="white" shadow="sm" borderBottomWidth={1}>
        <Container maxW="7xl" py={4}>
          <Flex direction={{ base: "column", md: "row" }} gap={4} align={{ base: "start", md: "center" }}>
            <HStack spacing={{ base: 2, md: 4 }} flex={1}>
              <VStack spacing={1} align="start">
                <HStack spacing={2}>
                  <Heading size={{ base: "md", md: "lg" }} color="blue.600">
                    📄 Receipt Tracker
                  </Heading>
                  <Badge colorScheme="green" variant="subtle" fontSize={{ base: "xs", md: "sm" }}>
                    Dashboard
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
            
            <Menu>
              <MenuButton as={Button} rightIcon={<FiChevronDown />} variant="ghost" size={{ base: "sm", md: "md" }}>
                <HStack spacing={2}>
                  <Avatar size={{ base: "xs", md: "sm" }} name={user?.email} />
                  <Text fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", sm: "block" }}>
                    {user?.email}
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Welcome Section */}
          <VStack spacing={4} align="start">
            <Heading size={{ base: "lg", md: "xl" }}>Welcome back, {user?.email?.split('@')[0]}!</Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
              Ready to track your expenses? Upload your first receipt to get started.
            </Text>
          </VStack>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <StatCard
              label="Total Receipts"
              value="0"
              helpText="No receipts uploaded yet"
              icon={FiFileText}
              colorScheme="blue"
            />
            <StatCard
              label="Total Spent"
              value="$0.00"
              helpText="Awaiting first receipt"
              icon={FiDollarSign}
              colorScheme="green"
            />
            <StatCard
              label="Average per Receipt"
              value="$0.00"
              helpText="Upload receipts to see trends"
              icon={FiTrendingUp}
              colorScheme="purple"
            />
            <StatCard
              label="This Month"
              value="0"
              helpText="November 2024"
              icon={FiCalendar}
              colorScheme="orange"
            />
          </SimpleGrid>

          {/* Quick Actions */}
          <Card>
            <CardBody>
              <HStack justify="space-between" mb={4}>
                <Heading size={{ base: "sm", md: "md" }}>Quick Actions</Heading>
              </HStack>
              <Flex 
                direction={{ base: "column", sm: "row" }} 
                gap={4} 
                wrap="wrap"
                align={{ base: "stretch", sm: "center" }}
              >
                <Button 
                  leftIcon={<Icon as={FiUpload} />} 
                  colorScheme="blue"
                  size={{ base: "md", md: "md" }}
                  flex={{ base: "1", sm: "0" }}
                >
                  <Text display={{ base: "block", sm: "none" }}>Upload</Text>
                  <Text display={{ base: "none", sm: "block" }}>Upload Receipt</Text>
                </Button>
                <Button 
                  leftIcon={<Icon as={FiDownload} />} 
                  variant="outline"
                  size={{ base: "md", md: "md" }}
                  flex={{ base: "1", sm: "0" }}
                  isDisabled
                >
                  <Text display={{ base: "block", sm: "none" }}>Export</Text>
                  <Text display={{ base: "none", sm: "block" }}>Export Data</Text>
                </Button>
                <Button 
                  leftIcon={<Icon as={FiFilter} />} 
                  variant="ghost"
                  size={{ base: "md", md: "md" }}
                  flex={{ base: "1", sm: "0" }}
                  isDisabled
                >
                  <Text display={{ base: "block", sm: "none" }}>Filter</Text>
                  <Text display={{ base: "none", sm: "block" }}>Filter Categories</Text>
                </Button>
              </Flex>
            </CardBody>
          </Card>

          {/* Getting Started Guide */}
          <Card>
            <CardBody>
              <VStack spacing={6} py={{ base: 8, md: 12 }} textAlign="center">
                <Icon as={FiFileText} w={{ base: 12, md: 16 }} h={{ base: 12, md: 16 }} color="gray.400" />
                <VStack spacing={2}>
                  <Heading size={{ base: "sm", md: "md" }} color="gray.600">Ready to Start Tracking?</Heading>
                  <Text color="gray.500" maxW="md" fontSize={{ base: "sm", md: "md" }}>
                    Upload your first receipt to see your expense tracking in action. 
                    Our AI will process it and extract all the important details automatically.
                  </Text>
                </VStack>
                <VStack spacing={3} w="100%" maxW="400px">
                  <Button 
                    colorScheme="blue" 
                    leftIcon={<Icon as={FiUpload} />}
                    size={{ base: "md", md: "lg" }}
                    w="100%"
                  >
                    Upload Your First Receipt
                  </Button>
                  <Text fontSize="xs" color="gray.400">
                    Supports JPEG, PNG, and PDF files
                  </Text>
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Monthly Summary */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Card>
              <CardBody>
                <VStack spacing={4} align="start">
                  <Heading size={{ base: "sm", md: "md" }}>Recent Activity</Heading>
                  <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                    Your recent receipt uploads and processing results will appear here.
                  </Text>
                  <VStack spacing={2} align="start" w="100%">
                    <HStack>
                      <Progress value={0} colorScheme="blue" size="sm" w="60px" />
                      <Text fontSize="xs" color="gray.400">No uploads yet</Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.400">
                      Upload your first receipt to see activity tracking!
                    </Text>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <VStack spacing={4} align="start">
                  <Heading size={{ base: "sm", md: "md" }}>Smart Features</Heading>
                  <VStack spacing={3} align="start">
                    <HStack>
                      <Icon as={FiUpload} color="blue.500" boxSize={4} />
                      <Text fontSize="sm">AI-powered OCR extraction</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiDollarSign} color="green.500" boxSize={4} />
                      <Text fontSize="sm">Automatic expense categorization</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiCalendar} color="purple.500" boxSize={4} />
                      <Text fontSize="sm">Monthly spending insights</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}