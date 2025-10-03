import { useState, useEffect, useRef } from "react";
import { Search, Package, MapPin, Truck, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import homeVideo from "@/assets/homevideo.mp4";

const TrackingSection = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [moduleLoaded, setModuleLoaded] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleAnimation = useScrollAnimation();
  
  // Demo tracking data
  const demoTrackingData = {
    trackingNumber: "DX123456789",
    status: "In Transit",
    estimatedDelivery: "Dec 25, 2024",
    currentLocation: "Mumbai Distribution Center",
    timeline: [
      { status: "Package Received", location: "Delhi Hub", time: "Dec 22, 2:30 PM", completed: true },
      { status: "In Transit", location: "Mumbai Distribution Center", time: "Dec 23, 8:15 AM", completed: true },
      { status: "Delivered", location: "Destination Address", time: "Expected by 6:00 PM", completed: false },
    ]
  };

  // Trigger entrance animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setModuleLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Scroll-based video control
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let hasPlayedOnce = false;

    const handleScroll = () => {
      if (!videoRef.current || !sectionRef.current) return;

      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      
      // Get section position
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const sectionTop = sectionRect.top + window.scrollY;
      const sectionHeight = sectionRect.height;
      const windowHeight = window.innerHeight;
      
      // Check if section is in viewport
      const sectionInView = sectionRect.top < windowHeight && sectionRect.bottom > 0;
      
      // Fade in video when section comes into view
      if (sectionInView && !videoVisible) {
        setVideoVisible(true);
      }
      
      // Video control logic
      if (sectionInView) {
        if (scrollingDown && !hasPlayedOnce) {
          // Play video when scrolling down and hasn't played yet
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(console.error);
          hasPlayedOnce = true;
        } else if (!scrollingDown && hasPlayedOnce) {
          // Reset when scrolling up
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
          hasPlayedOnce = false;
        }
      }
      
      lastScrollY = currentScrollY;
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [videoVisible]);

  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setIsTracking(true);
      // TODO: Replace with Supabase API call
      setTimeout(() => {
        setIsTracking(false);
        setShowResults(true);
      }, 1500);
    }
  };

  const handleClearTracking = () => {
    setTrackingNumber("");
    setShowResults(false);
  };

  return (
    <section 
      ref={sectionRef}
      id="tracking-section" 
      className="pt-8 pb-20 bg-gradient-to-br from-slate-50 to-blue-50/30 relative overflow-hidden min-h-[70vh]"
    >
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Two-Column Layout - No Title */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">
          
          {/* Left Column - Free Video (NO CONTAINER) */}
          <div className="relative">
            {/* Video - COMPLETELY FREE - NO BORDERS, NO BOX */}
            <video
              ref={videoRef}
              className={`w-full aspect-video object-cover transition-opacity duration-1000 ${
                videoVisible ? 'opacity-100' : 'opacity-0'
              }`}
              muted
              playsInline
              preload="metadata"
              onLoadedData={() => console.log('Video loaded')}
              onError={(e) => console.error('Video error:', e)}
            >
              <source src={homeVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Simple loading overlay - only when video not visible */}
            {!videoVisible && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <Package className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                  <p className="text-lg">Loading Video...</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Tracking Module */}
          <div className="flex justify-end">
            <div className={`w-full max-w-md transition-all duration-1000 ease-out ${
              moduleLoaded 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              
              {/* Floating Tracking Form */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_70px_-12px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1 relative">
                {/* Cross Button */}
                {(trackingNumber || showResults) && (
                  <button
                    onClick={handleClearTracking}
                    className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                    aria-label="Clear tracking"
                  >
                    <X className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
                  </button>
                )}
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Track Your Package</h3>
                  <p className="text-gray-600 text-sm">Enter your tracking number below</p>
                </div>

                <form onSubmit={handleTracking} className="space-y-4">
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Enter tracking number (e.g., DX123456789)"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl shadow-inner focus:shadow-lg focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500"
                      required
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold border-0"
                      disabled={isTracking}
                    >
                      {isTracking ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Tracking...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Search className="w-5 h-5" />
                          <span>Track Package</span>
                        </div>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Try demo: <span 
                      className="font-mono text-blue-600 cursor-pointer hover:text-blue-800 transition-colors" 
                      onClick={() => setTrackingNumber("DX123456789")}
                    >
                      DX123456789
                    </span>
                  </p>
                </form>
          </div>

              {/* Compact Status Results */}
              {showResults && (
                <div className={`mt-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] transition-all duration-700 ease-out ${
                  showResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  
                  {/* Package Status Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">Package Status</h4>
                      <p className="text-xs text-gray-500">#{demoTrackingData.trackingNumber}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                        <Truck className="w-4 h-4" />
                        <span className="text-sm">{demoTrackingData.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Est: {demoTrackingData.estimatedDelivery}
                      </p>
                    </div>
                  </div>

                  {/* Current Location - Compact */}
                  <div className="mb-4 p-3 bg-blue-50/50 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 text-sm">Current Location</p>
                        <p className="text-gray-600 text-xs truncate">{demoTrackingData.currentLocation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Compact Timeline */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-800 text-sm">Timeline</h5>
                    
                    <div className="space-y-2">
                      {demoTrackingData.timeline.map((event, index) => (
                        <div key={index} className="flex items-start space-x-3 group hover:bg-gray-50/50 p-2 rounded-lg transition-colors duration-200">
                          {/* Compact Timeline indicator */}
                          <div className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                              event.completed 
                                ? "bg-blue-600 text-white shadow-lg" 
                                : "bg-gray-300"
                            }`}>
                              {event.completed ? (
                                <CheckCircle className="w-2.5 h-2.5" />
                              ) : (
                                <Package className="w-2 h-2" />
                              )}
                            </div>
                            {index < demoTrackingData.timeline.length - 1 && (
                              <div className={`w-0.5 h-6 mt-1 transition-all duration-300 ${
                                event.completed ? "bg-blue-600" : "bg-gray-300"
                              }`}></div>
                            )}
                          </div>
                          
                          {/* Compact Event details */}
                          <div className="flex-1 min-w-0">
                            <h6 className={`font-semibold text-xs ${
                              event.completed ? "text-blue-600" : "text-gray-500"
                            }`}>
                              {event.status}
                            </h6>
                            <p className="text-xs text-gray-500 truncate">{event.location}</p>
                            <p className="text-xs text-gray-400">{event.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackingSection;