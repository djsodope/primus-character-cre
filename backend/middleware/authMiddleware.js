const admin = require('../config/firebase');

/**
 * Authentication middleware to verify Firebase ID tokens
 * Adds the decoded user information to req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header'
      });
    }

    // Extract the token
    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing ID token'
      });
    }

    // Verify the token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Add user information to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name || null,
      picture: decodedToken.picture || null
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Handle specific Firebase errors
    let message = 'Invalid or expired token';
    if (error.code === 'auth/id-token-expired') {
      message = 'Token has expired';
    } else if (error.code === 'auth/id-token-revoked') {
      message = 'Token has been revoked';
    } else if (error.code === 'auth/invalid-id-token') {
      message = 'Invalid token format';
    }

    return res.status(401).json({
      error: 'Unauthorized',
      message
    });
  }
};

module.exports = authMiddleware;