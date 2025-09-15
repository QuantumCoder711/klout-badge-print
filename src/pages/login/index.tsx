import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import signinBanner from '/signinbanner.webp';
import typingEffect from "../../utils";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error, token } = useAppSelector((state) => state.auth);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [showPassword, setShowPassword] = useState(false);

    const textToType = "Step into the Future of Event Management with Klout Club - Your Event, Your Way!";
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 2000;

    const displayedText = typingEffect(textToType, typingSpeed, deletingSpeed, pauseDuration);

    // Handle error messages
    useEffect(() => {
        if (error) {
            Swal.fire({
                title: error,
                icon: 'error',
                confirmButtonText: 'OK',
            });
            // Clear error after showing it
            dispatch(clearError());
        }
    }, [error, dispatch]);

    // Redirect if already logged in
    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        const validationErrors: { email?: string; password?: string } = {};
        if (!email) validationErrors.email = 'Email is required';
        if (!password) validationErrors.password = 'Password is required';
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setErrors({});
        
        try {
            const resultAction = await dispatch(loginUser({ email, password }));
            
            if (loginUser.fulfilled.match(resultAction)) {
                // Login successful, the useEffect will handle the navigation
                return;
            }
        } catch (error) {
            // Error is already handled by the auth slice and useEffect
            console.error('Login error:', error);
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
                                disabled={loading}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        {/* Password Field with Eye Icon */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700"
                                    disabled={loading}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
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
