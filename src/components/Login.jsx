import React, { useState } from 'react';
import { Mic, Mail, Lock, ArrowRight } from 'lucide-react';
const Login = ({ onLogin, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onLogin(formData);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            {/* Login Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-emerald-600">Welcome Back</h1>
                    <p className="text-gray-500">
                        Sign in to continue your speech journey
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-600" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                placeholder="your.email@example.com"
                                aria-required="true"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                            />
                        </div>
                        {errors.email && (
                            <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-600" />
                            </div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.password ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                placeholder="Enter your password"
                                aria-required="true"
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? 'password-error' : undefined}
                            />
                        </div>
                        {errors.password && (
                            <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-600 cursor-pointer"
                            />
                            <span className="ml-2 text-sm text-gray-900">Remember me</span>
                        </label>
                        <button
                            type="button"
                            className="text-sm text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                {/* Register Link */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500">
                        Don't have an account?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
                        >
                            Create one now
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
