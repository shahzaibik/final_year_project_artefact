import FeaturesOne from "@/components/Features/Features"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
// Features page
const page = () => {
    return (
        <>
            <Navbar />
            <div className="flex flex-col gap-8">
                <FeaturesOne />
            </div>
            <Footer />
        </>
    )
}

export default page