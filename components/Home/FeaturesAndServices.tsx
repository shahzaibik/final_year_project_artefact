import Image from "next/image";
import EllipseTwo from "../ellipses/EllipseTwo";
import Link from "next/link";
import Routes from "@/constants/routes";
import { MdCheckCircle } from "react-icons/md";

interface FeatureCardProps {
    title: string;
    iconPath: string;
}
// list of features shown in the first section
const featureList = [
    {
        title: "Smart AI Assistance",
        iconPath: "/icons/upcloud.svg",
    },
    {
        title: "Property Management",
        iconPath: "/icons/cycle.svg",
    },
    {
        title: "Chatbot Available",
        iconPath: "/icons/upcloud.svg",
    },
    {
        title: "Hassle-Free Rent Collection",
        iconPath: "/icons/upcloud.svg",
    },
    {
        title: "Handyman Services",
        iconPath: "/icons/lock.svg",
    },
    {
        title: "Construction Issues",
        iconPath: "/icons/upcloud.svg",
    },
];

export default function FeaturesAndServices() {
    return (
        <>
        {/* Main Features Section */}
            <section className="bg-tertiary py-8 md:py-16 min-h-screen md:min-h-[80vh] flex flex-col justify-center relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {/* Section Heading */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary mb-4">
                        Features & Services
                    </h2>
                    {/* Section Description */}
                    <p className="text-center text-primary mb-12">
                        Our platform simplifies property management and provides tailored tools for landlords to resolve tenant issues and streamline operations.
                    </p>
                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-16">
                        {featureList.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                title={feature.title}
                                iconPath={feature.iconPath}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <section className="min-h-[60vh] md:min-h-[80vh]">
                <div className="w-full h-full flex justify-center md:justify-end overflow-hidden">
                    <img src="/android.png" className="w-auto -mt-24 md:-mt-44 -mb-12 md:-mb-24 max-h-[250px] sm:max-h-[320px] md:max-h-[400px] object-contain" alt="App preview" />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 sm:p-8 md:p-16 relative">
                    <div className="w-full md:w-1/2 flex justify-center">
                        <EllipseTwo />
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
        </>
    );
}


function FeatureCard({ title, iconPath }: FeatureCardProps) {
    return (
        <div className="bg-primary text-white p-2 rounded-lg flex items-center gap-3 shadow-md">
            <div className="bg-secondary p-2 rounded-lg">
                <Image
                    src={iconPath}
                    alt={`${title} icon`}
                    className="w-6 h-6"
                    width={24}
                    height={24}
                />
            </div>
            <h3 className="text-base font-semibold">{title}</h3>
        </div>
    );
}