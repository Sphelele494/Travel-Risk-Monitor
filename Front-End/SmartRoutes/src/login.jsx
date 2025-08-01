import React, { useState } from "react"
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/outline';
import { Navigation } from "lucide-react";
import { ApiClient } from "./lib/api-client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

const LoginUser = async () => {
    try {
        const response = await ApiClient.post("/login", {
            username: formData.email,
            password: formData.password
        });

        if (response.status === 200) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('Data', JSON.stringify(response.data));
            console.log("Login successful:", localStorage.getItem('Data'));    
            toast.success("Login successful. Welcome!");
            navigate("/dashboard");
        } else {
            console.log("Unexpected status:", response.status);
            toast.warning("Unexpected login response.");
        }
    } catch (error) {
        if (error.response) {
            toast.error("Login failed: " + error.response.data);
            console.log("Login failed:", error.response.data);
        } else {
            toast.error("Network error. Please try again.");
            console.log("Error:", error.message);
        }
    }
};

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center w-96">
                <div className="flex items-center px-4">
                    <div className="flex px-4 items-center justify-center">
                        <div className="flex w-10 h-10 bg-orange-600 items center justify rounded-md items-center justify-center mx-4">
                            <Navigation className="text-white-600 w-5 h-5" color="#ffffff" />
                        </div>
                        <div className="flex flex-col ml-auto">
                            <h1 className="text-3xl font-bold my-2 text-gray-800">SmartRoutes</h1>
                            <p className="text-sm font-light mb-4 text-light-gray-600">South African Road Intelligence</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center border border-gray-300 rounded-md px-3 my-5 py-4 bg-white shadow-sm w-full max-w-md hover:border-orange-400 hover:shadow-[0_0_10px_rgba(255,115,0,0.6)] transition duration-300">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <input 
                        type="email" 
                        name="email"
                        placeholder="you@example.com" 
                        className="ml-3 w-full outline-none text-sm text-gray-700 bg-transparent" 
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="flex items-center p-8 border border-gray-300 rounded-md px-3 my-5 py-4 bg-white shadow-sm w-full max-w-md hover:border-orange-400 hover:shadow-[0_0_10px_rgba(255,115,0,0.6)] transition duration-300">
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

                <div className="flex justify-center items-center m-4">
                    <input 
                        type="checkbox" 
                        name="rememberMe"
                        id="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                    /> 
                    <label htmlFor="rememberMe" className="font-md text-black-600 ml-1">Remember me?</label>
                    <a href="#" className="font-sm text-orange-600 ml-4">Forgotten password</a>
                </div>

                <div className="flex justify-center items-center my-4">
                    <button onClick = {LoginUser}
                    className="flex justify-center items-center w-full px-6 py-2 bg-orange-500 text-white border border-transparent rounded-md shadow-md hover:bg-white hover:text-orange-500 hover:border-orange-400 hover:shadow-[0_0_10px_rgba(255,115,0,0.3)] transition duration-300">
                        Sign in
                        <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </button>
                </div>

                <div className="flex items-center justify-center my-4">
                    <div className="border-t border-gray-400 flex-grow mx-2"></div>
                    <p className="text-sm text-gray-700">OR CONTINUE WITH</p>
                    <div className="border-t border-gray-400 flex-grow mx-2"></div>
                </div>

                <div className="flex gap-4 justify-center mt-4 max-w-md w-full mx-auto">
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
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-orange-500 hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login;