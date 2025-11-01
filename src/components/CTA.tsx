import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary-glow to-accent relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Start Creating Impact?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-12">
            Join thousands of script writers and video editors who are building meaningful careers while making a difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-background/95 border-0 text-foreground h-12 text-base"
            />
            <Button 
              variant="secondary" 
              size="lg"
              className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground group whitespace-nowrap"
            >
              Get Started
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="text-sm text-primary-foreground/80">
            No credit card required. Start creating in minutes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
