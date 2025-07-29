const prisma = require('../db/prismaClient');
const bcrypt = require('bcrypt');

/**
 * Creates a single new user.
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, isSubscribed, subscriptionEnds } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isSubscribed,
        subscriptionEnds: subscriptionEnds ? new Date(subscriptionEnds) : undefined,
      },
    });

    delete user.password;
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Conflict: Email already exists.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Creates multiple users from an array of user data.
 */
exports.createManyUsers = async (req, res) => {
  try {
    const { users } = req.body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: 'A non-empty array of users is required.' });
    }

    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
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