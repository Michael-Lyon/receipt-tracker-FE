import { useState } from 'react';
import {
  Box,
  Text,
  Badge,
  VStack,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useColorModeValue,
  Icon
} from '@chakra-ui/react';
import { FiEdit3, FiTrash2, FiCalendar, FiDollarSign } from 'react-icons/fi';
import axios from 'axios';

export default function ReceiptCard({ receipt, onUpdate, onDelete }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  const [editing, setEditing] = useState({
    vendor: receipt.vendor || '',
    amount: receipt.amount || '',
    date: receipt.date || '',
    category: receipt.category || ''
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/receipts/${receipt.id}`, editing);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update receipt:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/receipts/${receipt.id}`);
      onDelete(receipt.id);
      onDeleteClose();
    } catch (error) {
      console.error('Failed to delete receipt:', error);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    if (!amount) return '₦0.00';
    return `₦${parseFloat(amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      financial: 'blue',
      electronics: 'purple',
      business: 'teal',
      groceries: 'green',
      restaurant: 'orange',
      fuel: 'red',
      retail: 'purple',
      pharmacy: 'pink',
      transportation: 'teal',
      utilities: 'gray',
      education: 'cyan',
      technology: 'blue',
      other: 'gray'
    };
    return colors[category] || 'gray';
  };

  return (
    <>
      <Box
        p={4}
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        cursor="pointer"
        onClick={onOpen}
        _hover={{ shadow: 'md', borderColor: 'blue.300' }}
        transition="all 0.2s"
      >
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" w="100%">
            <VStack align="start" spacing={1} flex="1">
              <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                {receipt.vendor || 'Unknown Vendor'}
              </Text>
              {receipt.line_items && receipt.line_items.length > 0 && (
                <Text fontSize="xs" color="gray.500">
                  {receipt.line_items.length} items
                </Text>
              )}
            </VStack>
            <Badge
              colorScheme={getCategoryColor(receipt.category)}
              variant="subtle"
              borderRadius="full"
            >
              {receipt.category || 'other'}
            </Badge>
          </HStack>

          <HStack>
            <Icon as={FiDollarSign} color="green.500" />
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              {formatAmount(receipt.amount)}
            </Text>
          </HStack>

          <HStack>
            <Icon as={FiCalendar} color="gray.500" />
            <Text fontSize="sm" color="gray.500">
              {formatDate(receipt.created_at)}
            </Text>
          </HStack>
        </VStack>
      </Box>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Receipt</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Vendor</FormLabel>
                <Input
                  value={editing.vendor}
                  onChange={(e) => setEditing({ ...editing, vendor: e.target.value })}
                  placeholder="Enter vendor name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Amount</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  value={editing.amount}
                  onChange={(e) => setEditing({ ...editing, amount: parseFloat(e.target.value) || '' })}
                  placeholder="Enter amount"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Date</FormLabel>
                <Input
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  placeholder="Enter date"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  placeholder="Select category"
                >
                  <option value="financial">Financial/Banking</option>
                  <option value="electronics">Electronics</option>
                  <option value="business">Business Services</option>
                  <option value="groceries">Groceries</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="fuel">Fuel/Petrol</option>
                  <option value="retail">Retail</option>
                  <option value="pharmacy">Pharmacy/Medical</option>
                  <option value="transportation">Transportation</option>
                  <option value="utilities">Utilities</option>
                  <option value="education">Education</option>
                  <option value="technology">Technology/Hosting</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>

              {receipt.line_items && receipt.line_items.length > 0 && (
                <FormControl>
                  <FormLabel>Line Items</FormLabel>
                  <Box border="1px" borderColor="gray.200" borderRadius="md" overflow="hidden">
                    <Box bg="gray.50" px={3} py={2} borderBottom="1px" borderColor="gray.200">
                      <HStack spacing={4} fontSize="sm" fontWeight="medium" color="gray.600">
                        <Text flex="1">Item</Text>
                        <Text width="60px" textAlign="center">Qty</Text>
                        <Text width="80px" textAlign="right">Price</Text>
                      </HStack>
                    </Box>
                    <VStack spacing={0} align="stretch">
                      {receipt.line_items.map((item, index) => (
                        <Box key={index} px={3} py={2} borderBottom={index < receipt.line_items.length - 1 ? "1px" : "none"} borderColor="gray.100">
                          <HStack spacing={4} fontSize="sm">
                            <Text flex="1" noOfLines={1}>{item.name}</Text>
                            <Text width="60px" textAlign="center">{item.quantity}</Text>
                            <Text width="80px" textAlign="right" fontWeight="medium">
                              ₦{parseFloat(item.total_price).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </FormControl>
              )}

              {receipt.raw_text && (
                <FormControl>
                  <FormLabel>Raw OCR Text</FormLabel>
                  <Text
                    fontSize="sm"
                    p={3}
                    bg="gray.50"
                    borderRadius="md"
                    whiteSpace="pre-wrap"
                    maxH="100px"
                    overflowY="auto"
                  >
                    {receipt.raw_text}
                  </Text>
                </FormControl>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={2}>
              <Button
                leftIcon={<FiTrash2 />}
                colorScheme="red"
                variant="ghost"
                onClick={onDeleteOpen}
              >
                Delete
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                leftIcon={<FiEdit3 />}
                colorScheme="blue"
                onClick={handleSave}
                isLoading={saving}
              >
                Save Changes
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Receipt
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this receipt? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={deleting}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}