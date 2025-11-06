import { Heart, Users, Target, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Charity = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-6">
            <Heart className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Making a Difference Together
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            At Jovita Hub, we believe in the power of collective action. Every project we undertake includes a charitable component, 
            ensuring that our work creates positive impact beyond the creative industry.
          </p>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Charitable Approach</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Direct Impact</h3>
              <p className="text-muted-foreground">
                A portion of every project goes directly to vetted charitable organizations, 
                ensuring immediate and measurable impact in communities that need it most.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Choice</h3>
              <p className="text-muted-foreground">
                Our creators and clients have a voice in selecting the causes we support, 
                creating a sense of shared purpose and community engagement.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparent Reporting</h3>
              <p className="text-muted-foreground">
                We provide regular updates and transparent reporting on all charitable contributions, 
                so you can see exactly how your work is making a difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Focus Areas</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-lg border border-border">
              <h3 className="text-2xl font-semibold mb-4">Education & Skills Development</h3>
              <p className="text-muted-foreground mb-4">
                Supporting programs that provide educational opportunities and skills training to underserved communities, 
                helping individuals build careers in creative industries.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Scholarships for creative education</li>
                <li>• Equipment donations to schools</li>
                <li>• Mentorship programs</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-lg border border-border">
              <h3 className="text-2xl font-semibold mb-4">Community Development</h3>
              <p className="text-muted-foreground mb-4">
                Investing in local communities by supporting organizations that address fundamental needs 
                and create opportunities for growth and prosperity.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Local nonprofit partnerships</li>
                <li>• Youth empowerment programs</li>
                <li>• Small business support initiatives</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-lg border border-border">
              <h3 className="text-2xl font-semibold mb-4">Creative Arts Access</h3>
              <p className="text-muted-foreground mb-4">
                Making creative tools, technology, and opportunities accessible to aspiring artists and creators 
                who lack resources but have tremendous potential.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Software licensing programs</li>
                <li>• Equipment lending libraries</li>
                <li>• Community creative spaces</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-lg border border-border">
              <h3 className="text-2xl font-semibold mb-4">Environmental Sustainability</h3>
              <p className="text-muted-foreground mb-4">
                Supporting organizations working to protect our planet and promote sustainable practices 
                within the creative industry and beyond.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Green production initiatives</li>
                <li>• Carbon offset programs</li>
                <li>• Environmental education</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Charitable Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">$250K+</div>
              <p className="text-muted-foreground">Total Donated</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Organizations Supported</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1,000+</div>
              <p className="text-muted-foreground">Lives Impacted</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Transparency</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Join Us in Making a Difference</h2>
          <p className="text-lg text-muted-foreground mb-8">
            When you work with Jovita Hub, you're not just creating great content—you're contributing to positive change in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/join-creator">
              <Button size="lg" className="w-full sm:w-auto">
                Become a Creator
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Charity;
