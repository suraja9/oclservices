import React from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Circle, 
  Package, 
  Truck, 
  Plane, 
  MapPin,
  Clock
} from "lucide-react";

interface TimelineEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

interface TimelineProps {
  timeline: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ timeline }) => {
  const getStatusIcon = (status: string, isCompleted: boolean) => {
    const iconClass = `w-5 h-5 ${isCompleted ? 'text-success' : 'text-muted-foreground'}`;
    
    switch (status.toLowerCase()) {
      case 'order placed':
        return <Package className={iconClass} />;
      case 'picked up':
        return <Truck className={iconClass} />;
      case 'in transit':
        return <Plane className={iconClass} />;
      case 'out for delivery':
        return <Truck className={iconClass} />;
      case 'delivered':
        return <CheckCircle className={iconClass} />;
      default:
        return isCompleted ? <CheckCircle className={iconClass} /> : <Circle className={iconClass} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventCompleted = (index: number) => {
    // All events except the last one are completed, or if last event is "Delivered"
    return index < timeline.length - 1 || timeline[timeline.length - 1].status.toLowerCase() === 'delivered';
  };

  return (
    <div className="border-2 border-brand-red bg-background/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-brand-red" />
        Tracking Timeline
      </h3>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
        
        <div className="space-y-6">
          {timeline.map((event, index) => {
            const isCompleted = isEventCompleted(index);
            const isLast = index === timeline.length - 1;
            
            return (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Timeline dot */}
                <div className={`
                  relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 
                  ${isCompleted 
                    ? 'bg-success border-success' 
                    : isLast 
                    ? 'bg-primary border-primary animate-pulse' 
                    : 'bg-background border-border'
                  }
                `}>
                  {getStatusIcon(event.status, isCompleted)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold ${isCompleted ? 'text-success' : 'text-foreground'}`}>
                      {event.status}
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-brand-red" />
                    <span className="text-sm font-medium">{event.location}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};