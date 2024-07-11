import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors());

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT secret not defined. Make sure you have a .env file with JWT_SECRET");
}

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint works!' });
});

// Signup route
app.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'User already exists' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });
    res.json({ token, refreshToken, user: { email: user.email, name: user.name } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Protected route to get user data
app.get('/user', authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
  });
  if (user) {
    res.json({ email: user.email, name: user.name });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Export the app for serverless handler
export default app;
