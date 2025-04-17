import { NextResponse } from 'next/server';
import { createUser } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { email, password, userType, name } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate userType
    if (userType !== 'FARMER' && userType !== 'RESEARCHER') {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    // Create user with initial empty profile
    const userData = {
      email,
      password,
      name: name || null,
      userType,
      profileData: {} // Empty profile data for now
    };

    const user = await createUser(userData);

    // Return success response
    return NextResponse.json({
      message: 'Account created successfully',
      user
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}