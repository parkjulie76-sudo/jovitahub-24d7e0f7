import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Video, FileText, Megaphone, TrendingUp, MessageSquare, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

const iconMap: Record<string, any> = {
  briefcase: Briefcase,
  users: Users,
  video: Video,
  filetext: FileText,
  megaphone: Megaphone,
  trendingup: TrendingUp,
  messagesquare: MessageSquare,
};

const Careers = () => {
  const { t } = useTranslation();
  const { data: positions, isLoading } = useQuery({
    queryKey: ['job-positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_positions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const typeColors: Record<string, string> = {
    "Full-time": "bg-primary/10 text-primary",
    "Part-time": "bg-secondary/10 text-secondary",
    "Contract": "bg-accent/10 text-accent",
    "Creative": "bg-purple-500/10 text-purple-700 dark:text-purple-300",
    "Production": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    "Community": "bg-green-500/10 text-green-700 dark:text-green-300",
    "Business": "bg-red-500/10 text-red-700 dark:text-red-300"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("careers.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("careers.subtitle")}
            </p>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t("careers.openPositions")}</h2>
              <p className="text-muted-foreground">
                {t("careers.openPositionsDesc")}
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : positions && positions.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {positions.map((position) => {
                  const Icon = iconMap[position.icon] || Briefcase;
                  return (
                    <Card key={position.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{position.title}</CardTitle>
                              <Badge className={`mt-2 ${typeColors[position.type] || 'bg-secondary'}`} variant="secondary">
                                {position.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-base mt-3">
                          {position.description}
                        </CardDescription>
                      </CardHeader>
                       <CardContent>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">{t("careers.requirements")}</h4>
                          <ul className="space-y-2">
                            {position.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="flex items-start text-sm text-muted-foreground">
                                <span className="mr-2 text-primary">•</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                          <Link to="/contact" className="block pt-4">
                            <Button className="w-full">
                              {t("careers.applyNow")}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t("careers.noPositions")}</p>
              </div>
            )}
          </div>
        </section>

        {/* Why Join Us Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-accent/5 to-background">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t("careers.whyJoin")}</h2>
              <p className="text-muted-foreground">
                {t("careers.whyJoinDesc")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardTitle>{t("careers.collaborativeCulture")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("careers.collaborativeCultureDesc")}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardTitle>{t("careers.growthOpportunities")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("careers.growthOpportunitiesDesc")}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Megaphone className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardTitle>{t("careers.creativeFreedom")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("careers.creativeFreedomDesc")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">{t("careers.ctaTitle")}</CardTitle>
                <CardDescription className="text-base">
                  {t("careers.ctaDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/contact">
                  <Button size="lg">
                    {t("careers.ctaButton")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;