'use client'
import APIRoutes from "@/constants/apiRoutes";
import { useState } from "react";
import axios from "axios";

export default function BookDemo() {
    // form  for newsletter
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [message, setMessage] = useState("");
    // Update input values
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };
    // Submit form 
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await axios.post(APIRoutes.API_SUBSCRIBE, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Something went wrong");
            }

            setMessage("Successfully subscribed!");
            setFormData({ name: "", email: "" });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message || "An unexpected error occurred.");
            } else if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
        }
    };


    return (
        <section className="bg-white px-4 py-8 md:py-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center mb-2">Book Demo</h2>
            <p className="text-primary mb-8 md:mb-14 text-center text-sm sm:text-base">Book our demo to get familiar</p>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start mb-10 justify-between gap-8">
                {/* Left side content */}
                <div className="w-full md:w-1/2">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-4">
                        24/7 Support at Your Fingertips with Voice, Image Chat, and Smart AI Assistance
                    </h2>
                    <p className="text-primary">
                        Manage all your payments, tenants, and workers effortlessly with our plans! Enjoy
                        unlimited units, seamless organization, and the convenience of an AI-powered chatbot to
                        handle tenant queries and streamline your workflow.
                    </p>
                </div>
                {/* Newsletter form */}
                <div className="w-full md:w-1/3 bg-primary text-white p-4 sm:p-6 rounded-lg shadow-lg shrink-0">
                    <h4 className="text-lg font-bold mb-4">Join the Newsletter</h4>
                    <form onSubmit={handleSubmit}>
                        <label className="block text-sm mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="YOUR NAME HERE"
                            className="w-full p-3 mb-4 bg-white text-primary rounded-lg focus:outline-none"
                            required
                        />
                        <label className="block text-sm mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="YOUR EMAIL HERE"
                            className="w-full p-3 mb-6 bg-white text-primary rounded-lg focus:outline-none"
                            required
                            pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
                        />
                        <button
                            type="submit"
                            className="w-full bg-secondary text-white font-bold p-3 rounded-lg hover:text-primary hover:bg-white transition"
                        >
                            Subscribe
                        </button>
                    </form>
                    {message && <p className="mt-4 text-center">{message}</p>}
                </div>
            </div>
        </section>
    );
}