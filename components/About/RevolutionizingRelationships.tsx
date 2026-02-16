import EllipseFour from "../ellipses/EllipseFour"
// About section main content
const RevolutionizingRelationships = () => {
    return (
        <section className="min-h-screen md:min-h-[80vh]">
            <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 sm:p-8 md:p-16 relative">
                <div className="w-full md:w-1/2 mt-8 md:mt-0">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6">
                        Revolutionizing Landlord-
                        Tenant Relationships
                    </h1>
                    <p className="space-y-4 text-lg text-primary">
                        At Dewlla, we provide a mobile app that empowers landlords, tenants,
                        and vendors to manage and interact seamlessly. From rent collection
                        and vendor management to maintenance requests and tenant feedback,
                        we streamline every aspect of property management. Our platform is
                        designed for ease, accessibility, and efficiency, all at an affordable price.

                        Whether you are a landlord looking to manage properties effortlessly or a
                        tenant seeking quick support, Dwella is here to transform your experience.
                    </p>
                </div>

                <div className="w-full md:w-1/2 flex justify-center">
                    <EllipseFour />
                </div>
            </div>
        </section>
    )
}

export default RevolutionizingRelationships
