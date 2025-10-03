import { Search, MapPin, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";
import trackTraceIcon from "@/assets/track-trace-icon.jpg";
import pickupTruckIcon from "@/assets/pickup-truck-icon.jpg";
import logisticsBg from "@/assets/logistics-bg.jpg";

const features = [
  {
    id: 1,
    title: "Track & Trace",
    description: "Real-time package tracking with detailed status updates and delivery notifications across all delivery networks",
    icon: trackTraceIcon,
    image: trackTraceIcon,
    link: "/track"
  },
  {
    id: 3,
    title: "Schedule Pickup",
    description: "Book doorstep pickup services with flexible timing, instant confirmation, and real-time tracking support",
    icon: pickupTruckIcon,
    image: pickupTruckIcon,
    link: "/schedule-pickup"
  }
];

const FeatureCards = () => {
  const titleAnimation = useScrollAnimation();
  const cardAnimations = useStaggeredAnimation(3, 200);
  const ctaAnimation = useScrollAnimation({ delay: 600 });

  return (
    <section className="ocl-section relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url(${logisticsBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      <div className="ocl-container relative z-10">
        <div ref={titleAnimation.ref} className={`text-center mb-8 transition-all duration-700 ${titleAnimation.className}`}>
          {/* Horizontal Line with Centered Text Box */}
          <div className="relative flex items-center justify-center mb-6">
            {/* Left Line */}
            <div 
              className="flex-1 h-0.5 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
              style={{ backgroundColor: '#0D1C48' }}
            ></div>
            
            {/* Text Box */}
            <div 
              className="relative mx-4 px-6 py-3 border-2 rounded-lg bg-white"
              style={{ 
                borderColor: '#0D1C48',
                borderRadius: '8px'
              }}
            >
              <h2 
                className="text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap"
                style={{ color: '#0D1C48' }}
              >
                Our Core Services
              </h2>
            </div>
            
            {/* Right Line */}
            <div 
              className="flex-1 h-0.5 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
              style={{ backgroundColor: '#0D1C48' }}
            ></div>
          </div>
          
          <p className="ocl-text max-w-2xl mx-auto">
            Comprehensive courier and logistics solutions tailored to meet your business needs with speed, security, and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              ref={cardAnimations[index].ref} 
              className={`transition-all duration-700 ${cardAnimations[index].className}`}
            >
              <Card 
                className="group relative overflow-hidden h-full border-0 border-b-4 border-b-primary bg-gradient-to-br from-card to-accent shadow-lg rounded-t-lg rounded-b-none"
              >
                {/* Feature Image */}
                <div className="relative h-36 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Feature Icon */}
                  <div className="absolute top-3 right-3 w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-primary">
                    <img 
                      src={feature.icon} 
                      alt={`${feature.title} icon`}
                      className="w-5 h-5"
                    />
                  </div>
                </div>

                <CardContent className="p-6 bg-transparent">
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-3 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                  
                  <Button 
                    variant="learn-more" 
                    size="sm" 
                    className="w-full justify-center group/btn cursor-pointer"
                    onClick={() => window.location.href = feature.link}
                  >
                    <span>Learn More</span>
                    <svg 
                      className="ml-2 w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div ref={ctaAnimation.ref} className={`text-center transition-all duration-700 ${ctaAnimation.className}`}>
          <div className="border-0 border-b-4 border-b-primary bg-gradient-to-br from-card to-accent shadow-lg rounded-t-lg rounded-b-none p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-foreground mb-3">
              Need Help Choosing the Right Service?
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Our expert team is ready to help you find the perfect logistics solution for your specific needs.
            </p>
            <Button variant="learn-more" size="sm" className="px-6 py-2">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;