import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import FeatureCards from "@/components/FeatureCards";
import TrackingSection from "@/components/TrackingSection";
import Footer from "@/components/Footer";
import WavyDivider from "@/components/WavyDivider";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Index = () => {
  const heroAnimation = useScrollAnimation();
  const featuresAnimation = useScrollAnimation();
  const trackingAnimation = useScrollAnimation();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div ref={heroAnimation.ref} className={`transition-all duration-700 ${heroAnimation.className}`}>
        <HeroCarousel />
      </div>
      <div ref={featuresAnimation.ref} className={`transition-all duration-700 ${featuresAnimation.className}`}>
        <FeatureCards />
      </div>
      
      {/* Line Divider with Text */}
      <WavyDivider text="Track Your Package" />
      
      <div ref={trackingAnimation.ref} className={`transition-all duration-700 ${trackingAnimation.className}`}>
        <TrackingSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
