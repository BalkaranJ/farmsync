import * as yup from 'yup';

// Login form validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

// Signup form validation schema
export const signupSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  userType: yup
    .string()
    .required('User type is required')
    .oneOf(['FARMER', 'RESEARCHER'], 'Invalid user type'),
  agreedToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions'),
});

// Profile update validation schema for Farmer
export const farmerProfileSchema = yup.object({
  name: yup.string().required('Full name is required'),
  farmName: yup.string().required('Farm name is required'),
  location: yup.string().required('Location is required'),
  farmSize: yup
    .number()
    .required('Farm size is required')
    .positive('Farm size must be a positive number'),
  cropTypes: yup
    .array()
    .of(yup.string())
    .min(1, 'Select at least one crop type'),
});

// Profile update validation schema for Researcher
export const researcherProfileSchema = yup.object({
  name: yup.string().required('Full name is required'),
  institution: yup.string().required('Institution is required'),
  specialization: yup.string().required('Specialization is required'),
  researchFocus: yup
    .array()
    .of(yup.string())
    .min(1, 'Select at least one research focus'),
  isPolicymaker: yup.boolean(),
});

// Password change validation schema
export const passwordChangeSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});