import React, { useState } from 'react';
import { Mic, Mail, Lock, User, ArrowRight } from 'lucide-react';
const Register = ({ onRegister, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
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

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

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

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onRegister(formData);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            {/* Register Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-emerald-600">Create Account</h1>
                    <p className="text-gray-500">
                        Start your journey to confident speech
                    </p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.name ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                placeholder="John Doe"
                                aria-required="true"
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? 'name-error' : undefined}
                            />
                        </div>
                        {errors.name && (
                            <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.name}
                            </p>
                        )}
                    </div>

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
                                placeholder="At least 6 characters"
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

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-600" />
                            </div>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                placeholder="Confirm your password"
                                aria-required="true"
                                aria-invalid={!!errors.confirmPassword}
                                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p id="confirmPassword-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Terms Checkbox */}
                    <div>
                        <label className="flex items-start cursor-pointer">
                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                className={`w-4 h-4 mt-1 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer ${errors.agreeToTerms ? 'border-red-500' : ''
                                    }`}
                                aria-required="true"
                                aria-invalid={!!errors.agreeToTerms}
                                aria-describedby={errors.agreeToTerms ? 'terms-error' : undefined}
                            />
                            <span className="ml-2 text-sm text-gray-900">
                                I agree to the{' '}
                                <a href="#" className="text-emerald-700 hover:text-emerald-800 font-semibold">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-emerald-700 hover:text-emerald-800 font-semibold">
                                    Privacy Policy
                                </a>
                            </span>
                        </label>
                        {errors.agreeToTerms && (
                            <p id="terms-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.agreeToTerms}
                            </p>
                        )}
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <span>Create Account</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500">
                        Already have an account?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
