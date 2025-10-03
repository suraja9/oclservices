import React from 'react';

interface WavyDividerProps {
  className?: string;
  color?: string;
  flip?: boolean;
}

interface WavyDividerProps {
  className?: string;
  color?: string;
  flip?: boolean;
  text?: string;
}

const WavyDivider: React.FC<WavyDividerProps> = ({ 
  className = "", 
  color = "#374151", 
  flip = false,
  text = ""
}) => {
  return (
    <div className={`w-full flex justify-center items-center py-12 bg-gray-50 relative ${className}`}>
      <div className="w-full max-w-6xl px-4 relative">
        <svg
          width="100%"
          height="30"
          viewBox="0 0 800 30"
          className={`${flip ? 'rotate-180' : ''}`}
        >
          {/* Line with U-shaped curved ends pointing down */}
          <path
            d="M50,15 
               Q30,15 30,25 Q30,28 33,28 Q36,28 36,25 Q36,15 50,15
               L350,15
               L450,15
               L750,15 
               Q764,15 764,25 Q764,28 767,28 Q770,28 770,25 Q770,15 750,15
               L450,15
               L350,15
               L50,15"
            fill={color}
            stroke="none"
          />
          
          {/* Subtle shadow effect */}
          <path
            d="M50,17 
               Q32,17 32,26 Q32,29 35,29 Q38,29 38,26 Q38,17 50,17
               L350,17
               L450,17
               L750,17 
               Q762,17 762,26 Q762,29 765,29 Q768,29 768,26 Q768,17 750,17
               L450,17
               L350,17
               L50,17"
            fill={color}
            opacity="0.3"
          />
        </svg>
        
        {/* Text in the middle of the line */}
        {text && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gray-50 px-6 py-2 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 whitespace-nowrap">
                {text}
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WavyDivider;
