'use client'

import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";
// testimonial data displayed in the bbout section
const testimonials = [
  {
    id: 1,
    name: "John Doe",
    image: "/tempPic.png",
    rating: 5,
    review: "Great service and amazing team!",
  },
  {
    id: 2,
    name: "Jane Smith",
    image: "/tempPic.png",
    rating: 4,
    review: "Very satisfied with the support provided.",
  },
  {
    id: 3,
    name: "Alice Brown",
    image: "/tempPic.png",
    rating: 5,
    review: "Highly recommended for their professionalism!",
  },
];

export default function Testimonials() {

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  });

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-8 md:py-16 relative px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-8 md:mb-14">
          What Our Clients Say
        </h2>
        <div className="relative overflow-hidden mb-14">
          <div
            className="flex transition-transform duration-700"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="min-w-full px-4 sm:px-8 py-8 sm:py-12 bg-tertiary border border-gray-200 rounded-lg shadow-md"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-28 h-28 rounded-full object-cover"
                  />
                </div>
                <p className="font-bold text-primary">{testimonial.name}</p>
                <div className="flex justify-center mb-4 text-yellow-500">
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <FaStar key={index} />
                  ))}
                </div>
                <p className="text-primary">{testimonial.review}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-0 sm:left-4 transform -translate-y-1/2 bg-tertiary p-3 sm:p-4 rounded-full shadow-md hover:bg-white text-primary"
          aria-label="Previous Testimonial"
        >
          <FaChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-0 sm:right-4 transform -translate-y-1/2 bg-tertiary p-3 sm:p-4 rounded-full shadow-md hover:bg-white text-primary"
          aria-label="Next Testimonial"
        >
          <FaChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
