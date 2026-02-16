import Routes from "@/constants/routes";
import Link from "next/link";

const GetStarted = () => {
    return (
        // Outer wrapper to center the card section
        <div className="flex justify-center items-center bg-white pt-16 pb-24 px-4">
            <div className="max-w-3xl w-full bg-tertiary shadow-md rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8 text-center">
                {/* Section Heading */}
                <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">Get Started Today</h2>
                {/* Section Description */}
                <p className="text-primary mb-6">
                    Revolutionize your property management experience with Dwella. Sign up
                    today and start managing your properties more efficiently, all from the palm
                    of your hand.
                </p>
                {/* Action Buttons */}
                <div className="flex justify-center">
                    <Link href={Routes.SIGNUP}>
                        <button className="bg-secondary text-primary font-semibold px-6 py-3 border border-secondary rounded-lg hover:bg-white">
                            SIGN UP AS LANDLORD
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GetStarted;  