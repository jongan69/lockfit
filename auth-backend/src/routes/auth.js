import express from 'express';
import jwt from 'jsonwebtoken';
import bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js';
import * as User from '../models/User';
import crypto from 'crypto';
import nacl from 'tweetnacl';
import { Buffer } from 'buffer';

const router = express.Router();

// Initialize Solana connection
// const connection = new Connection('https://api.mainnet-beta.solana.com');

/// ----- Request Nonce ----- ///
router.post('/request_nonce', async (req, res) => {
  console.log("Received request for nonce:", req.body);
  const { publicKey } = req.body;

  if (!publicKey) {
    console.error('Request body:', req.body);
    return res.status(400).json({ error: 'Public key is required' });
  }

  try {
    let user = await User.findOne({ publicKey });

    if (!user) {
      user = new User({ publicKey });
      console.log("Creating new user for public key:", publicKey);
    } else {
      console.log("Found existing user for public key:", publicKey);
    }

    user.nonce = crypto.randomBytes(32).toString('hex');
    await user.save();

    console.log(`Nonce generated for ${publicKey}:`, user.nonce);
    res.json({ nonce: user.nonce });
  } catch (err) {
    console.error('Error in request_nonce:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

/// ----- Verify Signature and Issue JWT ----- ///
router.post('/verify_signature', async (req, res) => {
  const { publicKey, signature, nonce } = req.body;

  if (!publicKey || !signature || !nonce) {
    return res.status(400).json({ error: 'Public key, signature, and nonce are required' });
  }
  const user = await User.findOne({ publicKey });

  const message = `Authentication nonce: ${user.nonce}`;
  const messageBytes = Buffer.from(message);
  const publicKeyBytes = new PublicKey(publicKey).toBytes();

  const isVerified = nacl.sign.detached.verify(
    messageBytes,
    bs58.decode(signature),
    publicKeyBytes,
  );

  console.log("isVerified", isVerified);

  if (!isVerified) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  try {
    const user = await User.findOne({ publicKey });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.nonce !== nonce) {
      return res.status(400).json({ error: 'Invalid nonce' });
    }

    // Generate JWT
    const token = jwt.sign({ publicKey }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Clear nonce
    user.nonce = crypto.randomBytes(32).toString('hex');
    await user.save();

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/// ----- Protected Route Example ----- ///
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', publicKey: req.user.publicKey });
});

/// ----- Middleware to Authenticate Token ----- ///
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

export default router;
