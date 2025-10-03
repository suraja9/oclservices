import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Award, Users, ArrowRight, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import journeyData from "@/data/journey.json";

const Journey = () => {
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-brand-red bg-clip-text text-transparent">
            Our Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From a small courier service to India's leading logistics company - discover our story of growth and innovation
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-brand-red"></div>
          
          {journeyData.milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              className={`relative flex items-center mb-16 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg z-10"></div>
              
              {/* Content card */}
              <div className={`ml-12 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                <Card className="border-2 border-brand-red bg-success-light/10 hover:shadow-elegant transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-3xl font-bold text-primary">{milestone.year}</div>
                      <Calendar className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl">{milestone.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {milestone.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <h4 className="font-semibold text-sm">Key Achievements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {milestone.achievements.map((achievement, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="group-hover:bg-primary/5 transition-all duration-300"
                          onClick={() => setSelectedMilestone(milestone)}
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="border-2 border-brand-red bg-success-light/10 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl flex items-center space-x-3">
                            <span className="text-primary">{milestone.year}</span>
                            <span>-</span>
                            <span>{milestone.title}</span>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-brand-red/10 rounded-lg flex items-center justify-center">
                            <Award className="w-16 h-16 text-primary/50" />
                          </div>
                          
                          <p className="text-muted-foreground leading-relaxed">
                            {milestone.description}
                          </p>
                          
                          <div>
                            <h4 className="font-semibold mb-3">Major Achievements</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {milestone.achievements.map((achievement, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center space-x-3 p-3 border-2 border-brand-red/20 rounded-lg bg-success-light/5"
                                >
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                  <span className="text-sm">{achievement}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Future Vision */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="border-2 border-brand-red bg-gradient-to-br from-primary/5 to-brand-red/5">
            <CardHeader>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Looking Ahead</CardTitle>
                <p className="text-muted-foreground mt-2">
                  Our vision for the future of logistics
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border-2 border-brand-red/20 rounded-lg bg-success-light/5">
                  <h4 className="font-semibold text-lg mb-2">2025 Goals</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 50+ cities coverage</li>
                    <li>• 100% electric fleet</li>
                    <li>• AI-powered automation</li>
                  </ul>
                </div>
                
                <div className="text-center p-6 border-2 border-brand-red/20 rounded-lg bg-success-light/5">
                  <h4 className="font-semibold text-lg mb-2">Innovation Focus</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Drone deliveries</li>
                    <li>• Blockchain tracking</li>
                    <li>• Sustainable packaging</li>
                  </ul>
                </div>
                
                <div className="text-center p-6 border-2 border-brand-red/20 rounded-lg bg-success-light/5">
                  <h4 className="font-semibold text-lg mb-2">Global Expansion</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 25+ countries</li>
                    <li>• Regional hubs</li>
                    <li>• Local partnerships</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Journey;