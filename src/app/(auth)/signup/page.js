import SignupForm from '../../../components/auth/SignupForm';

export const metadata = {
  title: 'Create an account - FarmSync',
  description: 'Sign up for a FarmSync account and connect with farmers, researchers, and policymakers',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7f9] py-12 px-4 sm:px-6 lg:px-8">
      <SignupForm />
    </div>
  );
}