import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Heart, Target, Award } from "lucide-react";
import communityImpactImg from "@/assets/community-impact.jpg";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              {t("aboutUs.title")}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t("aboutUs.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("aboutUs.missionTitle")}</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t("aboutUs.missionText1")}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("aboutUs.missionText2")}
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">{t("aboutUs.valuesTitle")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border text-center hover:shadow-elegant transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("aboutUs.value1Title")}</h3>
              <p className="text-muted-foreground">
                {t("aboutUs.value1Desc")}
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border text-center hover:shadow-elegant transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("aboutUs.value2Title")}</h3>
              <p className="text-muted-foreground">
                {t("aboutUs.value2Desc")}
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border text-center hover:shadow-elegant transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("aboutUs.value3Title")}</h3>
              <p className="text-muted-foreground">
                {t("aboutUs.value3Desc")}
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border text-center hover:shadow-elegant transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("aboutUs.value4Title")}</h3>
              <p className="text-muted-foreground">
                {t("aboutUs.value4Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("aboutUs.impactTitle")}</h2>
            <p className="text-lg text-muted-foreground">
              {t("aboutUs.impactSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">$2M+</div>
              <div className="text-muted-foreground">{t("aboutUs.impactStat1")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">{t("aboutUs.impactStat2")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">{t("aboutUs.impactStat3")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">$100K+</div>
              <div className="text-muted-foreground">{t("aboutUs.impactStat4")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-glow to-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              {t("aboutUs.ctaTitle")}
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              {t("aboutUs.ctaText")}
            </p>
            <Link to="/join-creator">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                {t("aboutUs.ctaButton")}
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
