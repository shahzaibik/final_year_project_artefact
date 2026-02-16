import { FaUser } from "react-icons/fa";
// feature list displayed in About section
const features = [
  {
    title: "AI-Powered Communication",
    description: "Instantly connect landlords, tenants, and workers for fast issue resolution.Smart notifications and reminders ensure everyone stays informed.",
  },
  {
    title: "Maintenance Management",
    description: "Instantly connect landlords, tenants, and workers for fast issue resolution.Smart notifications and reminders ensure everyone stays informed.",
  },
  {
    title: "Lease Management",
    description: "Securely store and share lease agreements and important documents.Streamline rent collection and payment tracking.",
  },
  {
    title: "Insightful Analytics",
    description: "Gain valuable insights into property performance and trends.Make data-driven decisions with ease.",
  },
  {
    title: "Vendor Management",
    description: "Access a network of trusted vendors and handymen ready to handle repairs and maintenance.",
  },
  {
    title: "Landlord-Tenant Management",
    description: "Effortlessly manage communication with tenants via the mobile app.Tenants can provide feedback, report issues, or request maintenance directly from their devices.",
  },
  {
    title: "Maintenance Management",
    description: "Submit and track maintenance requests in real-time.Match with skilled workers for timely repairs.",
  },
  {
    title: "Rent Management",
    description: "Collect and track rent payments automatically.Set up recurring billing and receive reminders for overdue payments.",
  },
];

export default function KeyFeatures() {
  return (
    <section className="py-16 bg-tertiary">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-8 md:mb-12">Key Features</h2>
        {/* <p className="text-primary mb-12">Who are in extremely love with eco friendly system.</p> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex items-center text-primary mb-4">
                <FaUser className="text-2xl mr-2" />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              <p className="text-primary text-left">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}