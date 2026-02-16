import { MdCheckCircle } from "react-icons/md";

const SubscriptionPlans = () => {
  return (
    // Main subscription section
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Section heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4">
          Our Subscription Plans
        </h2>
        {/* Short description */}
        <p className="text-primary text-lg mb-12">
          Everything you need to manage your rentals
        </p>
{/*  grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
{/* Plan Card 1 */}
          <div className="border-2 border-secondary rounded-xl bg-white p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-primary mt-2 mb-4">Standard Plan</h3>
            {/* Pricing */}
            <p className="text-4xl font-bold text-primary mb-7 text-start">
              $30 <span className="text-base font-normal">/ tenant/ month</span>
            </p>
            {/* Plan features */}
            <ul className="text-primary text-start space-y-3 mb-12">
              <li className="flex items-center">
                <MdCheckCircle className="mr-2 text-secondary" />Limited issues
              </li>
              <li className="flex items-center">
                <MdCheckCircle className="mr-2 text-secondary" />Limited area
              </li>
              <li className="flex items-center">
                <MdCheckCircle className="mr-2 text-secondary" />Limited for one year
              </li>
            </ul>
             {/* Subscribe button */}
            <button className="bg-secondary text-primary border border-secondary font-bold py-2 mb-4 w-full rounded-md hover:bg-white hover:border-primary">
              Subscribe
            </button>
          </div>

          <div className="border-2 border-secondary rounded-xl bg-primary p-6 shadow-lg text-white">
            <h3 className="text-xl font-semibold mt-2 mb-4">Standard Plan</h3>
            <p className="text-4xl font-bold mb-7 text-start">
              $20 <span className="text-base font-normal">/ tenant/ month</span>
            </p>
            <ul className="text-start space-y-3 mb-12">
              <li className="flex items-center">
                <MdCheckCircle className="mr-2 text-secondary" />Limited issues
              </li>
              <li className="flex items-center">
                <MdCheckCircle className="mr-2 text-secondary" />Limited area
              </li>
              <li className="flex items-center">
                <MdCheckCircle className="mr-2 text-secondary" />Limited for one year
              </li>
            </ul>
            <button className="bg-secondary text-primary font-bold py-2 mb-4 w-full rounded-md hover:bg-white">
              Subscribe
            </button>
          </div>

          <div className="border-2 border-white rounded-xl bg-secondary p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-primary mt-2 mb-4">Premium Plan</h3>
            <p className="text-4xl font-bold text-primary mb-7 text-start">
              $50 <span className="text-base font-normal">/ tenant/ month</span>
            </p>
            <ul className="text-primary text-left space-y-3 mb-12">
              <li className="flex items-center">
                <MdCheckCircle className="mr-2" />Limited issues
              </li>
              <li className="flex items-center">
                <MdCheckCircle className="mr-2" />Limited area
              </li>
              <li className="flex items-center">
                <MdCheckCircle className="mr-2" />Limited for one year
              </li>
            </ul>
            <button className="bg-primary text-white font-bold py-2 mb-4 w-full rounded-md hover:bg-white hover:text-primary">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;