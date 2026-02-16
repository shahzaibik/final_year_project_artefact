import Image from "next/image";

const EllipseFour = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Circular background container */}
      <div className="w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-secondary rounded-full mx-auto">
        {/* Image inside the circle */}
        <Image
          src="/ellipse4pic.png"
          alt="Property"
          width={460}
          height={460}
          className=" translate-x-[-12%] translate-y-[60%]"
        />
      </div>
    </div>
  );
};

export default EllipseFour;
