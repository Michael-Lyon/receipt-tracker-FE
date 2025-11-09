import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Text,
  VStack,
  HStack,
  Icon,
  Alert,
  AlertIcon,
  Flex,
  Spacer,
  Select,
  Input,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { FiUpload, FiLogOut, FiUser, FiRefreshCw, FiSearch, FiDownload } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ReceiptUpload from '../components/ReceiptUpload';
import ReceiptCard from '../components/ReceiptCard';
import ExpenseChart from '../components/ExpenseChart';

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();

  const fetchReceipts = async () => {
    try {
      setError('');
      const response = await axios.get('/api/receipts');
      setReceipts(response.data);
    } catch (error) {
      setError('Failed to fetch receipts. Please try again.');
      console.error('Failed to fetch receipts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleUploadSuccess = () => {
    onClose();
    fetchReceipts();
  };

  const handleReceiptUpdate = () => {
    fetchReceipts();
  };

  const handleReceiptDelete = (receiptId) => {
    setReceipts(receipts.filter(receipt => receipt.id !== receiptId));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReceipts();
  };

  const calculateTotal = () => {
    return getFilteredReceipts().reduce((sum, receipt) => sum + (receipt.amount || 0), 0);
  };

  const getCategoryBreakdown = () => {
    const breakdown = {};
    getFilteredReceipts().forEach(receipt => {
      const category = receipt.category || 'other';
      breakdown[category] = (breakdown[category] || 0) + (receipt.amount || 0);
    });
    return Object.entries(breakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3); // Top 3 categories
  };

  const formatNaira = (amount) => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getFilteredReceipts = () => {
    return receipts.filter(receipt => {
      const matchesCategory = !filterCategory || receipt.category === filterCategory;
      const matchesSearch = !searchQuery || 
        (receipt.vendor && receipt.vendor.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  };

  const exportToCSV = () => {
    const filteredReceipts = getFilteredReceipts();
    const csvHeaders = ['Vendor', 'Amount', 'Date', 'Category'];
    const csvData = filteredReceipts.map(receipt => [
      receipt.vendor || 'Unknown',
      receipt.amount || 0,
      receipt.date || '',
      receipt.category || 'other'
    ]);
    
    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'receipts.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading your receipts...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Flex align="center">
          <VStack align="start" spacing={1}>
            <Heading color="blue.600">Receipt Tracker</Heading>
            <Text color="gray.600">
              Welcome back, {user?.email}! You have {receipts.length} receipts.
            </Text>
          </VStack>
          <Spacer />
          <HStack spacing={3}>
            <Button
              leftIcon={<FiDownload />}
              variant="ghost"
              onClick={exportToCSV}
              isDisabled={receipts.length === 0}
            >
              Export CSV
            </Button>
            <Button
              leftIcon={<FiRefreshCw />}
              variant="ghost"
              onClick={handleRefresh}
              isLoading={refreshing}
            >
              Refresh
            </Button>
            <Button
              leftIcon={<FiUpload />}
              colorScheme="blue"
              onClick={onOpen}
            >
              Upload Receipt
            </Button>
            <Button
              leftIcon={<FiLogOut />}
              variant="ghost"
              onClick={logout}
            >
              Logout
            </Button>
          </HStack>
        </Flex>

        {/* Summary & Insights */}
        {receipts.length > 0 && (
          <Box p={6} bg="blue.50" borderRadius="lg" borderWidth="1px" borderColor="blue.200">
            <HStack spacing={8}>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="blue.600" fontWeight="medium">
                  Total Expenses
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="blue.800">
                  {formatNaira(calculateTotal())}
                </Text>
              </VStack>
              
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="blue.600" fontWeight="medium">
                  Receipts Shown
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="blue.800">
                  {getFilteredReceipts().length} of {receipts.length}
                </Text>
              </VStack>
              
              <Spacer />
              
              {getCategoryBreakdown().length > 0 && (
                <VStack align="end" spacing={2}>
                  <Text fontSize="sm" color="blue.600" fontWeight="medium">
                    Top Spending Categories
                  </Text>
                  {getCategoryBreakdown().map(([category, amount]) => (
                    <HStack key={category} spacing={2}>
                      <Text fontSize="sm" color="blue.700" textTransform="capitalize">
                        {category}:
                      </Text>
                      <Text fontSize="sm" fontWeight="medium" color="blue.800">
                        {formatNaira(amount)}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              )}
            </HStack>
          </Box>
        )}

        {/* Expense Chart */}
        {receipts.length > 0 && (
          <Box p={6} bg="gray.50" borderRadius="lg" borderWidth="1px" borderColor="gray.200">
            <ExpenseChart receipts={getFilteredReceipts()} type="pie" />
          </Box>
        )}

        {/* Filter Controls */}
        {receipts.length > 0 && (
          <HStack spacing={4} align="end">
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Search Vendor</Text>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by vendor name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Filter by Category</Text>
              <Select
                placeholder="All categories"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                width="200px"
              >
                <option value="financial">Financial</option>
                <option value="electronics">Electronics</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="groceries">Groceries</option>
                <option value="restaurant">Restaurant</option>
                <option value="fuel">Fuel</option>
                <option value="retail">Retail</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="transportation">Transportation</option>
                <option value="utilities">Utilities</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </Select>
            </Box>
          </HStack>
        )}

        {/* Error Display */}
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
            <Button size="sm" ml="auto" onClick={fetchReceipts}>
              Retry
            </Button>
          </Alert>
        )}

        {/* Receipts Grid */}
        {receipts.length === 0 ? (
          <VStack spacing={6} py={12}>
            <Icon as={FiUpload} boxSize={16} color="gray.400" />
            <VStack spacing={2}>
              <Heading size="md" color="gray.600">
                No receipts yet
              </Heading>
              <Text color="gray.500" textAlign="center">
                Upload your first receipt to get started with AI-powered expense tracking
              </Text>
            </VStack>
            <Button
              leftIcon={<FiUpload />}
              colorScheme="blue"
              size="lg"
              onClick={onOpen}
            >
              Upload Your First Receipt
            </Button>
          </VStack>
        ) : (
          <>
            {getFilteredReceipts().length === 0 ? (
              <VStack spacing={4} py={8}>
                <Text color="gray.500">No receipts match your filters</Text>
                <Button variant="ghost" onClick={() => {setFilterCategory(''); setSearchQuery('');}}>
                  Clear Filters
                </Button>
              </VStack>
            ) : (
              <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                {getFilteredReceipts().map(receipt => (
                  <ReceiptCard
                    key={receipt.id}
                    receipt={receipt}
                    onUpdate={handleReceiptUpdate}
                    onDelete={handleReceiptDelete}
                  />
                ))}
              </SimpleGrid>
            )}
          </>
        )}

        {/* Upload Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Upload Receipt</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <ReceiptUpload onUploadSuccess={handleUploadSuccess} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}