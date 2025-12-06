const prisma = require('../db/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // 1. Import jsonwebtoken
const crypto = require('crypto'); // 1. Import the built-in crypto module
const { sendPasswordResetEmail } = require('../services/email.service'); // 2. Import your email service

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    // You can change this value to '7d', '24h', '365d', etc.
    expiresIn: '30d',
  });
};

/**
 * Creates a single new user and logs them in.
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);

    delete user.password;
    res.status(201).json({ message: 'User created successfully', user, token });
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

    const token = generateToken(user.id);

    delete user.password;
    res.status(200).json({ message: "Login successful", user, token });
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

/**
 * Gets the profile of the currently logged-in user.
 */
exports.getUserProfile = async (req, res) => {
  // The user object is attached to the request by the `protect` middleware
  res.status(200).json(req.user);
};

/**
 * Handles a forgot password request.
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour

      await prisma.passwordResetToken.create({
        data: {
          token: hashedToken,
          expiresAt,
          userId: user.id,
        },
      });

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      // This will now work correctly
      await sendPasswordResetEmail(user.email, resetUrl);
    }

    res.status(200).json({ message: "A reset link has been sent to your registered email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Resets a user's password using a token.
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // 1. Hash the incoming token to match the one in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 2. Find the token in the database
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    // 3. Check if the token is valid and not expired
    if (!passwordResetToken || passwordResetToken.expiresAt < new Date()) {
      return res.status(400).json({ message: "Token is invalid or has expired." });
    }

    // 4. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Update the user's password
    await prisma.user.update({
      where: { id: passwordResetToken.userId },
      data: { password: hashedPassword },
    });

    // 6. Delete the used token
    await prisma.passwordResetToken.delete({ where: { id: passwordResetToken.id } });

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Updates the currently logged-in user's profile (name, avatar).
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.user.id;

    // Build the update object dynamically
    const updateData = {};
    if (name !== undefined) updateData.name = name;

    // Handle avatar upload to R2
    if (avatar !== undefined && avatar !== null) {
      // Check if it's a base64 image (new upload)
      if (avatar.startsWith("data:image")) {
        const { uploadImage, deleteImage } = require("../services/r2.service");

        // Delete old avatar if exists
        const currentUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { avatar: true },
        });
        if (currentUser?.avatar) {
          await deleteImage(currentUser.avatar);
        }

        // Upload new avatar to R2
        const fileName = `${userId}-${Date.now()}`;
        const avatarUrl = await uploadImage(avatar, fileName);
        updateData.avatar = avatarUrl;
      } else {
        // It's already a URL, just store it
        updateData.avatar = avatar;
      }
    }

    // If no fields to update, return early
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        isSubscribed: true,
      },
    });

    res.status(200).json({ message: "Profile updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("updateUserProfile error:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};