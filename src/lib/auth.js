import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

// Use environment variable with fallback (should be set properly in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    userType: user.userType
  };

  // Set expiration to 24 hours
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
}

export async function createUser(userData) {
  const { email, password, name, userType, profileData } = userData;
  
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Prepare user data based on user type
    const userCreateData = {
      email,
      password: hashedPassword,
      name,
      userType
    };
    
    // Add profile data based on user type
    if (userType === 'FARMER' && profileData) {
      userCreateData.farmerProfile = {
        create: profileData
      };
    } else if (userType === 'RESEARCHER' && profileData) {
      userCreateData.researcherProfile = {
        create: profileData
      };
    }
    
    // Create the user
    const newUser = await prisma.user.create({
      data: userCreateData,
      include: {
        farmerProfile: userType === 'FARMER',
        researcherProfile: userType === 'RESEARCHER'
      }
    });
    
    // Remove password from returned data
    const { password: _, ...userWithoutPassword } = newUser;
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function loginUser(email, password) {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        farmerProfile: true,
        researcherProfile: true
      }
    });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Verify password
    const isPasswordValid = await comparePasswords(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Remove password from returned data
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function getUserById(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        farmerProfile: true,
        researcherProfile: true
      }
    });
    
    if (!user) return null;
    
    // Remove password from returned data
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}