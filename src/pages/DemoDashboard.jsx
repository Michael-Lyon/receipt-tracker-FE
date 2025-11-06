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
  Spinner
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUpload, 
  FiFileText, 
  FiDollarSign, 
  FiCalendar, 
  FiArrowLeft, 
  FiChevronDown,
  FiTrendingUp,
  FiTrendingDown,
  FiMoreVertical,
  FiDownload,
  FiFilter
} from 'react-icons/fi';

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
                <Text fontSize="xs" color={trend > 0 ? "green.500" : "red.500"}>
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
            <Text fontWeight="bold" color={`${color}.500`}>₦{amount}</Text>
          </HStack>
          <Progress value={percentage} colorScheme={color} size="sm" />
          <Text fontSize="xs" color="gray.500">{percentage}% of total spending</Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default function DemoDashboard() {
  const navigate = useNavigate();
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
  const [receipts, setReceipts] = useState([
    { id: 1, vendor: "Starbucks Coffee", amount: 5180, date: "2024-11-05", category: "Restaurant", status: "processed" },
    { id: 2, vendor: "Whole Foods Market", amount: 36275, date: "2024-11-04", category: "Groceries", status: "processed" },
    { id: 3, vendor: "Shell Gas Station", amount: 18970, date: "2024-11-03", category: "Gas", status: "processed" },
    { id: 4, vendor: "McDonald's", amount: 3740, date: "2024-11-02", category: "Restaurant", status: "processing" },
    { id: 5, vendor: "Best Buy", amount: 124795, date: "2024-11-01", category: "Electronics", status: "processed" },
    { id: 6, vendor: "Target", amount: 22595, date: "2024-10-31", category: "Shopping", status: "processed" }
  ]);
  
  const [filteredReceipts, setFilteredReceipts] = useState(receipts);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editData, setEditData] = useState({ vendor: '', category: '', amount: '' });
  
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
    setIsUploading(true);
    // Simulate processing
    setTimeout(() => {
      const newReceipt = {
        id: receipts.length + 1,
        vendor: "New Receipt",
        amount: Math.random() * 50000 + 1000,
        date: new Date().toISOString().split('T')[0],
        category: "Restaurant",
        status: "processing"
      };
      setReceipts([newReceipt, ...receipts]);
      setFilteredReceipts([newReceipt, ...filteredReceipts]);
      setIsUploading(false);
      onUploadClose();
      setUploadFile(null);
      toast({
        title: "Receipt uploaded successfully!",
        description: "Processing will complete in a few moments.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };
  
  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Vendor,Amount,Date,Category,Status\n"
      + receipts.map(r => `${r.vendor},${r.amount},${r.date},${r.category},${r.status}`).join("\n");
    
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
      vendor: receipt.vendor,
      category: receipt.category,
      amount: receipt.amount.toString()
    });
    onEditOpen();
  };
  
  const handleDeleteReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    onDeleteOpen();
  };
  
  const confirmDelete = () => {
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
  };
  
  const saveEdit = () => {
    const updatedReceipts = receipts.map(r => 
      r.id === selectedReceipt.id 
        ? { ...r, vendor: editData.vendor, category: editData.category, amount: parseFloat(editData.amount) }
        : r
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
  };

  const categories = [
    { category: "Restaurant", amount: "189,920", percentage: 35, color: "orange" },
    { category: "Groceries", amount: "142,314", percentage: 26, color: "green" },
    { category: "Gas", amount: "82,518", percentage: 15, color: "blue" },
    { category: "Electronics", amount: "124,795", percentage: 24, color: "purple" }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'Restaurant': 'orange',
      'Groceries': 'green', 
      'Gas': 'blue',
      'Electronics': 'purple',
      'Shopping': 'pink'
    };
    return colors[category] || 'gray';
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box bg="white" shadow="sm" borderBottomWidth={1}>
        <Container maxW="7xl" py={4}>
          <Flex direction={{ base: "column", md: "row" }} gap={4} align={{ base: "start", md: "center" }}>
            <HStack spacing={{ base: 2, md: 4 }} flex={1}>
              <Button
                leftIcon={<Icon as={FiArrowLeft} />}
                variant="ghost"
                size={{ base: "sm", md: "md" }}
                onClick={() => navigate('/demo')}
              >
                <Text display={{ base: "none", sm: "block" }}>Back to Demo</Text>
                <Text display={{ base: "block", sm: "none" }}>Back</Text>
              </Button>
              <VStack spacing={1} align="start">
                <HStack spacing={2}>
                  <Heading size={{ base: "md", md: "lg" }} color="blue.600">
                    📄 Receipt Tracker
                  </Heading>
                  <Badge colorScheme="green" variant="subtle" fontSize={{ base: "xs", md: "sm" }}>
                    Demo Dashboard
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
            
            <Menu>
              <MenuButton as={Button} rightIcon={<FiChevronDown />} variant="ghost" size={{ base: "sm", md: "md" }}>
                <HStack spacing={2}>
                  <Avatar size={{ base: "xs", md: "sm" }} name="Demo User" />
                  <Text fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", sm: "block" }}>
                    demo@user.com
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem>Profile Settings</MenuItem>
                <MenuItem>Export Data</MenuItem>
                <MenuItem>Sign Out</MenuItem>
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
            <Heading size="xl">Welcome back, Demo User!</Heading>
            <Text fontSize="lg" color="gray.600">
              Here's your expense summary for November 2024
            </Text>
          </VStack>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <StatCard
              label="Total Receipts"
              value="127"
              helpText="+12 this month"
              icon={FiFileText}
              colorScheme="blue"
              trend={1}
            />
            <StatCard
              label="Total Spent"
              value="₦1,350,557"
              helpText="+₦118,200 this month" 
              icon={FiDollarSign}
              colorScheme="green"
              trend={1}
            />
            <StatCard
              label="Average per Receipt"
              value="₦10,635"
              helpText="-₦895 vs last month"
              icon={FiTrendingDown}
              colorScheme="purple"
              trend={-1}
            />
            <StatCard
              label="This Month"
              value="23"
              helpText="November 2024"
              icon={FiCalendar}
              colorScheme="orange"
            />
          </SimpleGrid>

          {/* Quick Actions */}
          <Card>
            <CardBody>
              <HStack justify="space-between" mb={4}>
                <Heading size="md">Quick Actions</Heading>
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
                  size={{ base: "md", md: "md" }}
                  flex={{ base: "1", sm: "0" }}
                >
                  <Text display={{ base: "block", sm: "none" }}>Export</Text>
                  <Text display={{ base: "none", sm: "block" }}>Export Data</Text>
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
          <VStack spacing={6} align="stretch">
            <Heading size="lg">Spending by Category</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              {categories.map((cat, index) => (
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

          {/* Recent Receipts */}
          <Card>
            <CardBody>
              <Flex justify="space-between" align="center" mb={4} direction={{ base: "column", sm: "row" }} gap={2}>
                <Heading size={{ base: "sm", md: "md" }}>Recent Receipts</Heading>
                <Button size="sm" variant="outline">View All</Button>
              </Flex>
              
              {/* Mobile Card Layout */}
              <VStack spacing={4} display={{ base: "flex", md: "none" }}>
                {filteredReceipts.map((receipt) => (
                  <Card key={receipt.id} w="100%" variant="outline" size="sm">
                    <CardBody p={4}>
                      <Flex justify="space-between" align="start">
                        <VStack align="start" spacing={2} flex={1}>
                          <HStack justify="space-between" w="100%">
                            <Text fontWeight="bold" fontSize="md">
                              {receipt.vendor}
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
                              {receipt.category}
                            </Badge>
                            <Text fontSize="sm" color="gray.500">
                              {receipt.date}
                            </Text>
                          </HStack>
                          
                          <HStack justify="space-between" w="100%" align="center">
                            <Text fontSize="lg" fontWeight="bold" color="green.600">
                              ₦{receipt.amount.toLocaleString()}
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
                          <Td fontWeight="medium">{receipt.vendor}</Td>
                          <Td>
                            <Badge colorScheme={getCategoryColor(receipt.category)}>
                              {receipt.category}
                            </Badge>
                          </Td>
                          <Td color="gray.600">{receipt.date}</Td>
                          <Td isNumeric fontWeight="bold">₦{receipt.amount.toLocaleString()}</Td>
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
            </CardBody>
          </Card>

          {/* Monthly Summary */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Card>
              <CardBody>
                <VStack spacing={4} align="start">
                  <Heading size="md">Monthly Trends</Heading>
                  <Text color="gray.600">
                    Your spending has increased by 8.5% compared to last month, 
                    primarily driven by restaurant and electronics purchases.
                  </Text>
                  <HStack spacing={4}>
                    <VStack spacing={1} align="start">
                      <Text fontSize="sm" color="gray.500">Last Month</Text>
                      <Text fontSize="lg" fontWeight="bold">₦1,244,834</Text>
                    </VStack>
                    <VStack spacing={1} align="start">
                      <Text fontSize="sm" color="gray.500">This Month</Text>
                      <Text fontSize="lg" fontWeight="bold" color="green.600">₦1,350,557</Text>
                    </VStack>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <VStack spacing={4} align="start">
                  <Heading size="md">Insights</Heading>
                  <VStack spacing={3} align="start">
                    <HStack>
                      <Icon as={FiTrendingUp} color="green.500" />
                      <Text fontSize="sm">You've uploaded 40% more receipts this month</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiDollarSign} color="orange.500" />
                      <Text fontSize="sm">Restaurant spending is above your usual average</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiCalendar} color="blue.500" />
                      <Text fontSize="sm">Most expenses occur on weekends</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
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
                    <Text fontWeight="semibold">{selectedReceipt.vendor}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <Text fontWeight="semibold" color="green.600">
                      ₦{selectedReceipt.amount.toLocaleString()}
                    </Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Date</FormLabel>
                    <Text>{selectedReceipt.date}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Badge colorScheme={getCategoryColor(selectedReceipt.category)}>
                      {selectedReceipt.category}
                    </Badge>
                  </FormControl>
                </SimpleGrid>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Badge colorScheme={selectedReceipt.status === 'processed' ? 'green' : 'blue'}>
                    {selectedReceipt.status}
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
              Are you sure you want to delete this receipt from {selectedReceipt?.vendor}? 
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