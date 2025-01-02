import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signinBanner from '/signinbanner.webp';
import typingEffect from "../../utils";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
    const apiBaseUrl = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors,] = useState<{ email?: string; password?: string }>({});
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [_, setSubmitted] = useState(false); // Track if form is submitted

    const textToType = "Step into the Future of Event Management with Klout Club - Your Event, Your Way!";
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 2000;

    const displayedText = typingEffect(textToType, typingSpeed, deletingSpeed, pauseDuration);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true); // Mark the form as submitted

        try {
            const response = await axios.post(`${apiBaseUrl}/api/login`, { email, password }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.status === 200) {
                console.log(response.data);
                localStorage.setItem("userId", response.data.user_id);
                localStorage.setItem("token", response.data.access_token);
                // Store response.data.user_id
                Swal.fire({
                    title: 'Login Successful!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => navigate("/"));
            }

            else {
                Swal.fire({
                    title: response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }

            // return response.data;
        } catch (error) {
            // console.log(error);
            Swal.fire({
                title: 'Something went wrong',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            throw error;
        }
    };

    return (
        <div className="flex h-screen">
            {/* Left side with image */}
            <div className="relative w-2/3 bg-cover flex justify-center items-center" style={{ backgroundImage: `url(${signinBanner})` }}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black opacity-50"></div> {/* Black overlay with reduced opacity */}

                {/* Text */}
                <h1 className="text-white text-5xl font-normal relative z-10 p-20">
                    {displayedText}
                </h1>
            </div>

            {/* Right side with form */}
            <div className="w-1/3 flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-4">
                    <div className='flex justify-center'>
                        <h2 className="text-3xl font-semibold text-black">Login</h2>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        {/* Password Field with Eye Icon */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                            />
                            {/* Eye Icon */}
                            <span
                                className="absolute inset-y-0 right-3 flex items-center top-6 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                            >
                                {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                            </span>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-teal-500 text-white py-2 rounded-md"
                            >
                                Login
                            </button>
                        </div>

                        <hr className='!my-10 border border-zinc-200' />

                        {/* Forgot Password Link */}
                        <Link to={"/forgot-password"} className='text-teal-500'>Forgot Password?</Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
