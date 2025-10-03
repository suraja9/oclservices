import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import heroData from "@/data/hero.json";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const heroImages = [hero1, hero2, hero3];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroData.slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroData.slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroData.slides.length) % heroData.slides.length);
  };

  const scrollToTracking = () => {
    // TODO: Replace with actual scroll to tracking section
    const trackingSection = document.getElementById("tracking-section");
    if (trackingSection) {
      trackingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCTAClick = (action: string) => {
    if (action === "scroll-to-tracking") {
      scrollToTracking();
    } else if (action === "open-modal") {
      setIsModalOpen(true);
    }
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {heroData.slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
              index === currentSlide ? "translate-x-0" : 
              index < currentSlide ? "-translate-x-full" : "translate-x-full"
            }`}
          >
            {/* Background Image with Parallax Effect */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${heroImages[index]})`,
                transform: `translateY(${index === currentSlide ? 0 : 50}px)`,
                transition: "transform 1s ease-out"
              }}
            >
              {/* Overlay removed */}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl animate-fade-in">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    {slide.subtitle}
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                    {heroData.buttons.map((button) => (
                      <Button
                        key={button.text}
                        className={
                          button.type === "primary" 
                            ? "daakbox-btn-primary" 
                            : "daakbox-btn-outline bg-white/10 text-white border-white hover:bg-white hover:text-primary"
                        }
                        onClick={() => handleCTAClick(button.action)}
                        size="lg"
                      >
                        {button.text}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="bg-white/20 text-white hover:bg-white/30 rounded-full p-2"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>
      
      <div className="absolute inset-y-0 right-4 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="bg-white/20 text-white hover:bg-white/30 rounded-full p-2"
          onClick={nextSlide}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroData.slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white scale-125" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Auto-play Toggle */}
      <div className="absolute bottom-8 right-8">
        <Button
          variant="ghost"
          size="sm"
          className="bg-white/20 text-white hover:bg-white/30 rounded-full p-2"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        >
          <Play className={`w-4 h-4 ${isAutoPlaying ? "opacity-100" : "opacity-50"}`} />
        </Button>
      </div>

      {/* App Download Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="daakbox-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Download OCL SERVICES App</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Get our mobile app for easy package tracking and management on the go.
            </p>
            <div className="flex justify-center">
              <img 
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                className="h-16 hover:scale-105 transition-transform cursor-pointer"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Coming soon to iOS App Store
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroCarousel;