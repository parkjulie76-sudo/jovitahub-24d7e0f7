import { Compass, Lightbulb, Shield, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Mission = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-6">
            <Compass className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Our Mission
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            To make content creators wealthy first , then inspire and facilitate peer-to-peer charity that spreads positive impact around the world.
          </p>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Vision</h2>
            <p className="text-lg text-muted-foreground text-center leading-relaxed">
              We envision a world where content creators achieve financial abundance and use their wealth to create ripples 
              of positive change. When creators become wealthy, they're empowered to give back—not through corporate mandates, 
              but through genuine peer-to-peer charity. Through our content e-commerce platform, we're building a community 
              where financial success and charitable impact grow together, one creator at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Principles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Innovation & Excellence</h3>
                  <p className="text-muted-foreground">
                    We push the boundaries of creative content production, constantly innovating to deliver 
                    exceptional quality that exceeds expectations. Our commitment to excellence drives every 
                    project from concept to completion.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Integrity & Transparency</h3>
                  <p className="text-muted-foreground">
                    We operate with complete honesty and transparency in all our dealings. From fair payment 
                    structures to open communication about charitable contributions, we believe trust is built 
                    through consistent integrity.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Creator Wealth First</h3>
                  <p className="text-muted-foreground">
                    We prioritize making creators wealthy through our content e-commerce platform. We believe 
                    that financial success enables creators to make meaningful contributions to causes they care 
                    about. Wealth creation comes first, charitable impact follows naturally.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Compass className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Peer-to-Peer Charity</h3>
                  <p className="text-muted-foreground">
                    We encourage and facilitate peer-to-peer charity among our creator community. When creators 
                    achieve wealth, we inspire them to support fellow creators and causes they're passionate about. 
                    This creates an organic culture of giving that spreads positive impact worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-3">Build Creator Wealth Through E-Commerce</h3>
              <p className="text-muted-foreground">
                Our content e-commerce platform connects creators with monetization opportunities that generate real wealth. 
                We've designed systems that maximize creator earnings through efficient content transactions and fair 
                compensation structures. Your financial success is our top priority.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-3">Enable Peer-to-Peer Charity</h3>
              <p className="text-muted-foreground">
                Once creators achieve financial success, we facilitate peer-to-peer charitable giving. Our platform 
                makes it easy for wealthy creators to support fellow creators and causes they believe in. This organic 
                approach to charity creates authentic impact driven by individual passion.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-3">Cultivate a Giving Culture</h3>
              <p className="text-muted-foreground">
                We inspire successful creators to become philanthropists within our community. By showcasing the positive 
                impact of peer-to-peer giving, we're building a culture where wealth creation and charitable action 
                reinforce each other, spreading positive change worldwide.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-3">Empower Through Financial Freedom</h3>
              <p className="text-muted-foreground">
                Financial independence gives creators the power to make meaningful choices. We provide the platform, 
                tools, and community support needed for creators to build sustainable wealth that enables both personal 
                freedom and the ability to give back on their own terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-12 rounded-2xl border border-border text-center">
            <h2 className="text-3xl font-bold mb-6">Our Commitment to You</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We're committed to making you wealthy first. Our content e-commerce platform is designed to maximize your 
              earnings and build lasting financial success. Once you achieve wealth, we'll support you in creating your 
              own charitable impact through peer-to-peer giving. Together, we'll prove that creator wealth and positive 
              world impact are not just compatible—they're complementary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/join-creator">
                <Button size="lg" className="w-full sm:w-auto">
                  Join Our Community
                </Button>
              </Link>
              <Link to="/charity">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn About Our Impact
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Mission;
