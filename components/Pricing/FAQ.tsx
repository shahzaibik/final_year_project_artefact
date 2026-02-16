'use client'
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
// static FAQ data
const faqs = [
    {
        question: "How does the 24/7 support feature work?",
        answer:
            "Our 24/7 support feature ensures you can reach out to us at any time, day or night, for assistance. Our AI chatbot and human representatives are always available.",
    },
    {
        question: "What types of problems can the AI chatbot assist with?",
        answer:
            "The AI chatbot can help with general inquiries, troubleshooting, account setup, and more. It's designed to provide instant solutions.",
    },
    {
        question: "Can I share images for better assistance?",
        answer:
            "Yes, you can upload images during chat sessions to provide more context, making it easier for us to assist you effectively.",
    },
    {
        question: "How secure is the information shared during chat support?",
        answer:
            "We take your privacy seriously. All shared information is encrypted and stored securely to ensure confidentiality.",
    },
    {
        question: "Can I access support on mobile?",
        answer:
            "Absolutely! Our support is fully optimized for mobile devices, ensuring you can get help on the go.",
    },
];

const FAQ = () => {

//  track of which FAQ item is currently open
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
// To toggle the FAQ item
    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        // main FAQ section
        <section className="py-8 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4">F.A.Q</h2>
                {/* Section Description */}
                <p className="text-primary text-lg mb-12">
                    With Tenants.ai, say goodbye to monotonous tasks and hello to streamlined processes
                    and exponential growth.
                </p>
{/* FAQ list */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border ${activeIndex === index ? "border-secondary" : "border-gray-200"
                                } rounded-lg bg-tertiary`}
                        >
                            <button
                                className="w-full flex justify-between items-center p-4 text-left text-primary font-semibold"
                                onClick={() => toggleFAQ(index)}
                            >
                                {faq.question}
                                <span
                                    className={`transition-transform ${activeIndex === index ? "rotate-180" : "rotate-0"
                                        }`}
                                >
                                    <FaChevronDown/>
                                </span>
                            </button>
                            {activeIndex === index && (
                                <div className="px-4 pb-4 text-primary text-sm">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
