import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Link,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          setSuccess('Login successful! Redirecting to dashboard...');
          setTimeout(() => navigate('/receipts'), 1500);
        } else {
          setError(result.error);
        }
      } else {
        const result = await register(email, password);
        if (result.success) {
          setSuccess('Account created successfully! Please sign in.');
          setIsLogin(true);
          setEmail('');
          setPassword('');
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
  };

  return (
    <Container maxW="lg" py={20}>
      <Box
        bg={bgColor}
        p={8}
        borderRadius="xl"
        borderWidth={1}
        borderColor={borderColor}
        shadow="lg"
      >
        <VStack spacing={6}>
          {/* Header */}
          <VStack spacing={2} textAlign="center">
            <Heading size="lg" color="blue.600">
              📄 Receipt Tracker
            </Heading>
            <Heading size="md">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </Heading>
            <Text color="gray.600">
              {isLogin 
                ? 'Sign in to access your receipt dashboard' 
                : 'Join thousands using AI for expense tracking'
              }
            </Text>
          </VStack>

          {/* Error/Success Messages */}
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

          {/* Form */}
          <Box as="form" onSubmit={handleSubmit} w="100%">
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    />
                  </InputRightElement>
                </InputGroup>
                {!isLogin && (
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Must be at least 6 characters long
                  </Text>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="100%"
                isLoading={loading}
                loadingText={isLogin ? 'Signing In...' : 'Creating Account...'}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </VStack>
          </Box>

          {/* Toggle Mode */}
          <Text textAlign="center" color="gray.600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              color="blue.500"
              fontWeight="semibold"
              onClick={toggleMode}
              cursor="pointer"
              _hover={{ textDecoration: 'underline' }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </Text>

          {/* Back to Home */}
          <Link
            color="blue.500"
            fontSize="sm"
            onClick={() => navigate('/')}
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
          >
            ← Back to Home
          </Link>
        </VStack>
      </Box>
    </Container>
  );
}