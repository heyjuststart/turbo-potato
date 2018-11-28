const express = require('express');
const router = express.Router();

const { User } = require('../models');

// Register new users
router.post('/register', async (req, res) => {
  try {
    let user = await User.create(req.body);

    let data = await user.authorize();

    return res.json(data);
  } catch(err) {
    return res.status(400).send(err);
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Request missing username or password');
  }

  try {
    let user = await User.authenticate(username, password);
    return res.json(user);
  } catch (err) {
    return res.status(400).send('invalid username or password');
  }
});

// Logout route
router.delete('/logout', async (req, res) => {
  const { user, cookies: { auth_token: authToken }} = req;

  if (user && authToken) {
    await req.user.logout(authToken);
    return res.status(204).send();
  }

  return res.status(400).send({ errors: [{ message: 'not authenticated' }]});
});

// Get current user
router.get('/me', (req, res) => {
  if (req.user) {
    return res.send(req.user);
  }
  res.status(404).send({ errors: [{ message: 'missing auth token' }]});
});

module.exports = router;

