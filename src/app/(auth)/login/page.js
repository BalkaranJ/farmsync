
import LoginForm from '../../../components/auth/LoginForm';

export const metadata = {
  title: 'Log in - FarmSync',
  description: 'Log in to your FarmSync account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7f9] py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}