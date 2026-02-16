"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Routes from "@/constants/routes";
import Link from "next/link";
import APIRoutes from "@/constants/apiRoutes";
import axios from "axios";
// Signup page
const SignUpPage = () => {
    const [form, setForm] = useState({
        name: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [feedback, setFeedback] = useState<{
        error: string | null;
        success: string | null;
        isLoading: boolean;
    }>({
        error: null,
        success: null,
        isLoading: false,
    });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [id]: value }));
    };
// validate form fields before submission
    const validateInput = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!form.name || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
            return "All fields are required.";
        }

        if (!emailRegex.test(form.email)) {
            return "Please enter a valid email address.";
        }

        if (form.password !== form.confirmPassword) {
            return "Passwords do not match.";
        }

        if (!passwordRegex.test(form.password)) {
            return "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
        }

        return null;
    };
// to submit signup request
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const validationError = validateInput();
        if (validationError) {
            setFeedback({ error: validationError, success: null, isLoading: false });
            return;
        }
    
        try {
            setFeedback({ error: null, success: null, isLoading: true });
    
            const response = await axios.post(APIRoutes.AUTH_SIGNUP, form, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (response.status === 200 || response.status === 201) {
                setFeedback({
                    error: null,
                    success: "Signup successful! Redirecting...",
                    isLoading: false,
                });
    
                setTimeout(() => {
                    router.push(Routes.LOGIN);
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            setFeedback({
                error: "Email already exist.",
                success: null,
                isLoading: false,
            });
        }
    };
    

    return (
        <div className="flex h-screen">
            <div className="w-full lg:w-1/2 bg-white flex flex-col">
                <div className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-6 shrink-0">
                    <Link href={Routes.HOME}>
                        <h1 className="text-2xl font-bold text-primary">Dwella</h1>
                    </Link>
                    <Link href={Routes.LOGIN}>
                        <button className="border border-primary text-primary px-4 py-2 rounded-lg">
                            Login
                        </button>
                    </Link>
                </div>

                <div className="flex flex-col justify-center items-center flex-grow px-4 sm:px-6 overflow-y-auto">
                    <div className="w-full max-w-md px-4 sm:px-6 py-6 sm:py-8 shadow-md rounded-lg border my-4">
                        <h2 className="text-lg font-bold text-primary mb-2">SIGN UP</h2>
                        <p className="text-md text-gray-400 mb-6">
                            Please enter the information below to sign up
                        </p>

                        {feedback.error && <p className="text-red-500 text-sm mb-4">{feedback.error}</p>}
                        {feedback.success && <p className="text-green-500 text-sm mb-4">{feedback.success}</p>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    id="name"
                                    type="text"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    id="lastName"
                                    type="text"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    id="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    id="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-white rounded-lg py-2 font-semibold hover:bg-[#001C4D]"
                                disabled={feedback.isLoading}
                            >
                                {feedback.isLoading ? "Signing Up..." : "SIGN UP"}
                            </button>
                        </form>
                    </div>

                    <p className="mt-6 text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href={Routes.LOGIN} className="text-primary font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>

            <div className="hidden lg:flex w-1/2 bg-primary justify-center items-center">
                <div className="text-center">
                    <img src="/logo.png" alt="Robot" className="w-full mx-auto opacity-70" />
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;