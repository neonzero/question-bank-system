import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    await login(data.email, data.password);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <input {...register('email')} placeholder="Email" className="border p-2" />
      <input {...register('password')} type="password" placeholder="Password" className="border p-2" />
      <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
    </form>
  );
};

export default Login;
