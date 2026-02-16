"use client";

import Routes from "@/constants/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-secondary py-4 sm:py-6">
            <div className="container mx-auto flex flex-wrap items-center justify-between px-4 sm:px-6 md:px-8 lg:px-16">
                <Link href={Routes.HOME}>
                    <div className="text-2xl sm:text-3xl font-serif text-primary hover:text-white">
                        Dwella
                    </div>
                </Link>

                <ul className="hidden md:flex items-center space-x-4 sm:space-x-6 text-primary text-sm sm:text-base lg:text-lg">
                    <li>
                        <Link
                            href={Routes.HOME}
                            className={`${pathname === Routes.HOME ? "border border-primary px-3 sm:px-4 py-1 rounded-lg" : ""
                                } font-semibold hover:text-white transition`}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={Routes.PRICING}
                            className={`${pathname === Routes.PRICING ? "border border-primary px-3 sm:px-4 py-1 rounded-lg" : ""
                                } font-semibold hover:text-white`}
                        >
                            Pricing
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={Routes.FEATURES}
                            className={`${pathname === Routes.FEATURES ? "border border-primary px-3 sm:px-4 py-1 rounded-lg" : ""
                                } font-semibold hover:text-white`}
                        >
                            Features
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={Routes.DEMO}
                            className={`${pathname === Routes.DEMO ? "border border-primary px-3 sm:px-4 py-1 rounded-lg" : ""
                                } font-semibold hover:text-white`}
                        >
                            Demo
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={Routes.ABOUT}
                            className={`${pathname === Routes.ABOUT ? "border border-primary px-3 sm:px-4 py-1 rounded-lg" : ""
                                } font-semibold hover:text-white`}
                        >
                            About
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={Routes.DEMO}
                            className="bg-primary text-secondary border border-primary px-6 py-3 ml-2 rounded-xl hover:bg-white hover:text-primary transition"
                        >
                            JOIN US
                        </Link>
                    </li>
                </ul>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center">
                    <button
                        className="text-primary focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className="space-y-1">
                            <span className="block w-6 h-0.5 bg-primary"></span>
                            <span className="block w-6 h-0.5 bg-primary"></span>
                            <span className="block w-6 h-0.5 bg-primary"></span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed top-0 right-0 h-full w-[70%] sm:w-[50%] md:w-[40%] bg-secondary shadow-lg z-50 flex flex-col items-center justify-center space-y-4 text-primary font-semibold text-base sm:text-lg">
                    <button
                        className="absolute top-4 right-4 text-primary text-2xl"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        &times;
                    </button>
                    <ul className="flex flex-col items-center space-y-4">
                        <li>
                            <Link
                                href={Routes.HOME}
                                className={`${pathname === Routes.HOME ? "border border-primary px-4 py-1 rounded-lg" : ""
                                    } hover:text-white transition`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={Routes.PRICING}
                                className={`${pathname === Routes.PRICING ? "border border-primary px-4 py-1 rounded-lg" : ""
                                    } hover:text-white`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Pricing
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={Routes.FEATURES}
                                className={`${pathname === Routes.FEATURES ? "border border-primary px-4 py-1 rounded-lg" : ""
                                    } hover:text-white`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Features
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={Routes.DEMO}
                                className={`${pathname === Routes.DEMO ? "border border-primary px-4 py-1 rounded-lg" : ""
                                    } hover:text-white`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Demo
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={Routes.ABOUT}
                                className={`${pathname === Routes.ABOUT ? "border border-primary px-4 py-1 rounded-lg" : ""
                                    } hover:text-white`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={Routes.DEMO}
                                className="bg-primary text-secondary border border-primary px-4 py-2 rounded-xl hover:bg-white hover:text-primary transition"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                JOIN US
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;