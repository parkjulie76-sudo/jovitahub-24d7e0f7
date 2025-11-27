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

            {/* Detailed Content Guide */}
            <div className="mt-12 space-y-8">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold mb-4">Transform Your Content into Income</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Welcome to JovitaHub Creator! We're thrilled to have you join our community and are committed to helping you transform your creative work into substantial income. Your success is our mission, and we're here to provide you with the tools, strategies, and support you need to thrive.
                </p>
                <p className="text-muted-foreground mb-8">
                  Your earnings are directly tied to the actual sales of your projects, making it crucial to create videos that are not only viral but also have a high sales conversion rate. This guide will walk you through the essential steps to achieve both virality and conversion.
                </p>

                <h3 className="text-2xl font-bold mb-6">The Three-Step Success Formula</h3>
                <p className="text-muted-foreground mb-6">
                  Before diving into specific video formats, it's essential to understand the foundational approach that will make your content both viral and profitable. Success requires a strategic combination of research, emotional connection, and proven structure.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <Card className="p-6">
                    <div className="text-4xl font-bold text-primary mb-3">01</div>
                    <h4 className="text-lg font-semibold mb-3">Research High-Trend Topics & Keywords</h4>
                    <p className="text-sm text-muted-foreground">
                      Begin by identifying what is currently popular within the project's niche. Use tools like Google Trends and YouTube's search suggest to discover what the target audience is actively searching for. Study at least 10 high-converting videos to understand what works.
                    </p>
                  </Card>
                  <Card className="p-6">
                    <div className="text-4xl font-bold text-primary mb-3">02</div>
                    <h4 className="text-lg font-semibold mb-3">Inject the Viral Formula</h4>
                    <p className="text-sm text-muted-foreground">
                      What is the secret to virality? Human emotion. The most powerful viral emotions include love, hope, and inspiration. Craft your scripts to allow your audience to feel these emotions. When viewers connect emotionally, they're far more likely to engage and take action.
                    </p>
                  </Card>
                  <Card className="p-6">
                    <div className="text-4xl font-bold text-primary mb-3">03</div>
                    <h4 className="text-lg font-semibold mb-3">Follow the Strategic Blueprint</h4>
                    <p className="text-sm text-muted-foreground">
                      Structure your content according to a proven blueprint designed for both virality and conversion. This systematic approach has been tested and proven to deliver results consistently.
                    </p>
                  </Card>
                </div>

                <h3 className="text-2xl font-bold mb-6">Tier 1: Highest Potential Formats</h3>
                <p className="text-muted-foreground mb-6">
                  These formats directly target pain points and curiosity, making them highly shareable and persuasive. They create an "information gap" that compels viewers to click, watch, and ultimately take action.
                </p>

                <div className="space-y-6 mb-8">
                  <Card className="p-6 border-primary/20">
                    <h4 className="text-xl font-semibold mb-3">The "Contrarian Hook" Video</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Format:</strong> Short, punchy (60-90 seconds), text-on-screen, high-energy</p>
                      <p><strong>Example:</strong> "The Law of Attraction is INCOMPLETE (Here's the Missing Piece)"</p>
                      <p><strong>Why it Works:</strong> Creates an information gap that viewers must fill by watching</p>
                    </div>
                  </Card>

                  <Card className="p-6 border-primary/20">
                    <h4 className="text-xl font-semibold mb-3">The "Answering an Unanswerable Question" Video</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Format:</strong> Mini-documentary style (8-12 minutes) with compelling footage and mysterious tone</p>
                      <p><strong>Example:</strong> "The REAL Purpose of the Pyramids" or "The Truth About Atlantis"</p>
                      <p><strong>Why it Works:</strong> Taps into massive public curiosity with unique authority</p>
                    </div>
                  </Card>

                  <Card className="p-6 border-primary/20">
                    <h4 className="text-xl font-semibold mb-3">The "Practical Problem-Solver" Video</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Format:</strong> Step-by-step guide (5-10 minutes) with clear, actionable advice</p>
                      <p><strong>Example:</strong> "A Guide to Healing Depression" or "The Daily Routine to Manifest ANYTHING"</p>
                      <p><strong>Why it Works:</strong> Solves real problems, building trust that leads to conversions</p>
                    </div>
                  </Card>
                </div>

                <h3 className="text-2xl font-bold mb-6">Tier 2: Loyal Audience Builders</h3>
                <p className="text-muted-foreground mb-6">
                  These formats are excellent for building a loyal audience that will buy out of trust and deep connection. While they may not go as viral initially, they create lasting relationships with viewers.
                </p>

                <div className="space-y-6 mb-8">
                  <Card className="p-6 border-secondary/20">
                    <h4 className="text-xl font-semibold mb-3">The "Deep Dive" Explainer Video</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Format:</strong> Longer, lecture-style (15-25 minutes) using detailed graphics</p>
                      <p><strong>Why it Works:</strong> Attracts dedicated, intellectually-inclined audience with high watch time</p>
                    </div>
                  </Card>

                  <Card className="p-6 border-secondary/20">
                    <h4 className="text-xl font-semibold mb-3">The "Channeled Message" Video</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Format:</strong> Softer, meditative style with direct camera speaking and ethereal music</p>
                      <p><strong>Why it Works:</strong> Creates powerful emotional connection as viewers receive privileged information</p>
                    </div>
                  </Card>
                </div>

                <h3 className="text-2xl font-bold mb-6">Your Content Strategy Roadmap</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="p-6">
                    <div className="text-3xl font-bold text-primary mb-2">1</div>
                    <h4 className="text-lg font-semibold mb-2">Launch with a Bang</h4>
                    <p className="text-sm text-muted-foreground">
                      Start with 3-5 Tier 1 videos to attract a broad audience quickly. These high-impact videos will establish your presence and drive initial traffic.
                    </p>
                  </Card>
                  <Card className="p-6">
                    <div className="text-3xl font-bold text-primary mb-2">2</div>
                    <h4 className="text-lg font-semibold mb-2">Build Consistency</h4>
                    <p className="text-sm text-muted-foreground">
                      Release Tier 2 videos weekly to build a core community. Consistency is key to algorithm success and audience retention.
                    </p>
                  </Card>
                  <Card className="p-6">
                    <div className="text-3xl font-bold text-primary mb-2">3</div>
                    <h4 className="text-lg font-semibold mb-2">Create Strategic Playlists</h4>
                    <p className="text-sm text-muted-foreground">
                      Organize videos into thematic playlists. This encourages binge-watching and positions your content as a comprehensive journey.
                    </p>
                  </Card>
                  <Card className="p-6">
                    <div className="text-3xl font-bold text-primary mb-2">4</div>
                    <h4 className="text-lg font-semibold mb-2">Optimize for Search (SEO)</h4>
                    <p className="text-sm text-muted-foreground">
                      Use keywords people are actually searching for in titles, descriptions, and tags to maximize discoverability.
                    </p>
                  </Card>
                </div>

                <h3 className="text-2xl font-bold mb-6">Technical Execution for Maximum Conversion</h3>
                <div className="space-y-4 mb-8">
                  <Card className="p-5">
                    <h4 className="font-semibold mb-2">Hook in the First 10 Seconds</h4>
                    <p className="text-sm text-muted-foreground">
                      State the biggest benefit or most shocking claim immediately. This is your only chance to stop the scroll and capture attention.
                    </p>
                  </Card>
                  <Card className="p-5">
                    <h4 className="font-semibold mb-2">Emotional Storytelling</h4>
                    <p className="text-sm text-muted-foreground">
                      Human emotion is the secret to virality. Craft your scripts to evoke love, hope, inspiration, and other strong feelings.
                    </p>
                  </Card>
                  <Card className="p-5">
                    <h4 className="font-semibold mb-2">Clear Call-to-Action</h4>
                    <p className="text-sm text-muted-foreground">
                      Every video must end with a specific, compelling CTA. Make it clear, urgent, and benefit-focused.
                    </p>
                  </Card>
                </div>

                <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                  <h3 className="text-2xl font-bold mb-4">Your Blueprint for Success</h3>
                  <p className="text-muted-foreground mb-4">
                    By packaging profound knowledge into these specific, high-demand video formats, you will not only attract millions of views but also build a tribe of viewers who see your content as essential.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Study at least 10 high-converting viral videos</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Research high-trend topics and keywords using Google Trends</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Inject emotional connection into every piece of content</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Follow the proven blueprint for structure and format</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Be consistent with weekly uploads</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Optimize every video for search and discovery</span>
                    </p>
                  </div>
                  <p className="text-lg font-semibold mt-6">
                    Your Mission: Transform viewers into believers, and believers into buyers. Every video is an opportunity to change lives while building your income!
                  </p>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
