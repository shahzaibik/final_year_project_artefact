import Image from "next/image";

const EllipseTwo = () => {
    return (
        // circular background container
        <div className="relative flex items-center justify-center w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-secondary rounded-full mx-auto">
            
            <div className="relative -bottom-4">
                <Image
                    src="/ellipse2pic.png"
                    alt="Man Searching"
                    width={350}
                    height={350}
                />
            </div>
        </div>
    );
};

export default EllipseTwo;
