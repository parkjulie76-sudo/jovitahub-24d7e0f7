import { Card } from "@/components/ui/card";
import { DollarSign, Heart, Sparkles, Shield, Users2, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import communityImage from "@/assets/community-impact.jpg";

const Benefits = () => {
  const { t } = useTranslation();
  
  const benefits = [
    {
      icon: DollarSign,
      title: t('benefits.earnTitle'),
      description: t('benefits.earnDesc'),
    },
    {
      icon: Heart,
      title: t('benefits.impactTitle'),
      description: t('benefits.impactDesc'),
    },
    {
      icon: Sparkles,
      title: t('benefits.portfolioTitle'),
      description: t('benefits.portfolioDesc'),
    },
    {
      icon: Shield,
      title: t('benefits.protectedTitle'),
      description: t('benefits.protectedDesc'),
    },
    {
      icon: Users2,
      title: t('benefits.communityTitle'),
      description: t('benefits.communityDesc'),
    },
    {
      icon: Zap,
      title: t('benefits.quickTitle'),
      description: t('benefits.quickDesc'),
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('benefits.title')}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('benefits.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('benefits.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border-border"
              >
                <benefit.icon className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl rounded-full" />
            <img 
              src={communityImage} 
              alt="Community collaboration and impact visualization" 
              className="relative rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
