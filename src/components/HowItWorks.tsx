import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: FileText,
      title: t('howItWorks.step1Title'),
      description: t('howItWorks.step1Desc'),
      color: "text-primary",
    },
    {
      icon: Users,
      title: t('howItWorks.step2Title'),
      description: t('howItWorks.step2Desc'),
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      title: t('howItWorks.step3Title'),
      description: t('howItWorks.step3Desc'),
      color: "text-secondary",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="relative p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card border-border"
            >
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                  {index + 1}
                </div>
              </div>
              
              <div className="mt-8">
                <step.icon className={`w-12 h-12 mb-4 ${step.color}`} />
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Learn Details Buttons */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-8">
            {t('howItWorks.opportunities')}
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-3xl mx-auto">
            <Link to="/script-writers" className="flex-1">
              <Button variant="default" size="lg" className="w-full">
                {t('howItWorks.forScriptWriters')}
              </Button>
            </Link>
            <Link to="/video-creators" className="flex-1">
              <Button variant="default" size="lg" className="w-full">
                {t('howItWorks.forVideoCreators')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
