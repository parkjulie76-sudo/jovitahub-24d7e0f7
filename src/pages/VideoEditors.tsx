import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, DollarSign, Video, TrendingUp, Users, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const VideoEditors = () => {
  const [videosPerWeek, setVideosPerWeek] = useState(3);
  const [avgViews, setAvgViews] = useState(25000);
  const [conversionRate, setConversionRate] = useState(1.5);
  const [pricePerSale, setPricePerSale] = useState(47);
  const [isCombinedRole, setIsCombinedRole] = useState(false);

  // Calculate metrics based on role type
  const commissionPercentage = isCombinedRole ? 0.2 : 0.1;
  const baseMonthlyFee = isCombinedRole ? 1200 : 600;
  
  const videosPerMonth = videosPerWeek * 4;
  const totalViews = avgViews * videosPerMonth;
  const totalSales = Math.floor((totalViews * conversionRate) / 100);
  const commissionEarnings = totalSales * pricePerSale * commissionPercentage;
  
  // Calculate creator score
  let creatorScore = 0;
  if (videosPerWeek >= 3 && avgViews >= 10000 && conversionRate >= 1) {
    creatorScore += videosPerWeek * 15 * 4; // 15 points per video for 3+ weekly
  } else if (videosPerWeek >= 1 && avgViews >= 10000 && conversionRate >= 1) {
    creatorScore += videosPerWeek * 10 * 4; // 10 points per video for 1-3 weekly
  }
  if (avgViews >= 100000 && conversionRate >= 1) {
    creatorScore += 50; // Viral video bonus
  }
  
  const monthlyFee = creatorScore >= 50 ? baseMonthlyFee : 0;
  const totalMonthlyIncome = monthlyFee + commissionEarnings;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-accent/10 via-secondary/10 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Work as Video Creator & Editor
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Transform compelling scripts into viral short-form videos and earn substantial income
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
                    <p className="text-muted-foreground">
                      <a 
                        href="https://ebook.jovita.site/b/thzi7" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        The 7 Laws Mastered by Wealthy People (eBook)
                      </a>
                    </p>
                    <a 
                      href="https://ebook.jovita.site" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      ebook.jovita.site
                    </a>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Your Role</h3>
                    <p className="text-muted-foreground">
                      Transform storytelling scripts into engaging short-form videos for YouTube, TikTok, and other platforms.
                      Create visually compelling content that spreads awareness of universal laws and drives sales.
                    </p>
                  </div>
                </div>
              </Card>

              {/* How We Work Together */}
              <Card className="p-8 mb-8">
                <h2 className="text-3xl font-bold mb-6">How We Work Together</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Video className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Your Role</h3>
                    <p className="text-sm text-muted-foreground">
                      Create and edit engaging videos from provided scripts and formats
                    </p>
                  </div>
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-accent" />
                    <h3 className="font-semibold mb-2">Distribution</h3>
                    <p className="text-sm text-muted-foreground">
                      Videos distributed across official and partner social channels globally
                    </p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-secondary" />
                    <h3 className="font-semibold mb-2">Remote Work</h3>
                    <p className="text-sm text-muted-foreground">
                      Work from anywhere with creative freedom and viral strategies
                    </p>
                  </div>
                </div>
              </Card>

              {/* Compensation Structure */}
              <Card className="p-8 mb-8 bg-gradient-to-br from-accent/5 to-secondary/5">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold">Compensation Structure</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-background/80 backdrop-blur p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Video Creator Compensation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border border-border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Basic Monthly Fee</h4>
                        <p className="text-2xl font-bold text-primary mb-2">$600 USD</p>
                        <p className="text-sm text-muted-foreground">For creators with monthly score above 50</p>
                      </div>
                      <div className="border border-border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Sales Commission</h4>
                        <p className="text-2xl font-bold text-accent mb-2">10%</p>
                        <p className="text-sm text-muted-foreground">Per sale generated by your videos</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background/80 backdrop-blur p-6 rounded-lg border-2 border-primary/20">
                    <h3 className="text-xl font-semibold mb-4">Script + Video Creator (Combined)</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border border-border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Basic Monthly Fee</h4>
                        <p className="text-2xl font-bold text-primary mb-2">$1,200 USD</p>
                        <p className="text-sm text-muted-foreground">Double compensation for full creation</p>
                      </div>
                      <div className="border border-border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Sales Commission</h4>
                        <p className="text-2xl font-bold text-accent mb-2">20%</p>
                        <p className="text-sm text-muted-foreground">Higher commission for complete work</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background/80 backdrop-blur p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Income Potential</h3>
                    <p className="text-lg mb-2">
                      Video Creators monthly income typically ranges from
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                      $1,000 - $50,000 USD
                    </p>
                    <p className="text-muted-foreground mt-2">Depending on video performance and viral reach</p>
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

              {/* Earnings Calculator */}
              <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-center gap-3 mb-6">
                  <Calculator className="w-8 h-8 text-accent" />
                  <h2 className="text-3xl font-bold">Income Calculator</h2>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Adjust the settings below to estimate your potential monthly earnings based on your performance
                </p>

                {/* Role Toggle */}
                <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur rounded-lg mb-6 border border-border">
                  <div className="flex-1">
                    <Label htmlFor="role-toggle" className="text-base font-semibold cursor-pointer">
                      {isCombinedRole ? "Script + Video Creator (Combined)" : "Video Creator Only"}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isCombinedRole 
                        ? "Double compensation: $1,200 monthly fee + 20% commission" 
                        : "$600 monthly fee + 10% commission"}
                    </p>
                  </div>
                  <Switch
                    id="role-toggle"
                    checked={isCombinedRole}
                    onCheckedChange={setIsCombinedRole}
                  />
                </div>

                <div className="space-y-6 mb-8">
                  {/* Videos Per Week Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold">Videos Per Week</label>
                      <span className="text-2xl font-bold text-primary">{videosPerWeek}</span>
                    </div>
                    <Slider
                      value={[videosPerWeek]}
                      onValueChange={(value) => setVideosPerWeek(value[0])}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Average Views Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold">Average Views Per Video</label>
                      <span className="text-2xl font-bold text-primary">{avgViews.toLocaleString()}</span>
                    </div>
                    <Slider
                      value={[avgViews]}
                      onValueChange={(value) => setAvgViews(value[0])}
                      min={5000}
                      max={200000}
                      step={5000}
                      className="w-full"
                    />
                  </div>

                  {/* Conversion Rate Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold">Conversion Rate (%)</label>
                      <span className="text-2xl font-bold text-primary">{conversionRate}%</span>
                    </div>
                    <Slider
                      value={[conversionRate]}
                      onValueChange={(value) => setConversionRate(value[0])}
                      min={0.5}
                      max={5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Price Per Sale Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold">eBook Price</label>
                      <span className="text-2xl font-bold text-primary">${pricePerSale}</span>
                    </div>
                    <Slider
                      value={[pricePerSale]}
                      onValueChange={(value) => setPricePerSale(value[0])}
                      min={27}
                      max={97}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Results Display */}
                <div className="bg-background/80 backdrop-blur rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Your Estimated Monthly Income</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Creator Score</p>
                      <p className="text-3xl font-bold text-primary">{creatorScore}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {creatorScore >= 50 ? "Qualifies for monthly fee ✓" : "Below threshold (need 50+)"}
                      </p>
                    </div>
                    
                    <div className="border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Monthly Fee</p>
                      <p className="text-3xl font-bold text-secondary">${monthlyFee}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isCombinedRole ? "Combined role rate" : "Video editor rate"}
                      </p>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Monthly Sales</p>
                      <p className="text-3xl font-bold text-accent">{totalSales}</p>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Commission Earnings ({commissionPercentage * 100}%)</p>
                      <p className="text-3xl font-bold text-accent">${commissionEarnings.toFixed(0)}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">Total Monthly Income</span>
                      <span className="text-4xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                        ${totalMonthlyIncome.toFixed(0)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Based on {videosPerMonth} videos/month with {totalViews.toLocaleString()} total views
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> {isCombinedRole 
                      ? "As a combined creator, you earn double the base fee and commission rate for handling both scripts and videos!" 
                      : "Toggle to 'Combined Role' to see how much more you can earn by also writing scripts!"}
                  </p>
                </div>

                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> These are estimates based on your inputs. Actual earnings may vary depending on video performance, audience engagement, and market conditions.
                  </p>
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
                    <p>Performance-based collaboration - earnings tied to video virality and sales</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <p>Unique project sales link provided to track your commissions automatically</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <p>Full creative freedom with proven viral video tips and strategies</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <p>Videos remain your intellectual property with exclusive commercial license to Jovita Hub</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <p>Peer-to-peer charity encouraged with 110% reimbursement from Jovita Hub</p>
                  </div>
                </div>
              </Card>

              {/* Getting Started */}
              <Card className="p-8 bg-gradient-to-br from-accent via-secondary to-primary text-primary-foreground">
                <h2 className="text-3xl font-bold mb-6">Ready to Start?</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <p>Sign up and create your account</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <p>Submit your video portfolio or create a sample video</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <p>Get approved and start creating viral videos</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/join-creator" className="flex-1">
                    <Button variant="secondary" size="lg" className="w-full">
                      Sign Up Now
                    </Button>
                  </Link>
                  <Link to="/submit-video" className="flex-1">
                    <Button variant="outline" size="lg" className="w-full bg-background/10 hover:bg-background/20 border-primary-foreground/20">
                      Submit Video
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

export default VideoEditors;
