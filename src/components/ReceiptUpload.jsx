import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Progress,
  HStack,
  Icon
} from '@chakra-ui/react';
import { FiUpload, FiCheck } from 'react-icons/fi';
import axios from 'axios';

export default function ReceiptUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setSuccess('');
    
    if (selectedFile) {
      // Validate file type - check both MIME type and file extension
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
      const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
      
      const validType = allowedTypes.includes(selectedFile.type) || allowedExtensions.includes(fileExtension);
      
      if (!validType) {
        setError('Please select a valid image file (JPEG, PNG) or PDF document');
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await axios.post('/api/receipts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const receiptId = uploadResponse.data.id;
      setUploading(false);
      setProcessing(true);

      // Process OCR
      const ocrResponse = await axios.post(`/api/receipts/${receiptId}/process`);
      
      setProcessing(false);
      setSuccess('Receipt uploaded and processed successfully!');
      setFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(ocrResponse.data);
      }

    } catch (error) {
      setUploading(false);
      setProcessing(false);
      setError(error.response?.data?.detail || 'Upload failed. Please try again.');
    }
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" bg="gray.50">
      <VStack spacing={4}>
        <VStack spacing={3}>
          <HStack>
            <Icon as={FiUpload} color="blue.500" />
            <Text fontWeight="bold" color="blue.500">
              Upload Receipt
            </Text>
          </HStack>
          
          <Box p={3} bg="blue.50" borderRadius="md" borderWidth="1px" borderColor="blue.200" w="100%">
            <Text fontSize="sm" color="blue.700" textAlign="center">
              <strong>Tips for better results:</strong>
              <br />
              • Upload clear, well-lit images or PDF files
              <br />
              • Ensure all text is readable and not blurry
              <br />
              • Keep receipt flat without creases or folds
              <br />
              • Supported formats: JPEG, PNG, PDF (max 10MB)
            </Text>
          </Box>
        </VStack>

        <Input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          p={1}
          height="auto"
        />

        {file && (
          <Text fontSize="sm" color="gray.600">
            📄 {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </Text>
        )}

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {success && (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            {success}
          </Alert>
        )}

        {(uploading || processing) && (
          <Box w="100%">
            <Text fontSize="sm" mb={2}>
              {uploading ? 'Uploading...' : 'Processing with AI...'}
            </Text>
            <Progress
              colorScheme="blue"
              isIndeterminate
              borderRadius="md"
            />
          </Box>
        )}

        <Button
          colorScheme="blue"
          onClick={handleUpload}
          isDisabled={!file || uploading || processing}
          isLoading={uploading || processing}
          loadingText={uploading ? 'Uploading...' : 'Processing...'}
          leftIcon={<FiUpload />}
          w="100%"
        >
          Upload & Process Receipt
        </Button>
      </VStack>
    </Box>
  );
}