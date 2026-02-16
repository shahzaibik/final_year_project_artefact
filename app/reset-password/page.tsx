"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Routes from "@/constants/routes";
import APIRoutes from "@/constants/apiRoutes";
import axios from "axios";
// Reset password page 
const ResetPasswordPage = () => {
    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Safely extract the token using window.location.search
        const params = new URLSearchParams(window.location.search);
        const tokenFromQuery = params.get("token");
        setToken(tokenFromQuery);
    }, []);
// strong password validation rule
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// handle reset submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { password, confirmPassword } = form;

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!passwordRegex.test(password)) {
            setError(
                "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
            );
            return;
        }

        try {
            const response = await axios.post(
                APIRoutes.AUTH_RESET_PASSWORD,
                { token, password },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200 || response.status === 201) {
                setSuccess(true);
                setError("");
                // redirect to login page on success
                setTimeout(() => router.push(Routes.LOGIN), 3000);
            }
        } catch (error) {
            console.error(error);
            setError("Failed to reset password. Please try again.");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    return (
        <div className="flex h-screen">
            <div className="w-full lg:w-1/2 bg-white flex flex-col">
                <div className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-6">
                    <h1 className="text-2xl font-bold text-primary">Dwella</h1>
                    <button className="border border-primary text-primary px-4 py-2 rounded-lg">
                        Login
                    </button>
                </div>

                <div className="flex flex-col justify-center items-center flex-grow px-4 sm:px-6">
                    <div className="w-full max-w-md px-4 sm:px-6 py-6 sm:py-8 shadow-md rounded-lg border">
                        <h2 className="text-lg font-bold text-primary mb-2">RESET PASSWORD</h2>
                        <p className="text-md text-gray-400 mb-6">
                            Please enter your new password below.
                        </p>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {success ? (
                            <p className="text-green-500">
                                Password reset successful! Redirecting to login...
                            </p>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="New Password"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={form.password}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={form.confirmPassword}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary text-white rounded-lg py-2 font-semibold hover:bg-[#001C4D]"
                                >
                                    RESET PASSWORD
                                </button>
                            </form>
                        )}
                    </div>
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

export default ResetPasswordPage;