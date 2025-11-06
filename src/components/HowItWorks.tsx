import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: FileText,
    title: "Submit Your Work",
    description: "Script writers share compelling stories. Video editors showcase their editing skills. Get matched with complementary talents.",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Collaborate & Create",
    description: "Work together on impactful short-form videos. Our platform facilitates seamless collaboration between writers and editors.",
    color: "text-accent",
  },
  {
    icon: TrendingUp,
    title: "Earn & Impact",
    description: "Get paid for your work while contributing to social causes. Your content creates meaningful change and generates income.",
    color: "text-secondary",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to start creating impactful content and earning
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="relative p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card border-border"
            >
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                  {index + 1}
                </div>
              </div>
              
              <div className="mt-8">
                <step.icon className={`w-12 h-12 mb-4 ${step.color}`} />
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Learn Details Buttons */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-8">
            Project Opportunities Now
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-3xl mx-auto">
            <Link to="/script-writers" className="flex-1">
              <Button variant="default" size="lg" className="w-full">
                For Script Writers
              </Button>
            </Link>
            <Link to="/video-creators" className="flex-1">
              <Button variant="default" size="lg" className="w-full">
                For Video Creators
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
