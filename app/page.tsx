import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import FeaturesAndServices from "@/components/Home/FeaturesAndServices";
import Handymen from "@/components/Home/Handymen";
import HeroSection from "@/components/Home/HeroSection";
import GetStarted from "@/components/Home/GetStarted";
// Landing page
export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-8">
        <HeroSection />
        <FeaturesAndServices />
        <Handymen />
        <GetStarted/>
      </div>
      <Footer />
    </>
  );
}
