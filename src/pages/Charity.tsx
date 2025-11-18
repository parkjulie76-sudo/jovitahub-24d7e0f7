import { Heart, Users, Target, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Charity = () => {
  const { t } = useTranslation();
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
            {t("charity.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("charity.subtitle")}
          </p>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">{t("charity.approachTitle")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("charity.approach1Title")}</h3>
              <p className="text-muted-foreground">
                {t("charity.approach1Desc")}
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("charity.approach2Title")}</h3>
              <p className="text-muted-foreground">
                {t("charity.approach2Desc")}
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("charity.approach3Title")}</h3>
              <p className="text-muted-foreground">
                {t("charity.approach3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">{t("charity.focusTitle")}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-lg border border-border">
              <h3 className="text-2xl font-semibold mb-4">{t("charity.focus1Title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("charity.focus1Desc")}
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {t("charity.focus1Item1")}</li>
                <li>• {t("charity.focus1Item2")}</li>
                <li>• {t("charity.focus1Item3")}</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-lg border border-border">
              <h3 className="text-2xl font-semibold mb-4">{t("charity.focus2Title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("charity.focus2Desc")}
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {t("charity.focus2Item1")}</li>
                <li>• {t("charity.focus2Item2")}</li>
                <li>• {t("charity.focus2Item3")}</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-lg border border-border">
              <h3 className="text-2xl font-semibold mb-4">{t("charity.focus3Title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("charity.focus3Desc")}
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {t("charity.focus3Item1")}</li>
                <li>• {t("charity.focus3Item2")}</li>
                <li>• {t("charity.focus3Item3")}</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-lg border border-border">
              <h3 className="text-2xl font-semibold mb-4">{t("charity.focus4Title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("charity.focus4Desc")}
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {t("charity.focus4Item1")}</li>
                <li>• {t("charity.focus4Item2")}</li>
                <li>• {t("charity.focus4Item3")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">{t("charity.impactTitle")}</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">$250K+</div>
              <p className="text-muted-foreground">{t("charity.impactStat1")}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">{t("charity.impactStat2")}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1,000+</div>
              <p className="text-muted-foreground">{t("charity.impactStat3")}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">{t("charity.impactStat4")}</p>
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
