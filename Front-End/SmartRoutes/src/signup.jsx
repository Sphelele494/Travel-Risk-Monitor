import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/outline';
import { Navigation } from "lucide-react";

function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center w-96">
                <div className="flex px-0 items-center justify-center">
                    <div className="flex w-10 h-10 bg-orange-600 items center justify rounded-md items-center justify-center mx-4">
                        <Navigation className="text-white-600 w-5 h-5" color="#ffffff" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold my-2 text-gray-800">SmartRoutes</h1>
                        <p className="text-sm font-light mb-4 text-light-gray-600">South African Road Intelligence</p>
                    </div>
                </div>

                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 my-4 bg-white shadow-sm hover:border-orange-400 hover:shadow-[0_0_10px_rgba(255,115,0,0.3)] transition duration-300">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <input 
                        type="text" 
                        name="fullName"
                        placeholder="Full name" 
                        className="ml-2 w-full outline-none text-sm text-gray-700 bg-transparent" 
                        value={formData.fullName}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 my-4 bg-white shadow-sm hover:border-orange-400 hover:shadow-[0_0_10px_rgba(255,115,0,0.3)] transition duration-300">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <input 
                        type="text" 
                        name="username"
                        placeholder="Username" 
                        className="ml-2 w-full outline-none text-sm text-gray-700 bg-transparent" 
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 my-4 bg-white shadow-sm hover:border-orange-400 hover:shadow-[0_0_10px_rgba(255,115,0,0.3)] transition duration-300">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <input 
                        type="email" 
                        name="email"
                        placeholder="you@example.com" 
                        className="ml-2 w-full outline-none text-sm text-gray-700 bg-transparent" 
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 my-4 bg-white shadow-sm hover:border-orange-400 hover:shadow-[0_0_10px_rgba(255,115,0,0.3)] transition duration-300">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password"
                        placeholder="Enter your password" 
                        className="w-full outline-none text-sm text-gray-700 bg-transparent"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 ml-2" />
                        ) : (
                            <EyeIcon className="h-5 w-5 ml-2" />
                        )}
                    </button>
                </div>

                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 my-4 bg-white shadow-sm hover:border-orange-400 hover:shadow-[0_0_10px_rgba(255,115,0,0.3)] transition duration-300">
                    <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        name="confirmPassword"
                        placeholder="Confirm your password" 
                        className="w-full outline-none text-sm text-gray-700 bg-transparent"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                    />
                    <button 
                        type="button" 
                        onClick={toggleConfirmPasswordVisibility}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 ml-2" />
                        ) : (
                            <EyeIcon className="h-5 w-5 ml-2" />
                        )}
                    </button>
                </div>

                <div className="flex justify-center items-center my-4">
                    <button 
                        type="submit"
                        className="flex justify-center items-center w-full px-6 py-2 bg-orange-500 text-white border border-transparent rounded-md shadow-md hover:bg-white hover:text-orange-500 hover:border-orange-400 hover:shadow-[0_0_10px_rgba(255,115,0,0.3)] transition duration-300"
                    >
                        Sign up
                        <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </button>
                </div>

                <div className="flex items-center justify-center my-4">
                    <div className="border-t border-gray-400 flex-grow mx-2"></div>
                    <p className="text-sm text-gray-700">OR SIGN UP WITH</p>
                    <div className="border-t border-gray-400 flex-grow mx-2"></div>
                </div>

                <div className="flex gap-4 justify-center mt-4">
                    <button className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md bg-white hover:border-orange-500 hover:shadow-md transition">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
                        <span className="text-sm text-gray-700">Google</span>
                    </button>

                    <button className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md bg-white hover:border-orange-500 hover:shadow-md transition">
                        <svg className="h-5 w-5 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                        </svg>
                        <span className="text-sm text-gray-700">Twitter</span>
                    </button>
                </div>

                <p className="mt-6 text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-orange-500 hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup;