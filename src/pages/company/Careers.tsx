import { MapPin, Users, Coffee, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Careers() {
  const navigate = useNavigate();

  const openPositions = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      description: "Join our engineering team to build the next generation of property management tools."
    },
    {
      title: "Product Manager",
      department: "Product", 
      location: "New York, NY / Remote",
      type: "Full-time",
      description: "Drive product strategy and roadmap for our growing PropManagement platform."
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Great Team Culture",
      description: "Work with passionate, talented people who care about making a difference"
    },
    {
      icon: Coffee,
      title: "Flexible Work Environment", 
      description: "Remote-first culture with flexible hours and unlimited PTO"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Help us revolutionize property management while building your career with a team that values innovation, collaboration, and growth.
          </p>
          <Button 
            size="lg" 
            className="bg-[#ea384c] hover:bg-[#d31c3f]"
            onClick={() => navigate('/contact')}
          >
            View Open Positions
          </Button>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Work With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-[#ea384c] to-[#d31c3f] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Open Positions
          </h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <span className="bg-slate-100 px-3 py-1 rounded-full">
                          {position.department}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {position.location}
                        </span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                          {position.type}
                        </span>
                      </div>
                      <p className="text-gray-700">
                        {position.description}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <Button 
                        variant="outline" 
                        className="border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white"
                        onClick={() => navigate('/contact')}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}