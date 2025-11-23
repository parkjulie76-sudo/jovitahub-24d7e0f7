import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, DollarSign, FileText, TrendingUp, Users, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "react-i18next";

const ScriptWriters = () => {
  const { t } = useTranslation();
  const [scriptsPerWeek, setScriptsPerWeek] = useState(5);
  const [avgViews, setAvgViews] = useState(25000);
  const [conversionRate, setConversionRate] = useState(1.5);
  
  // Fixed eBook price
  const pricePerSale = 9;

  // Calculate metrics
  const videosPerMonth = scriptsPerWeek * 4;
  const totalViews = avgViews * videosPerMonth;
  const totalSales = Math.floor((totalViews * conversionRate) / 100);
  const commissionEarnings = totalSales * pricePerSale * 0.1;
  
  // Calculate creator score
  let creatorScore = 0;
  if (scriptsPerWeek >= 5 && avgViews >= 10000 && conversionRate >= 1) {
    creatorScore += scriptsPerWeek * 15 * 4; // 15 points per video for 5+ weekly
  } else if (scriptsPerWeek >= 1 && avgViews >= 10000 && conversionRate >= 1) {
    creatorScore += scriptsPerWeek * 10 * 4; // 10 points per video for 1-5 weekly
  }
  if (avgViews >= 100000 && conversionRate >= 1) {
    creatorScore += 50; // Viral video bonus
  }
  
  const monthlyFee = creatorScore >= 50 ? 600 : 0;
  const totalMonthlyIncome = monthlyFee + commissionEarnings;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-primary-glow/10 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t("scriptWriters.title")}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {t("scriptWriters.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Project Overview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 mb-8">
                <h2 className="text-3xl font-bold mb-6">{t("scriptWriters.projectOverview")}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{t("scriptWriters.projectName")}</h3>
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
                    <h3 className="text-xl font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      {t("scriptWriters.projectDesc")}
                    </p>
                  </div>
                </div>
              </Card>

              {/* How We Work Together */}
              <Card className="p-8 mb-8">
                <h2 className="text-3xl font-bold mb-6">{t("scriptWriters.howWeWork")}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">{t("scriptWriters.yourRole")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("scriptWriters.yourRoleDesc")}
                    </p>
                  </div>
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-accent" />
                    <h3 className="font-semibold mb-2">{t("scriptWriters.videoAdaptation")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("scriptWriters.videoAdaptationDesc")}
                    </p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-secondary" />
                    <h3 className="font-semibold mb-2">{t("scriptWriters.remoteWork")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("scriptWriters.remoteWorkDesc")}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Compensation Structure */}
              <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold">{t("scriptWriters.compensation")}</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-background/80 backdrop-blur p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t("scriptWriters.compensationSubtitle")}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border border-border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{t("scriptWriters.basicMonthlyFee")}</h4>
                        <p className="text-2xl font-bold text-primary mb-2">{t("scriptWriters.monthlyFeeAmount")}</p>
                        <p className="text-sm text-muted-foreground">{t("scriptWriters.monthlyFeeCondition")}</p>
                      </div>
                      <div className="border border-border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{t("scriptWriters.salesCommission")}</h4>
                        <p className="text-2xl font-bold text-accent mb-2">{t("scriptWriters.salesCommissionRate")}</p>
                        <p className="text-sm text-muted-foreground">{t("scriptWriters.salesCommissionDesc")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background/80 backdrop-blur p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t("scriptWriters.incomePotential")}</h3>
                    <p className="text-lg mb-2">
                      {t("scriptWriters.incomePotentialDesc")}
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {t("scriptWriters.incomeRange")}
                    </p>
                    <p className="text-muted-foreground mt-2">{t("scriptWriters.incomeRangeDesc")}</p>
                  </div>

                  <div className="bg-background/80 backdrop-blur p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t("scriptWriters.creatorScoreCalc")}</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold">{t("scriptWriters.weeklyVideos1to5")}</p>
                          <p className="text-sm text-muted-foreground">{t("scriptWriters.weeklyVideos1to5Desc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold">{t("scriptWriters.weeklyVideos5plus")}</p>
                          <p className="text-sm text-muted-foreground">{t("scriptWriters.weeklyVideos5plusDesc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold">{t("scriptWriters.viralVideo")}</p>
                          <p className="text-sm text-muted-foreground">{t("scriptWriters.viralVideoDesc")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Earnings Calculator */}
              <Card className="p-8 mb-8 bg-gradient-to-br from-accent/5 to-secondary/5">
                <div className="flex items-center gap-3 mb-6">
                  <Calculator className="w-8 h-8 text-accent" />
                  <h2 className="text-3xl font-bold">{t("scriptWriters.incomeCalculator")}</h2>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  {t("scriptWriters.incomeCalculatorDesc")}
                </p>

                <div className="space-y-6 mb-8">
                  {/* Scripts Per Week Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold">{t("scriptWriters.scriptsPerWeek")}</label>
                      <span className="text-2xl font-bold text-primary">{scriptsPerWeek}</span>
                    </div>
                    <Slider
                      value={[scriptsPerWeek]}
                      onValueChange={(value) => setScriptsPerWeek(value[0])}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Average Views Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold">{t("scriptWriters.avgViewsPerVideo")}</label>
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
                      <label className="font-semibold">{t("scriptWriters.conversionRate")}</label>
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

                  {/* Fixed eBook Price Display */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold">{t("scriptWriters.ebookPrice")}</label>
                      <span className="text-2xl font-bold text-primary">${pricePerSale} USD</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{t("scriptWriters.ebookPriceNote")}</p>
                  </div>
                </div>

                {/* Results Display */}
                <div className="bg-background/80 backdrop-blur rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-semibold mb-4">{t("scriptWriters.estimatedMonthlyIncome")}</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">{t("scriptWriters.creatorScore")}</p>
                      <p className="text-3xl font-bold text-primary">{creatorScore}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {creatorScore >= 50 ? t("scriptWriters.qualifiesForFee") : "Below threshold (need 50+)"}
                      </p>
                    </div>
                    
                    <div className="border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">{t("scriptWriters.monthlyFee")}</p>
                      <p className="text-3xl font-bold text-secondary">${monthlyFee}</p>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">{t("scriptWriters.totalMonthlySales")}</p>
                      <p className="text-3xl font-bold text-accent">{totalSales}</p>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">{t("scriptWriters.commissionEarnings")}</p>
                      <p className="text-3xl font-bold text-accent">${commissionEarnings.toFixed(0)}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">{t("scriptWriters.totalMonthlyIncome")}</span>
                      <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ${totalMonthlyIncome.toFixed(0)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t("scriptWriters.incomeEstimateNote")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {t("scriptWriters.incomeEstimateDisclaimer")}
                  </p>
                </div>
              </Card>

              {/* Key Points */}
              <Card className="p-8 mb-8">
                <h2 className="text-3xl font-bold mb-6">{t("scriptWriters.importantDetails")}</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <p>{t("scriptWriters.importantDetail1")}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <p>{t("scriptWriters.importantDetail2")}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <p>{t("scriptWriters.importantDetail3")}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <p>{t("scriptWriters.importantDetail4")}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <p>{t("scriptWriters.importantDetail5")}</p>
                  </div>
                </div>
              </Card>

              {/* Getting Started */}
              <Card className="p-8 bg-gradient-to-br from-primary via-primary-glow to-accent text-primary-foreground">
                <h2 className="text-3xl font-bold mb-6">{t("scriptWriters.readyToStart")}</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <p>{t("scriptWriters.step1")}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <p>{t("scriptWriters.step2")}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <p>{t("scriptWriters.step3")}</p>
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
