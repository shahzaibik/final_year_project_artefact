import Image from "next/image";
import Link from "next/link";
import Routes from "@/constants/routes";

const Footer = () => {
  return (
    // Wrapper background
    <div className="bg-tertiary">
      {/* Main footer container */}
      <footer className="bg-primary text-white pb-12 md:pb-20 pt-6 px-4 sm:px-6 md:px-8 lg:px-16 rounded-t-3xl">
        {/* Top section: Logo + Directory */}
        <div className="container mx-auto mb-2 flex flex-col md:flex-row items-start justify-between">
          {/* Left side: Logo + Description */}
          <div className="space-y-4">
            {/* Logo and Title */}
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Tenants AI Logo"
                width={96}
                height={96}
                className="object-contain"
              />
              <Link href={Routes.HOME}>
                <h1 className="text-xl font-serif hover:text-secondary">Dwella</h1>
              </Link>


            </div>
            <p className="max-w-sm text-xs sm:text-sm pt-8 md:pt-14">
              Empowering Landlords, Tenants, and Handymen to thrive with Smart Automation
            </p>
          </div>


          <div className="mt-6 md:mt-0 md:mr-16">
            <h3 className="font-bold mb-6">Directory</h3>
            <ul className="space-y-6 text-sm">
              <li>
                <Link href={Routes.PRICING} className="hover:text-secondary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href={Routes.FEATURES} className="hover:text-secondary">
                  Features
                </Link>
              </li>
              <li>
                <Link href={Routes.DEMO} className="hover:text-secondary">
                  Demo
                </Link>
              </li>
              <li>
                <Link href={Routes.ABOUT} className="hover:text-secondary">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* horizontal line */}
        <div className="border-t border-white mx-2 md:mx-4"></div>
        {/* Copyright text */}
        <p className="text-xs sm:text-sm mt-2 text-center md:text-left">Dwella, All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Footer;