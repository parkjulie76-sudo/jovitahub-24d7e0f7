import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const Resources = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('resources.title', 'Resources')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('resources.subtitle', 'Explore our learning materials and resources to help you succeed as a creator.')}
            </p>
          </div>

          {/* Creator Class Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">
                {t('resources.creatorClass', 'Creator Class')}
              </h2>
            </div>
            
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/W1PIXTBv-bs"
                  title="Creator Class"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">
                  {t('resources.creatorClassTitle', 'Getting Started as a Creator')}
                </h3>
                <p className="text-muted-foreground">
                  {t('resources.creatorClassDescription', 'Learn the fundamentals of becoming a successful creator on our platform. This comprehensive guide covers everything you need to know.')}
                </p>
              </div>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
