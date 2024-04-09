const crypto = require('crypto');

// Secret key for JWT
// const JWT_SECRET = crypto.randomBytes(64).toString('hex');
const JWT_SECRET = 'my_secret_key_123456789';

//Encode JWT
const encodeToken = (payload, expires = 3600) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  //Encode header and payload
  const headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64');
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');

  //Create signature
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(headerBase64 + '.' + payloadBase64)
    .digest('base64');

  //Return token
  return `${headerBase64}.${payloadBase64}.${signature}`;
}

//Decode JWT
const decodeToken = (token) => {
  const [headerBase64, payloadBase64, signature] = token.split('.');

  //Verify signature
  const expectedSignature = crypto.createHmac('sha256', JWT_SECRET)
    .update(headerBase64 + '.' + payloadBase64)
    .digest('base64');

  if(signature !== expectedSignature) {
    throw new Error('Invalid token signature');
  }

  //Decode payload
  const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());

  //Check expiration
  if(decodedPayload.exp && decodedPayload.exp < Date.now() / 1000) {
    throw new Error('Token expired');
  }

  return decodedPayload;
}

// Export the functions
module.exports = { encodeToken, decodeToken };