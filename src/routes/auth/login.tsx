import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const Route = createFileRoute('/auth/login')({
  component: LoginComponent,
});

function LoginComponent() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate({ to: '/' });
  };

  return (
    <AuthLayout title="Sign in to your account">
      <LoginForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
