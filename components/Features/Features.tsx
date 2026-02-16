import Routes from "@/constants/routes"
import Link from "next/link"
import EllipseFour from "../ellipses/EllipseFour"
import HeroEllipse from "../ellipses/HeroEllipse"
import EllipseThree from "../ellipses/EllipseThree"
import EllipseTwo from "../ellipses/EllipseTwo"
import { MdCheckCircle } from "react-icons/md"

const Features = () => {
    return (
        <div className="flex flex-col gap-8">
            {/* SECTION 1 — Main Hero Value Proposition */}
            <section className="min-h-[60vh] md:min-h-[80vh]">
                <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 sm:p-8 md:p-16 relative">
                    {/* Text Content */}

                    <div className="w-full md:w-1/2 mt-8 md:mt-0">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6">
                            Streamline Your Property
                            Management Hassle-Free
                        </h1>
                        <p className="space-y-4 text-lg text-primary">
                            The ultimate app for landlords to effortlessly manage rentals,
                            collect payments, handle maintenance requests, manage
                            handymen—all in one place with the power of AI
                        </p>
                        <Link href={Routes.DEMO}>
                            <button className="mt-8 px-12 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-white hover:text-primary border border-primary">
                                BOOK DEMO
                            </button>
                        </Link>
                    </div>

                    <div className="w-full md:w-1/2 flex justify-center">
                        <EllipseFour />
                    </div>
                </div>
            </section>
 {/* SECTION 2 — AI Feature Highlight */}
            <section className="min-h-[60vh] md:min-h-[80vh]">
                <div className="flex flex-col md:flex-row items-center justify-between bg-tertiary p-4 sm:p-8 md:p-16 relative">
                    <div className="w-full md:w-1/2 flex justify-center">
                        <HeroEllipse />
                    </div>

                    <div className="w-full md:w-1/2 mt-8 md:mt-0">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6">
                            Effortless Management with <br />
                            AI-Powered Convenience
                        </h1>
                        <ul className="space-y-4 text-lg text-primary">
                            <li className="flex items-center">
                                <MdCheckCircle className="mr-4 w-8 h-8" />
                                Get instant responses and solutions with our intelligent AI assistant.
                            </li>
                            <li className="flex items-center">
                                <MdCheckCircle className="mr-4 w-8 h-8" />
                                Enjoy peace of mind knowing help is just a message away, day or night.
                            </li>
                            <li className="flex items-center">
                                <MdCheckCircle className="mr-4 w-8 h-8" />
                                Communicate maintenance issues effortlessly using voice or image chat.
                            </li>
                        </ul>
                        <Link href={Routes.FEATURES}>
                            <button className="mt-8 px-12 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-white hover:text-primary border border-primary">
                                EXPLORE
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECTION 3 — Handyman Services Section */}
            <section className="min-h-[60vh] md:min-h-[80vh] flex flex-col md:flex-row items-center justify-between p-4 sm:p-8 md:p-16 relative">
                <div className="w-full md:w-1/2 mt-8 md:mt-0">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6">
                        Connect with skilled handymen
                        and effortlessly resolve your
                        construction needs
                    </h1>
                    <ul className="space-y-4 text-lg text-primary">
                        <li className="flex items-center">
                            <MdCheckCircle className="mr-4 w-8 h-8" />
                            Access affordable, reliable handyman services without extensive overhead.
                        </li>
                        <li className="flex items-center">
                            <MdCheckCircle className="mr-4 w-8 h-8" />
                            Address all tenant issues, from plumbing to electrical, in one platform.
                        </li>
                        <li className="flex items-center">
                            <MdCheckCircle className="mr-4 w-8 h-8" />
                            Resolve issues promptly, ensuring happier and long-term tenants.
                        </li>
                    </ul>
                    <Link href={Routes.DEMO}>
                        <button className="mt-8 px-12 py-3 bg-secondary text-primary font-bold rounded-lg shadow-md hover:bg-white border border-secondary">
                            LEARN MORE
                        </button>
                    </Link>
                </div>
                <div className="w-full md:w-1/2 flex justify-center">
                    <EllipseThree />
                </div>
            </section>
{/* SECTION 4 — 24/7 Support Section */}
            <section className="min-h-[60vh] md:min-h-[80vh]">
                <div className="flex flex-col md:flex-row items-center justify-between bg-tertiary p-4 sm:p-8 md:p-16 relative">
                    <div className="w-full md:w-1/2 flex justify-center">
                        <EllipseTwo />
                    </div>

                    <div className="w-full md:w-1/2 mt-8 md:mt-0">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6">
                            24/7 Support at Your Fingertips
                            with Voice, Image Chat, and
                            Smart AI Assistance
                        </h1>
                        <ul className="space-y-4 text-lg text-primary">
                            <li className="flex items-center">
                                <MdCheckCircle className="mr-4 w-12 h-12" />
                                Enjoy uninterrupted support, no matter the time or location—perfect for busy landlords and tenants.
                            </li>
                            <li className="flex items-center">
                                <MdCheckCircle className="mr-4 w-12 h-12" />
                                Share images of maintenance problems or documents directly via chat, making it easier to resolve issues quickly.
                            </li>
                            <li className="flex items-center">
                                <MdCheckCircle className="mr-4 w-12 h-12" />
                                Get updates and alerts for all conversations, ensuring you never miss an important message or request.
                            </li>
                        </ul>
                        <Link href={Routes.DEMO}>
                            <button className="mt-8 px-12 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-white hover:text-primary border border-primary">
                                BOOK DEMO
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Features