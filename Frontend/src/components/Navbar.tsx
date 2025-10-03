import { useState, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import navData from "@/data/nav.json";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-20">
        {/* Left Section - Maroon Logo Area */}
        <div className="bg-maroon-800 flex items-center px-8 relative">
          <a href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-300">
            <img 
              src="/assets/ocl-logo.png" 
              alt="OCL SERVICES" 
              className="h-16 w-auto filter brightness-0 invert"
            />
            <div className="text-center">
              <div className="text-xl font-bold text-white leading-tight">
                OCL SERVICES
              </div>
              <div className="text-xs text-white/90 -mt-1">
                Courier & Logistics
              </div>
            </div>
          </a>
          {/* Vertical Divider */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-300"></div>
        </div>

        {/* Right Section - Menu Items */}
        <div className="flex-1 flex items-center justify-end px-8">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navData.navigation.map((item) => (
              <div 
                key={item.label} 
                className="relative group"
                onMouseEnter={() => item.type === "dropdown" && handleMouseEnter(item.label)}
                onMouseLeave={() => item.type === "dropdown" && handleMouseLeave()}
              >
                {item.type === "dropdown" ? (
                  <>
                    <button className="flex items-center space-x-1 px-4 py-2 text-gray-800 hover:text-maroon-800 font-medium transition-colors duration-200">
                      <span>{item.label}</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {activeDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        {item.items?.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-maroon-800 transition-colors duration-200"
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className={`px-6 py-3 font-semibold transition-all duration-200 ${
                      item.type === "cta" 
                        ? "bg-white text-maroon-800 border-2 border-maroon-800 rounded-lg hover:bg-maroon-800 hover:text-white shadow-sm hover:shadow-md"
                        : "text-gray-800 hover:text-maroon-800"
                    }`}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 hover:text-maroon-800 hover:bg-gray-50"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navData.navigation.map((item) => (
              <div key={item.label}>
                {item.type === "dropdown" ? (
                  <div>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                      className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-800 hover:bg-gray-50 hover:text-maroon-800 rounded-lg transition-colors duration-200"
                    >
                      <span className="font-medium">{item.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      }`} />
                    </button>
                    
                    {activeDropdown === item.label && (
                      <div className="mt-2 ml-4 space-y-1">
                        {item.items?.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-maroon-800 rounded-lg transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      item.type === "cta" 
                        ? "bg-maroon-800 text-white hover:bg-maroon-900 text-center"
                        : "text-gray-800 hover:bg-gray-50 hover:text-maroon-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;