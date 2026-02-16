import Link from "next/link"
import HeroEllipse from "../ellipses/HeroEllipse"
import Routes from "@/constants/routes"

const HeroSection = () => {
    return (
        // Main hero section
        <section className="min-h-screen md:min-h-[80vh] flex items-center justify-center bg-white px-4 sm:px-6 md:px-8 lg:px-16">
            {/* Main content container */}
            <div className="flex flex-col lg:flex-row items-center justify-between max-w-[1200px] w-full gap-6 md:gap-8">
                 {/* Left side content */}
                <div className="text-left w-full max-w-[500px]">
                     {/* Main heading */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
                        Welcome to Dwella!
                    </h1>
                    {/* Description paragraph */}
                    <p className="text-primary text-base sm:text-lg mb-6">
                        Simplify your property management experience with our all-in-one platform, designed to connect landlords, tenants, and vendors. Whether you are managing multiple properties or coordinating repairs, Dwella makes everything easier, faster, and more efficient.
                    </p>
 {/* Action buttons login and signup */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Link href={Routes.LOGIN}>
                            <button className="bg-primary text-white font-bold py-2 px-6 rounded-md hover:bg-white hover:text-primary border border-primary">
                                LOGIN
                            </button>
                        </Link>
                        <Link href={Routes.SIGNUP}>
                            <button className="bg-secondary text-primary font-bold py-2 px-6 rounded-md hover:bg-white border border-secondary">
                                SIGN UP
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex justify-center">
                    <HeroEllipse />
                </div>
            </div>
        </section >
    )
}

export default HeroSection
