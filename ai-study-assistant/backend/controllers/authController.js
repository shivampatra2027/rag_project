const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

function getJwtSecret() {
  return (process.env.JWT_SECRET || '').trim();
}

function getGoogleClientId() {
  return (process.env.GOOGLE_CLIENT_ID || '').trim();
}

function createToken(userId) {
  const secret = getJwtSecret();

  if (!secret) {
    throw new Error('JWT_SECRET is missing in environment variables.');
  }

  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
}

function buildAuthResponse(user, token) {
  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  };
}

async function googleAuth(req, res) {
  const { credential } = req.body || {};
  const clientId = getGoogleClientId();

  if (!clientId) {
    return res.status(500).json({ error: 'GOOGLE_CLIENT_ID is missing in environment variables.' });
  }

  if (!credential || typeof credential !== 'string') {
    return res.status(400).json({ error: 'Invalid input. Provide Google credential token.' });
  }

  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: clientId,
  });

  const payload = ticket.getPayload();
  const email = payload?.email ? String(payload.email).trim().toLowerCase() : '';
  const name = payload?.name ? String(payload.name).trim() : '';
  const googleId = payload?.sub ? String(payload.sub).trim() : '';

  if (!email || !name || !googleId) {
    return res.status(401).json({ error: 'Invalid Google credential.' });
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ name, email, googleId });
  } else if (user.googleId !== googleId || user.name !== name) {
    user.googleId = googleId;
    user.name = name;
    await user.save();
  }

  const token = createToken(user._id.toString());
  return res.status(200).json(buildAuthResponse(user, token));
}

module.exports = {
  googleAuth,
};
