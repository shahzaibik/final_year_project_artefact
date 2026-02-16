import EllipseThree from "../ellipses/EllipseThree"
import Link from "next/link"
import Routes from "@/constants/routes"
import { MdCheckCircle } from "react-icons/md"

const Handymen = () => {
    return (
        // Main section wrapper
        <section className="min-h-[60vh] md:min-h-[80vh] flex flex-col md:flex-row items-center justify-between bg-tertiary p-4 sm:p-8 md:p-16 relative">
            {/* Left Content Area */}
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
            {/* Section Heading */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6">
                    Connect with skilled handymen
                    and effortlessly resolve your
                    construction needs
                </h1>
                <ul className="space-y-4 text-base sm:text-lg text-primary">
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
    )
}

export default Handymen
