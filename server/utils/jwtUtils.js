const crypto = require('crypto');

// Secret key for JWT
// const JWT_SECRET = crypto.randomBytes(64).toString('hex');
const JWT_SECRET = 'my_secret_key_123456789';

// Function to encode a string using base64url encoding
const base64url = (str) => {
  return str
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

//Encode JWT
const encodeToken = (payload, expiresIn = 3600) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  //Calculate expiration date
  const expiryDate = new Date();
  expiryDate.setSeconds(expiryDate.getSeconds() + expiresIn);

  //Add expiration date to payload and convert it into seconds
  payload.exp = Math.floor(expiryDate / 1000);

  //Encode header and payload
  const headerBase64 = base64url(Buffer.from(JSON.stringify(header)).toString('base64'));
  const payloadBase64 = base64url(Buffer.from(JSON.stringify(payload)).toString('base64'));

  //Create signature
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(headerBase64 + '.' + payloadBase64)
    .digest('base64');

  // Encode signature using base64url encoding
  const encodedSignature = base64url(signature);

  //Return token
  return `${headerBase64}.${payloadBase64}.${encodedSignature}`;
}

//Decode JWT
const decodeToken = (token) => {
  const [headerBase64, payloadBase64, signature] = token.split('.');

  //Verify signature
  const expectedSignature = crypto.createHmac('sha256', JWT_SECRET)
    .update(headerBase64 + '.' + payloadBase64)
    .digest('base64');

  if(signature !== base64url(expectedSignature)) {
    throw new Error('Invalid token signature');
  }

  //Decode payload
  const decodedPayload = JSON.parse(Buffer.from(base64url(payloadBase64), 'base64').toString());

  //Check expiration
  if(decodedPayload.exp && decodedPayload.exp < Date.now() / 1000) {
    throw new Error('Token expired');
  }

  return decodedPayload;
}

// Export the functions
module.exports = { encodeToken, decodeToken };