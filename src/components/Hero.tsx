import { Button } from "@/components/ui/button";
import { ArrowRight, Video, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-collaboration.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Creative professionals collaborating on video content" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-foreground">Now Accepting Creators</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Create Impact Through{" "}
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Short Videos
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Join Jovita Hub—where script writers and video editors collaborate 
            to create meaningful short-form content while earning and making a difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/join-creator">
              <Button variant="hero" size="lg" className="text-lg group">
                Join as Creator
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="text-lg">
                Learn More
              </Button>
            </a>
          </div>

          <div className="flex flex-wrap gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary border-2 border-background" />
                <div className="w-8 h-8 rounded-full bg-accent border-2 border-background" />
                <div className="w-8 h-8 rounded-full bg-secondary border-2 border-background" />
              </div>
              <span className="text-muted-foreground">500+ Active Creators</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">10K+ Videos Created</span>
            </div>
            <div className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-accent" />
              <span className="text-muted-foreground">Content That Matters</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
