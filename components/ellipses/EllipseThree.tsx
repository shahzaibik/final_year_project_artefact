import Image from "next/image";

const EllipseThree = () => {
    return (
        // Circular container for the image
        <div className="relative flex items-center justify-center w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-secondary rounded-full mx-auto">
            {/* Image wrapper to control positioning if needed later */}
            <div className="relative">
                <Image
                    src="/ellipse3pic.png"
                    alt="Handymen"
                    width={350}
                    height={350}
                />
            </div>
        </div>
    );
};

export default EllipseThree;
