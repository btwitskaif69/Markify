const prisma = require('../db/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // 1. Import jsonwebtoken

// Helper function to generate a token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will expire in 30 days
  });
};

/**
 * Creates a single new user and logs them in.
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Removed unused subscription fields for simplicity

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 2. Generate a token for the new user
    const token = generateToken(user.id);

    delete user.password;
    res.status(201).json({ message: 'User created successfully', user, token }); // 3. Send token back
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Conflict: Email already exists.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Logs in an existing user.
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 4. Generate a token for the logged-in user
    const token = generateToken(user.id);

    delete user.password;
    res.status(200).json({ message: "Login successful", user, token }); // 5. Send token back
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Creates multiple users from an array of user data.
 */
exports.createManyUsers = async (req, res) => {
  // This function remains unchanged
  try {
    const { users } = req.body;
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: 'A non-empty array of users is required.' });
    }
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    const result = await prisma.user.createMany({
      data: usersWithHashedPasswords,
      skipDuplicates: true,
    });
    res.status(201).json({ message: 'Users created successfully', count: result.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};