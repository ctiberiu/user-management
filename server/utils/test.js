const { encodeToken, decodeToken } = require('./jwtUtils');

// Test encodeToken function
console.log('Encoding token...');
const payload = { userId: '123456789', username: 'example_user' };
const token = encodeToken(payload);
console.log('Token:', token);

// Test decodeToken function
console.log('\nDecoding token...');
try {
  const decodedPayload = decodeToken(token);
  console.log('Decoded payload:', decodedPayload);
} catch (error) {
  console.error('Error decoding token:', error.message);
}
