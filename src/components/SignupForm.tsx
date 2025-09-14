import { useMutation } from '@tanstack/react-query';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSignup } from '../api/auth';
import {toast, Toaster} from "react-hot-toast";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'CANDIDATE' | 'REVIEWER';
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
  });

  const navigate = useNavigate();

 const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: name === "role" ? value.toUpperCase() : value,
  });
};


  const signupMutation = useMutation({
    mutationFn: (formData: SignupFormData) => getSignup(formData),
    onSuccess: (data) => {
        if(data.status === 201){
            toast.success(data.data.message)

           navigate('/login');


        }else{
            toast.error(data.data.error)
        }
      //localStorage.setItem('accessToken', data.data.accessToken);
    },
    onError: (err: any) => {
      console.error('Signup failed', err);
            toast.error(err)

    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>

        {/* Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={signupMutation.isPending}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
            disabled={signupMutation.isPending}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
            disabled={signupMutation.isPending}
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={signupMutation.isPending}
          >
            <option value="ADMIN">Admin</option>
            <option value="CANDIDATE">Candidate</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={signupMutation.isPending}
          className={`w-full text-white py-2 px-4 rounded-md transition-colors ${
            signupMutation.isPending
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {signupMutation.isPending ? 'Signing up...' : 'Sign Up'}
        </button>

        {/* Already have account */}
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
      <Toaster/>
    </div>
  );
};

export default SignupForm;
