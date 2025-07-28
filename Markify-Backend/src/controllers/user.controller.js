// src/controllers/user.controller.js

const prisma = require('../db/prismaClient');
const bcrypt = require('bcrypt');

/**
 * Creates a new user, hashes their password, and saves it to the database.
 */
exports.createUser = async (req, res) => {
  try {
    // 1. Get user data from the request body
    const { name, email, password, isSubscribed, subscriptionEnds } = req.body;

    // 2. Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Store the secure, hashed password
        isSubscribed,
        subscriptionEnds: subscriptionEnds ? new Date(subscriptionEnds) : undefined,
      },
    });

    // 4. Remove the password from the user object before sending it in the response
    delete user.password;

    // 5. Send a success response with the new user data
    res.status(201).json({ message: 'User created successfully', user });

  } catch (error) {
    // 6. Handle specific errors, like a duplicate email
    if (error.code === 'P2002') {
      // 'P2002' is Prisma's code for a unique constraint violation
      return res.status(409).json({ message: 'Conflict: Email already exists.' });
    }

    // 7. Handle any other unexpected errors
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Internal Server Error' });
  }
};