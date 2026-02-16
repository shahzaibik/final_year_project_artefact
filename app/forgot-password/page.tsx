"use client"
import { useState } from "react";
import Routes from "@/constants/routes";
import Link from "next/link";
import APIRoutes from "@/constants/apiRoutes";
import axios from "axios";
// forgot password page
const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // reset password request
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        setError(null);
        setSuccess(null);

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        try {
            setIsLoading(true);

            const response = await axios.post(APIRoutes.AUTH_FORGOT_PASSWORD, { email });

            if (response.status === 200) {
                setSuccess("A reset password email has been sent to your email address.");
                setEmail("");
            } else {
                setError(response.data.message || "Failed to send reset email. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex h-screen">
            <div className="w-full lg:w-1/2 bg-white flex flex-col">
                <div className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-6">
                    <Link href={Routes.HOME}>
                        <h1 className="text-2xl font-bold text-primary">Dwella</h1>
                    </Link>
                    <Link href={Routes.LOGIN}>
                        <button className="border border-primary text-primary px-4 py-2 rounded-lg">
                            Login
                        </button>
                    </Link>
                </div>

                <div className="flex flex-col justify-center items-center flex-grow px-4 sm:px-6">
                    <div className="w-full max-w-md px-4 sm:px-6 py-6 sm:py-8 shadow-md rounded-lg border">
                        <h2 className="text-lg font-bold text-primary mb-2">FORGOT PASSWORD</h2>
                        <p className="text-md text-gray-400 mb-6">
                            Please enter your email address below to receive a reset password link.
                        </p>

                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

                        <form onSubmit={handleForgotPassword}>
                            <div className="mb-4">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-white rounded-lg py-2 font-semibold hover:bg-[#001C4D]"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "SEND EMAIL"}
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

export default ForgotPasswordPage;