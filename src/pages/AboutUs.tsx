import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Heart, Target, Award } from "lucide-react";
import communityImpactImg from "@/assets/community-impact.jpg";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              About Jovita Hub
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A charity-oriented content e-commerce service provider, dedicated to empowering creators and spreading positive impact around the world. We connect talented creators with opportunities while fostering a culture of giving.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                To make content creators wealthy first, then inspire and facilitate peer-to-peer charity that spreads positive impact around the world.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that when creators achieve financial success, they're empowered to make a real difference in the world. We create a community where successful creators support each other and give back to causes that matter. Every transaction on our platform is an opportunity to create wealth and spread positive impact.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden shadow-elegant">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/5jAcUIZhjaQ"
                  title="Jovita Hub Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border text-center hover:shadow-elegant transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Community First</h3>
              <p className="text-muted-foreground">
                We prioritize building a supportive community where creators can thrive and grow together.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border text-center hover:shadow-elegant transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Social Impact</h3>
              <p className="text-muted-foreground">
                Every project contributes to meaningful causes, making a real difference in communities worldwide.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border text-center hover:shadow-elegant transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Excellence</h3>
              <p className="text-muted-foreground">
                We maintain high standards in every project, ensuring quality content that exceeds expectations.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border text-center hover:shadow-elegant transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Fair Compensation</h3>
              <p className="text-muted-foreground">
                Creators deserve to be paid fairly. We ensure transparent and competitive rates for all work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Impact So Far</h2>
            <p className="text-lg text-muted-foreground">
              Together with our amazing community of creators, we've achieved incredible milestones.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">$2M+</div>
              <div className="text-muted-foreground">Paid to Creators</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Active Creators</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Videos Produced</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">$100K+</div>
              <div className="text-muted-foreground">Donated to Causes</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-glow to-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Be part of a movement where creativity meets purpose. Start your journey with us today.
            </p>
            <Link to="/join-creator">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Become a Creator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
