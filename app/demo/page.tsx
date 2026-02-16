import BookDemo from "@/components/Demo/BookDemo"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
// Demo booking page
const page = () => {
    return (
        <>
            <Navbar />
            <div className="flex flex-col my-6 sm:my-8 md:my-12">
                <BookDemo />
            </div>
            <Footer />
        </>
    )
}

export default page