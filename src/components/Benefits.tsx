import { Card } from "@/components/ui/card";
import { DollarSign, Heart, Sparkles, Shield, Users2, Zap } from "lucide-react";
import communityImage from "@/assets/community-impact.jpg";

const benefits = [
  {
    icon: DollarSign,
    title: "Earn Fair Compensation",
    description: "Get paid what you deserve. Transparent pricing and direct payments for your creative work.",
  },
  {
    icon: Heart,
    title: "Make Real Impact",
    description: "Your content contributes to charitable causes. See the tangible difference you're making.",
  },
  {
    icon: Sparkles,
    title: "Build Your Portfolio",
    description: "Showcase your best work. Gain recognition and grow your creative reputation.",
  },
  {
    icon: Shield,
    title: "Protected Collaboration",
    description: "Safe and secure platform. Clear agreements and intellectual property protection.",
  },
  {
    icon: Users2,
    title: "Join a Community",
    description: "Connect with like-minded creators. Network, learn, and grow together.",
  },
  {
    icon: Zap,
    title: "Quick Turnaround",
    description: "Efficient workflows and fast payments. Focus on creating, we handle the rest.",
  },
];

const Benefits = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Creators Choose{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EP ℇC Jovita Hub
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A platform designed specifically for script writers and video editors who want more than just a paycheck
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border-border"
              >
                <benefit.icon className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl rounded-full" />
            <img 
              src={communityImage} 
              alt="Community collaboration and impact visualization" 
              className="relative rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
