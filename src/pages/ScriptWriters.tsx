import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, DollarSign, FileText, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

const ScriptWriters = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-primary-glow/10 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Work With Viral Storytelling Writers
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Join hundreds of writers worldwide creating impactful content and earning substantial income
              </p>
            </div>
          </div>
        </section>

        {/* Project Overview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 mb-8">
                <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Project Name</h3>
                    <p className="text-muted-foreground">The 7 Laws Mastered by Wealthy People (eBook)</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      A spiritual eBook helping entrepreneurs and elite people acquire spiritual growth and wisdom.
                      Your role is to create viral storytelling scripts for short videos to spread awareness of universal laws through stories.
                    </p>
                  </div>
                </div>
              </Card>

              {/* How We Work Together */}
              <Card className="p-8 mb-8">
                <h2 className="text-3xl font-bold mb-6">How We Work Together</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Your Role</h3>
                    <p className="text-sm text-muted-foreground">
                      Write at least 3 viral storytelling scripts per week after contract signing
                    </p>
                  </div>
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-accent" />
                    <h3 className="font-semibold mb-2">Video Adaptation</h3>
                    <p className="text-sm text-muted-foreground">
                      Jovita Hub turns your scripts into videos distributed across multiple channels
                    </p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-secondary" />
                    <h3 className="font-semibold mb-2">Remote Work</h3>
                    <p className="text-sm text-muted-foreground">
                      Work from anywhere with proven viral tips and strategies
                    </p>
                  </div>
                </div>
              </Card>

              {/* Compensation Structure */}
              <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold">Compensation Structure</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-background/80 backdrop-blur p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Monthly Fee + Sales Commission</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border border-border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Basic Monthly Fee</h4>
                        <p className="text-2xl font-bold text-primary mb-2">$600 USD</p>
                        <p className="text-sm text-muted-foreground">For creators with monthly score above 50</p>
                      </div>
                      <div className="border border-border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Sales Commission</h4>
                        <p className="text-2xl font-bold text-accent mb-2">10%</p>
                        <p className="text-sm text-muted-foreground">Per sale generated by your content</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background/80 backdrop-blur p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Income Potential</h3>
                    <p className="text-lg mb-2">
                      Viral Script Writers monthly income typically ranges from
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      $1,000 - $50,000 USD
                    </p>
                    <p className="text-muted-foreground mt-2">Depending on performance and viral content creation</p>
                  </div>

                  <div className="bg-background/80 backdrop-blur p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Creator Score Calculation</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold">Weekly Videos (1-3 per week): +10 points</p>
                          <p className="text-sm text-muted-foreground">Each video with 10,000+ views and 1%+ conversion</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold">Weekly Videos (3+ per week): +15 points</p>
                          <p className="text-sm text-muted-foreground">Each video with 10,000+ views and 1%+ conversion</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold">Viral Video (1+ per month): +50 points</p>
                          <p className="text-sm text-muted-foreground">100,000+ views and 1%+ conversion</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Key Points */}
              <Card className="p-8 mb-8">
                <h2 className="text-3xl font-bold mb-6">Important Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <p>Commission paid weekly, Monthly Fee paid monthly via PayPal or Bank transfer</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <p>Performance-based collaboration - earnings tied to viral content and sales</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <p>Unique project sales link provided to track your commissions automatically</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <p>Scripts remain your intellectual property with exclusive commercial license to Jovita Hub</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <p>Peer-to-peer charity encouraged with 110% reimbursement from Jovita Hub</p>
                  </div>
                </div>
              </Card>

              {/* Getting Started */}
              <Card className="p-8 bg-gradient-to-br from-primary via-primary-glow to-accent text-primary-foreground">
                <h2 className="text-3xl font-bold mb-6">Ready to Start?</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <p>Sign up and create your account</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <p>Submit your first viral storytelling script based on the eBook preview</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <p>Get approved and start creating 3-5 scripts per week</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/join-creator" className="flex-1">
                    <Button variant="secondary" size="lg" className="w-full">
                      Sign Up Now
                    </Button>
                  </Link>
                  <Link to="/submit-script" className="flex-1">
                    <Button variant="outline" size="lg" className="w-full bg-background/10 hover:bg-background/20 border-primary-foreground/20">
                      Submit Script
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ScriptWriters;
