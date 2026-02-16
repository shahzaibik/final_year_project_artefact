import KeyFeatures from "@/components/About/KeyFeatures"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import Testimonials from "@/components/About/Testimonials"
import RevolutionizingRelationships from "@/components/About/RevolutionizingRelationships"

const page = () => {
    return (
        <>
          {/* top navbar */}
            <Navbar />
            {/* main content */}
            <div className="flex flex-col gap-8">
                <RevolutionizingRelationships />
                <KeyFeatures />
                <Testimonials />
            </div>
            {/*  footer */}
            <Footer />  
        </>
    )
}

export default page