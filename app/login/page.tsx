"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Routes from "@/constants/routes";
import Link from "next/link";
import APIRoutes from "@/constants/apiRoutes";
import axios from "axios";
// Login page
const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [status, setStatus] = useState<{
        error: string | null;
        isLoading: boolean;
    }>({
        error: null,
        isLoading: false,
    });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };
// submit login request
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setStatus({ error: null, isLoading: false });

        const { email, password } = formData;

        if (!email || !password) {
            setStatus({ error: "Both email and password are required.", isLoading: false });
            return;
        }

        try {
            setStatus((prev) => ({ ...prev, isLoading: true }));

            const response = await axios.post(APIRoutes.AUTH_LOGIN, { email, password });

            if (response.status === 200) {
                // redirect to dashboard on success
                router.push(Routes.DASHBOARD);
            } else {
                setStatus({ error: response.data.message || "Invalid credentials. Please try again.", isLoading: false });
            }
        } catch (error) {
            console.error(error);
            setStatus({
                error: "Something went wrong. Please try again later.",
                isLoading: false,
            });
        } finally {
            setStatus((prev) => ({ ...prev, isLoading: false }));
        }
    };


    return (
        <div className="flex h-screen">
            <div className="w-full lg:w-1/2 bg-white flex flex-col">
                <div className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-6">
                    <Link href={Routes.HOME}>
                        <h1 className="text-2xl font-bold text-primary">Dwella</h1>
                    </Link>
                    <Link href={Routes.SIGNUP}>
                        <button className="border border-primary text-primary px-4 py-2 rounded-lg">
                            Create Account
                        </button>
                    </Link>
                </div>

                <div className="flex flex-col justify-center items-center flex-grow px-4 sm:px-6">
                    <div className="w-full max-w-md px-4 sm:px-6 py-6 sm:py-8 shadow-md rounded-lg border">
                        <h2 className="text-lg font-bold text-primary mb-2">LOGIN</h2>
                        <p className="text-md text-gray-400 mb-6">
                            Please enter the information below to log in to your account
                        </p>

                        {status.error && <p className="text-red-500 text-sm mb-4">{status.error}</p>}

                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="text-right text-sm text-primary mb-6">
                                <Link href={Routes.FORGOT_PASSWORD} className="hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-white rounded-lg py-2 font-semibold hover:bg-[#001C4D]"
                                disabled={status.isLoading}
                            >
                                {status.isLoading ? "Logging in..." : "LOGIN"}
                            </button>
                        </form>
                    </div>

                    <p className="mt-6 text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <Link href={Routes.SIGNUP} className="text-primary font-semibold hover:underline">
                            Register Now
                        </Link>
                    </p>
                </div>
            </div>

            <div className="hidden lg:flex w-1/2 bg-primary justify-center items-center">
                <div className="text-center">
                    <img
                        src="/logo.png"
                        alt="Robot"
                        className="w-full mx-auto opacity-70"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;