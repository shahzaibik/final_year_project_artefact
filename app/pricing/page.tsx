import FAQ from "@/components/Pricing/FAQ"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import SubscriptionPlans from "@/components/Pricing/SubscriptionPlans"
import WhyChooseDwella from "@/components/Pricing/WhyChooseDwella"

const page = () => {
    return (
        <>
            <Navbar />
            <div className="flex flex-col gap-8">
                <SubscriptionPlans />
                <WhyChooseDwella />
                <FAQ />
            </div>
            <Footer />
        </>
    )
}

export default page