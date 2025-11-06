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
            To empower creative professionals by providing fair opportunities, fostering collaboration, 
            and creating meaningful social impact through every project we undertake.
          </p>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Vision</h2>
            <p className="text-lg text-muted-foreground text-center leading-relaxed">
              We envision a world where creative talent is recognized, fairly compensated, and empowered to make a difference. 
              A world where every video production, every script, and every creative project contributes not only to business success 
              but also to positive social change. Through Jovita Hub, we're building a community that proves creativity and compassion 
              can work hand in hand.
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
                  <h3 className="text-xl font-semibold mb-3">Empowerment & Growth</h3>
                  <p className="text-muted-foreground">
                    We empower creators by providing not just work opportunities, but also resources, 
                    mentorship, and a supportive community. We're invested in the long-term growth and 
                    success of every member of our network.
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
                  <h3 className="text-xl font-semibold mb-3">Social Responsibility</h3>
                  <p className="text-muted-foreground">
                    We recognize our responsibility to give back. By integrating charitable giving into our 
                    business model, we ensure that creative work creates ripples of positive change throughout 
                    society.
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
              <h3 className="text-xl font-semibold mb-3">Connect Talent with Opportunity</h3>
              <p className="text-muted-foreground">
                We bridge the gap between talented creators and organizations that need high-quality content. 
                Our platform makes it easy for businesses to find the right creative professionals while ensuring 
                creators receive fair compensation for their work.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-3">Streamline Production Workflows</h3>
              <p className="text-muted-foreground">
                From scriptwriting to final video delivery, we've built systems and processes that make content 
                production efficient and enjoyable. Our creators can focus on their craft while we handle the logistics.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-3">Foster Community & Collaboration</h3>
              <p className="text-muted-foreground">
                We've created a supportive community where creators can share knowledge, collaborate on projects, 
                and grow together. Our network is built on mutual respect and shared success.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-3">Drive Social Impact</h3>
              <p className="text-muted-foreground">
                Through our charitable partnerships and giving programs, we ensure that every project contributes 
                to causes that matter. We're proving that business success and social responsibility go hand in hand.
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
              Whether you're a creator looking for fair opportunities or an organization seeking exceptional content, 
              we're committed to your success. We promise transparency, quality, and a partnership built on mutual respect 
              and shared values. Together, we can create content that not only achieves business goals but also makes 
              the world a better place.
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
