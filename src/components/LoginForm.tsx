import { useMutation } from '@tanstack/react-query';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLogin } from '../api/auth';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const loginMutation = useMutation({
    mutationFn: (formData: LoginFormData) => getLogin(formData),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.accessToken);
      navigate('/dashboard');
    },
    onError: (err: any) => {
      console.error('Login failed', err);
      alert('Login failed. Please check your credentials.');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loginMutation.isPending}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loginMutation.isPending}
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className={`w-full text-white py-2 px-4 rounded-md transition-colors ${loginMutation.isPending
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm text-gray-600 text-center mt-4">
          Don't have an account?{' '}
          <Link to="/sighup" className="text-blue-600 hover:underline">
            Sighup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
