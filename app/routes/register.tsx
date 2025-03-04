import React from 'react';
import { Link, useNavigate } from "@remix-run/react";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import { useState } from "react";
import { account } from "~/appwrite";
import AuthLayout from '../layouts/AuthLayout';

export default function Register() {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await account.create('unique()', email, password, username);
      await account.createEmailPasswordSession(email, password);
      navigate("/");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold text-center flex-1 pr-7">Create an account</h1>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="space-y-2">
            <label htmlFor="username" className="block font-medium">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                placeholder="Username"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block font-medium">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="Enter Email Address"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1a2e30] text-white rounded-lg font-medium hover:bg-[#15252a] transition-colors mt-4"
          >
            Continue
          </button>

          <p className="text-center text-xs text-gray-600 mt-4">
            By continuing, you agree to the{" "}
            <Link to="#" className="text-[#1a2e30] font-medium hover:underline">
              Terms of Services
            </Link>{" "}
            &{" "}
            <Link to="#" className="text-[#1a2e30] font-medium hover:underline">
              Privacy Policy
            </Link>
          </p>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-teal-600 font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};