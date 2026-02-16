import Image from "next/image";

const HeroEllipse = () => {
  return (
    // Circular hero background
    <div className="relative flex items-center justify-center w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-primary rounded-full mx-auto">
      {/* shift logo slightly to the right for visual balance */}
      <div className="relative -right-5 sm:-right-8 md:-right-10">
        <Image
          src="/logo.png"
          alt="Robot"
          width={300}
          height={300}
          priority
          className="transform scale-100 sm:scale-110 md:scale-125 animate-bounce"
        />
      </div>
    </div>
  );
};

export default HeroEllipse;
