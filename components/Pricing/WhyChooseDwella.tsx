import { AiOutlineDollarCircle } from "react-icons/ai";
import { FaHandshake, FaTasks } from "react-icons/fa";
import { GiSmartphone } from "react-icons/gi";


const WhyChooseDwella = () => {
    return (
        <div className="flex h-full justify-center items-center bg-tertiary py-8 md:py-16 px-4 sm:px-6">
            <div className="max-w-5xl w-full text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-8 md:mb-16">Why Choose Dwella</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="flex flex-col items-center">
                        <div className="mb-4">
                            {/* Replace with actual icon */}
                            <AiOutlineDollarCircle size={50} />
                            {/* <img src="/icons/pricing-icon.svg" alt="Affordable Pricing" className="h-12 w-12" /> */}
                        </div>
                        <h3 className="text-lg font-semibold text-primary mb-2">Affordable Pricing</h3>
                        <p className="text-primary text-sm">
                            Just $19 per property per month, with the ability to manage multiple properties.
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="mb-4">
                            {/* Replace with actual icon */}
                            <FaHandshake size={50} />
                            {/* <img src="/icons/network-icon.svg" alt="Trusted Network" className="h-12 w-12" /> */}
                        </div>
                        <h3 className="text-lg font-semibold text-primary mb-2">Trusted Network</h3>
                        <p className="text-primary text-sm">
                            Access a list of verified handymen and vendors who are ready to assist you at any time.
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="mb-4">
                            {/* Replace with actual icon */}
                            <GiSmartphone size={50} />
                            {/* <img src="/icons/mobile-icon.svg" alt="Easy-to-Use Mobile App" className="h-12 w-12" /> */}
                        </div>
                        <h3 className="text-lg font-semibold text-primary mb-2">Easy-to-Use Mobile App</h3>
                        <p className="text-primary text-sm">
                            Designed for landlords, tenants, and vendors to connect and manage tasks effortlessly.
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="mb-4">
                            {/* Replace with actual icon */}
                            <FaTasks size={50} />
                            {/* <img src="/icons/management-icon.svg" alt="Comprehensive Management" className="h-12 w-12" /> */}
                        </div>
                        <h3 className="text-lg font-semibold text-primary mb-2">Comprehensive Management</h3>
                        <p className="text-primary text-sm">
                            Handle rent collection, vendor coordination, and tenant feedback all in one platform.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyChooseDwella;  