import { useState, useEffect, useRef } from 'react';
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Progress,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  Select,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Image,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { 
  FiUpload, 
  FiFileText, 
  FiDollarSign, 
  FiCalendar, 
  FiChevronDown,
  FiTrendingUp,
  FiTrendingDown,
  FiMoreVertical,
  FiDownload,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ReceiptUpload from '../components/ReceiptUpload';

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

const CategoryCard = ({ category, amount, percentage, color }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  
  return (
    <Card bg={bgColor}>
      <CardBody>
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Text fontWeight="semibold">{category}</Text>
            <Text fontWeight="bold" color={`${color}.500`}>₦{amount.toLocaleString()}</Text>
          </HStack>
          <Progress value={percentage} colorScheme={color} size="sm" />
          <Text fontSize="xs" color="gray.500">{percentage}% of total spending</Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default function ReceiptsPage() {
  const { user, logout } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const toast = useToast();
  const fileInputRef = useRef();
  const cancelRef = useRef();
  
  // Modal states
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  
  // Component states
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [editData, setEditData] = useState({ vendor: '', category: '', amount: '' });
  
  // Fetch receipts from API
  const fetchReceipts = async () => {
    try {
      setError('');
      const response = await axios.get('/api/receipts');
      const fetchedReceipts = response.data || [];
      setReceipts(fetchedReceipts);
      setFilteredReceipts(fetchedReceipts);
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

  // Calculate statistics
  const calculateStats = () => {
    const totalReceipts = receipts.length;
    const totalSpent = receipts.reduce((sum, receipt) => sum + (receipt.amount || 0), 0);
    const averageSpent = totalReceipts > 0 ? totalSpent / totalReceipts : 0;
    const thisMonthReceipts = receipts.filter(receipt => {
      const receiptDate = new Date(receipt.date);
      const now = new Date();
      return receiptDate.getMonth() === now.getMonth() && receiptDate.getFullYear() === now.getFullYear();
    }).length;

    return { totalReceipts, totalSpent, averageSpent, thisMonthReceipts };
  };

  const getCategoryBreakdown = () => {
    const breakdown = {};
    receipts.forEach(receipt => {
      const category = receipt.category || 'Other';
      breakdown[category] = (breakdown[category] || 0) + (receipt.amount || 0);
    });

    const total = Object.values(breakdown).reduce((sum, amount) => sum + amount, 0);
    const categories = Object.entries(breakdown)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
        color: getCategoryColor(category)
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);

    return categories;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Restaurant': 'orange',
      'Groceries': 'green', 
      'Gas': 'blue',
      'Electronics': 'purple',
      'Shopping': 'pink',
      'Financial': 'teal',
      'Business': 'cyan',
      'Technology': 'indigo'
    };
    return colors[category] || 'gray';
  };
  
  // Functionality handlers
  const handleUploadReceipt = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
      onUploadOpen();
    }
  };
  
  const processUpload = async () => {
    if (!uploadFile) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    
    try {
      console.log('🚀 Starting upload process from ReceiptsPage...');
      
      // Step 1: Upload file
      console.log('📤 Uploading file...');
      const uploadResponse = await axios.post('/api/receipts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('✅ Upload successful:', uploadResponse.data);
      const receiptId = uploadResponse.data.id;
      
      // Step 2: Process OCR
      console.log(`🧠 Processing OCR for receipt ${receiptId}...`);
      const ocrResponse = await axios.post(`/api/receipts/${receiptId}/process`);
      console.log('✅ OCR processing successful:', ocrResponse.data);
      
      toast({
        title: "Receipt uploaded and processed successfully!",
        description: "Your receipt has been processed with AI.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      fetchReceipts(); // Refresh the receipts list
    } catch (error) {
      console.error('❌ Upload/processing error:', error);
      toast({
        title: "Upload failed",
        description: error.response?.data?.detail || "There was an error processing your receipt. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
      onUploadClose();
      setUploadFile(null);
    }
  };
  
  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Vendor,Amount,Date,Category,Status\n"
      + filteredReceipts.map(r => `${r.vendor || ''},${r.amount || 0},${r.date || ''},${r.category || ''},${r.status || 'processed'}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "receipts_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Data exported successfully!",
      description: "Your receipts have been downloaded as CSV.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === 'all') {
      setFilteredReceipts(receipts);
    } else {
      setFilteredReceipts(receipts.filter(r => r.category === newFilter));
    }
  };
  
  const handleViewDetails = (receipt) => {
    setSelectedReceipt(receipt);
    onDetailOpen();
  };
  
  const handleEditReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setEditData({
      vendor: receipt.vendor || '',
      category: receipt.category || '',
      amount: receipt.amount?.toString() || ''
    });
    onEditOpen();
  };
  
  const handleDeleteReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    onDeleteOpen();
  };
  
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/receipts/${selectedReceipt.id}`);
      const updatedReceipts = receipts.filter(r => r.id !== selectedReceipt.id);
      setReceipts(updatedReceipts);
      setFilteredReceipts(updatedReceipts.filter(r => filter === 'all' || r.category === filter));
      onDeleteClose();
      toast({
        title: "Receipt deleted",
        description: "The receipt has been removed from your records.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete receipt. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const saveEdit = async () => {
    try {
      const updatedReceipt = {
        ...selectedReceipt,
        vendor: editData.vendor,
        category: editData.category,
        amount: parseFloat(editData.amount)
      };
      
      await axios.put(`/api/receipts/${selectedReceipt.id}`, updatedReceipt);
      
      const updatedReceipts = receipts.map(r => 
        r.id === selectedReceipt.id ? updatedReceipt : r
      );
      setReceipts(updatedReceipts);
      setFilteredReceipts(updatedReceipts.filter(r => filter === 'all' || r.category === filter));
      onEditClose();
      toast({
        title: "Receipt updated",
        description: "Your changes have been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update receipt. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReceipts();
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading your receipts...</Text>
        </VStack>
      </Box>
    );
  }

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
                    Your Dashboard
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
                <MenuItem onClick={handleExportData}>Export Data</MenuItem>
                <MenuItem onClick={logout}>Sign Out</MenuItem>
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
              {receipts.length > 0 ? `Here's your expense summary` : 'Ready to start tracking your expenses?'}
            </Text>
          </VStack>

          {/* Error Display */}
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
              <Button size="sm" ml="auto" onClick={fetchReceipts} variant="ghost">
                Retry
              </Button>
            </Alert>
          )}

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <StatCard
              label="Total Receipts"
              value={stats.totalReceipts.toString()}
              helpText={stats.totalReceipts > 0 ? "Keep it up!" : "Upload your first receipt"}
              icon={FiFileText}
              colorScheme="blue"
            />
            <StatCard
              label="Total Spent"
              value={`₦${stats.totalSpent.toLocaleString()}`}
              helpText={stats.totalSpent > 0 ? "All time total" : "Start tracking expenses"}
              icon={FiDollarSign}
              colorScheme="green"
            />
            <StatCard
              label="Average per Receipt"
              value={`₦${stats.averageSpent.toLocaleString()}`}
              helpText={stats.totalReceipts > 0 ? "Per transaction" : "Upload receipts to see average"}
              icon={FiTrendingUp}
              colorScheme="purple"
            />
            <StatCard
              label="This Month"
              value={stats.thisMonthReceipts.toString()}
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
                  onClick={handleUploadReceipt}
                  size={{ base: "md", md: "md" }}
                  flex={{ base: "1", sm: "0" }}
                >
                  <Text display={{ base: "block", sm: "none" }}>Upload</Text>
                  <Text display={{ base: "none", sm: "block" }}>Upload Receipt</Text>
                </Button>
                <Button 
                  leftIcon={<Icon as={FiDownload} />} 
                  variant="outline"
                  onClick={handleExportData}
                  isDisabled={receipts.length === 0}
                  size={{ base: "md", md: "md" }}
                  flex={{ base: "1", sm: "0" }}
                >
                  <Text display={{ base: "block", sm: "none" }}>Export</Text>
                  <Text display={{ base: "none", sm: "block" }}>Export Data</Text>
                </Button>
                <Button 
                  leftIcon={<Icon as={FiRefreshCw} />} 
                  variant="outline"
                  onClick={handleRefresh}
                  isLoading={refreshing}
                  size={{ base: "md", md: "md" }}
                  flex={{ base: "1", sm: "0" }}
                >
                  <Text display={{ base: "block", sm: "none" }}>Refresh</Text>
                  <Text display={{ base: "none", sm: "block" }}>Refresh Data</Text>
                </Button>
                <Select 
                  placeholder="Filter category" 
                  w={{ base: "100%", sm: "200px" }}
                  value={filter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  size={{ base: "md", md: "md" }}
                >
                  <option value="all">All Categories</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Gas">Gas</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Financial">Financial</option>
                  <option value="Business">Business</option>
                  <option value="Technology">Technology</option>
                </Select>
              </Flex>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,.pdf"
                style={{ display: 'none' }}
              />
            </CardBody>
          </Card>

          {/* Category Breakdown */}
          {receipts.length > 0 && getCategoryBreakdown().length > 0 && (
            <VStack spacing={6} align="stretch">
              <Heading size={{ base: "md", md: "lg" }}>Spending by Category</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                {getCategoryBreakdown().map((cat, index) => (
                  <CategoryCard
                    key={index}
                    category={cat.category}
                    amount={cat.amount}
                    percentage={cat.percentage}
                    color={cat.color}
                  />
                ))}
              </SimpleGrid>
            </VStack>
          )}

          {/* Recent Receipts */}
          {receipts.length > 0 ? (
            <Card>
              <CardBody>
                <Flex justify="space-between" align="center" mb={4} direction={{ base: "column", sm: "row" }} gap={2}>
                  <Heading size={{ base: "sm", md: "md" }}>
                    {filter === 'all' ? 'All Receipts' : `${filter} Receipts`} ({filteredReceipts.length})
                  </Heading>
                </Flex>
                
                {filteredReceipts.length === 0 ? (
                  <VStack spacing={4} py={8}>
                    <Text color="gray.500">No receipts match your current filter</Text>
                    <Button variant="ghost" onClick={() => handleFilterChange('all')}>
                      Show All Receipts
                    </Button>
                  </VStack>
                ) : (
                  <>
                    {/* Mobile Card Layout */}
                    <VStack spacing={4} display={{ base: "flex", md: "none" }}>
                      {filteredReceipts.map((receipt) => (
                        <Card key={receipt.id} w="100%" variant="outline" size="sm">
                          <CardBody p={4}>
                            <Flex justify="space-between" align="start">
                              <VStack align="start" spacing={2} flex={1}>
                                <HStack justify="space-between" w="100%">
                                  <Text fontWeight="bold" fontSize="md">
                                    {receipt.vendor || 'Unknown Vendor'}
                                  </Text>
                                  <Menu>
                                    <MenuButton
                                      as={Button}
                                      variant="ghost"
                                      size="xs"
                                      icon={<FiMoreVertical />}
                                    >
                                      <Icon as={FiMoreVertical} />
                                    </MenuButton>
                                    <MenuList>
                                      <MenuItem onClick={() => handleViewDetails(receipt)}>
                                        View Details
                                      </MenuItem>
                                      <MenuItem onClick={() => handleEditReceipt(receipt)}>
                                        Edit Receipt
                                      </MenuItem>
                                      <MenuItem 
                                        onClick={() => handleDeleteReceipt(receipt)}
                                        color="red.500"
                                      >
                                        Delete
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </HStack>
                                
                                <HStack justify="space-between" w="100%">
                                  <Badge colorScheme={getCategoryColor(receipt.category)} fontSize="sm">
                                    {receipt.category || 'Other'}
                                  </Badge>
                                  <Text fontSize="sm" color="gray.500">
                                    {receipt.date || 'No date'}
                                  </Text>
                                </HStack>
                                
                                <HStack justify="space-between" w="100%" align="center">
                                  <Text fontSize="lg" fontWeight="bold" color="green.600">
                                    ₦{(receipt.amount || 0).toLocaleString()}
                                  </Text>
                                  {receipt.status === 'processing' ? (
                                    <HStack spacing={2}>
                                      <Progress size="sm" isIndeterminate colorScheme="blue" w="60px" />
                                      <Text fontSize="xs" color="blue.500">Processing</Text>
                                    </HStack>
                                  ) : (
                                    <Badge colorScheme="green" fontSize="xs">Processed</Badge>
                                  )}
                                </HStack>
                              </VStack>
                            </Flex>
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>

                    {/* Desktop Table Layout */}
                    <Box display={{ base: "none", md: "block" }}>
                      <TableContainer>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Vendor</Th>
                              <Th>Category</Th>
                              <Th>Date</Th>
                              <Th isNumeric>Amount</Th>
                              <Th>Status</Th>
                              <Th></Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredReceipts.map((receipt) => (
                              <Tr key={receipt.id}>
                                <Td fontWeight="medium">{receipt.vendor || 'Unknown Vendor'}</Td>
                                <Td>
                                  <Badge colorScheme={getCategoryColor(receipt.category)}>
                                    {receipt.category || 'Other'}
                                  </Badge>
                                </Td>
                                <Td color="gray.600">{receipt.date || 'No date'}</Td>
                                <Td isNumeric fontWeight="bold">₦{(receipt.amount || 0).toLocaleString()}</Td>
                                <Td>
                                  {receipt.status === 'processing' ? (
                                    <HStack spacing={2}>
                                      <Progress size="sm" isIndeterminate colorScheme="blue" w="60px" />
                                      <Text fontSize="sm" color="blue.500">Processing</Text>
                                    </HStack>
                                  ) : (
                                    <Badge colorScheme="green">Processed</Badge>
                                  )}
                                </Td>
                                <Td>
                                  <Menu>
                                    <MenuButton
                                      as={Button}
                                      variant="ghost"
                                      size="sm"
                                      icon={<FiMoreVertical />}
                                    >
                                      <Icon as={FiMoreVertical} />
                                    </MenuButton>
                                    <MenuList>
                                      <MenuItem onClick={() => handleViewDetails(receipt)}>
                                        View Details
                                      </MenuItem>
                                      <MenuItem onClick={() => handleEditReceipt(receipt)}>
                                        Edit Receipt
                                      </MenuItem>
                                      <MenuItem 
                                        onClick={() => handleDeleteReceipt(receipt)}
                                        color="red.500"
                                      >
                                        Delete
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </>
                )}
              </CardBody>
            </Card>
          ) : (
            // Empty State
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
                      onClick={handleUploadReceipt}
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
          )}
        </VStack>
      </Container>

      {/* Upload Receipt Modal */}
      <Modal isOpen={isUploadOpen} onClose={onUploadClose} size={{ base: "full", md: "lg" }}>
        <ModalOverlay />
        <ModalContent m={{ base: 0, md: "auto" }} h={{ base: "100vh", md: "auto" }}>
          <ModalHeader fontSize={{ base: "lg", md: "xl" }}>Upload Receipt</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={{ base: 6, md: 6 }}>
            {uploadFile ? (
              <VStack spacing={4}>
                <Text>Selected file: {uploadFile.name}</Text>
                {uploadFile.type.startsWith('image/') && (
                  <Image 
                    src={URL.createObjectURL(uploadFile)} 
                    maxH="200px" 
                    objectFit="contain"
                    borderRadius="md"
                  />
                )}
                {isUploading ? (
                  <VStack spacing={2}>
                    <Spinner size="lg" color="blue.500" />
                    <Text>Processing receipt with AI...</Text>
                  </VStack>
                ) : (
                  <Text color="gray.600">
                    Click "Process Receipt" to extract information using our AI.
                  </Text>
                )}
              </VStack>
            ) : (
              <Text>No file selected</Text>
            )}
          </ModalBody>
          <ModalFooter flexDirection={{ base: "column", md: "row" }} gap={{ base: 2, md: 0 }}>
            <Button 
              variant="ghost" 
              mr={{ base: 0, md: 3 }} 
              onClick={onUploadClose}
              w={{ base: "100%", md: "auto" }}
              order={{ base: 2, md: 1 }}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={processUpload}
              isLoading={isUploading}
              loadingText="Processing..."
              w={{ base: "100%", md: "auto" }}
              order={{ base: 1, md: 2 }}
            >
              Process Receipt
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Receipt Details Modal */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size={{ base: "full", md: "lg" }}>
        <ModalOverlay />
        <ModalContent m={{ base: 0, md: "auto" }} h={{ base: "100vh", md: "auto" }}>
          <ModalHeader fontSize={{ base: "lg", md: "xl" }}>Receipt Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={{ base: 6, md: 6 }}>
            {selectedReceipt && (
              <VStack spacing={4} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Vendor</FormLabel>
                    <Text fontWeight="semibold">{selectedReceipt.vendor || 'Unknown'}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <Text fontWeight="semibold" color="green.600">
                      ₦{(selectedReceipt.amount || 0).toLocaleString()}
                    </Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Date</FormLabel>
                    <Text>{selectedReceipt.date || 'No date'}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Badge colorScheme={getCategoryColor(selectedReceipt.category)}>
                      {selectedReceipt.category || 'Other'}
                    </Badge>
                  </FormControl>
                </SimpleGrid>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Badge colorScheme={selectedReceipt.status === 'processed' ? 'green' : 'blue'}>
                    {selectedReceipt.status || 'processed'}
                  </Badge>
                </FormControl>
                <Box p={4} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" color="gray.600">
                    Receipt ID: {selectedReceipt.id}
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onDetailClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Receipt Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size={{ base: "full", md: "lg" }}>
        <ModalOverlay />
        <ModalContent m={{ base: 0, md: "auto" }} h={{ base: "100vh", md: "auto" }}>
          <ModalHeader fontSize={{ base: "lg", md: "xl" }}>Edit Receipt</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={{ base: 6, md: 6 }}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Vendor</FormLabel>
                <Input 
                  value={editData.vendor}
                  onChange={(e) => setEditData({...editData, vendor: e.target.value})}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select 
                  value={editData.category}
                  onChange={(e) => setEditData({...editData, category: e.target.value})}
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Gas">Gas</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Financial">Financial</option>
                  <option value="Business">Business</option>
                  <option value="Technology">Technology</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Amount</FormLabel>
                <Input 
                  type="number"
                  step="0.01"
                  value={editData.amount}
                  onChange={(e) => setEditData({...editData, amount: e.target.value})}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter flexDirection={{ base: "column", md: "row" }} gap={{ base: 2, md: 0 }}>
            <Button 
              variant="ghost" 
              mr={{ base: 0, md: 3 }} 
              onClick={onEditClose}
              w={{ base: "100%", md: "auto" }}
              order={{ base: 2, md: 1 }}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={saveEdit}
              w={{ base: "100%", md: "auto" }}
              order={{ base: 1, md: 2 }}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Receipt
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this receipt from {selectedReceipt?.vendor || 'Unknown Vendor'}? 
              This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}