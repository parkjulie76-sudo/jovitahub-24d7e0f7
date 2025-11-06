import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Video, FileText, Megaphone, TrendingUp, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Careers = () => {
  const positions = [
    {
      title: "Script Writers",
      icon: FileText,
      type: "Creative",
      description: "Craft compelling stories and engaging scripts for video content. Transform ideas into captivating narratives that resonate with our audience.",
      requirements: [
        "Strong writing and storytelling skills",
        "Experience in video content scriptwriting",
        "Creative thinking and attention to detail",
        "Ability to meet deadlines"
      ]
    },
    {
      title: "Video Editors",
      icon: Video,
      type: "Production",
      description: "Bring stories to life through expert video editing. Create polished, professional content that captivates and engages viewers.",
      requirements: [
        "Proficiency in video editing software (Adobe Premiere, Final Cut Pro, etc.)",
        "Strong sense of pacing and visual storytelling",
        "Experience with color grading and audio mixing",
        "Portfolio of previous work"
      ]
    },
    {
      title: "Format Creators",
      icon: Megaphone,
      type: "Creative",
      description: "Design innovative content formats and concepts. Shape the future of our content strategy with fresh, engaging ideas.",
      requirements: [
        "Creative and innovative mindset",
        "Understanding of digital content trends",
        "Experience in content strategy",
        "Strong presentation skills"
      ]
    },
    {
      title: "Community Manager",
      icon: MessageSquare,
      type: "Community",
      description: "Build and nurture our vibrant community. Engage with our audience, foster connections, and create a welcoming environment.",
      requirements: [
        "Excellent communication and interpersonal skills",
        "Experience in community management",
        "Understanding of social media platforms",
        "Passion for building relationships"
      ]
    },
    {
      title: "YouTube Creator",
      icon: Video,
      type: "Content",
      description: "Create compelling YouTube content that drives engagement and growth. Be the face and voice of our channel.",
      requirements: [
        "On-camera presence and charisma",
        "Understanding of YouTube algorithm and trends",
        "Video production experience",
        "Strong personal brand"
      ]
    },
    {
      title: "Business Development Manager",
      icon: TrendingUp,
      type: "Business",
      description: "Drive growth and forge strategic partnerships. Identify new opportunities and expand our reach in the digital content space.",
      requirements: [
        "Proven business development experience",
        "Strong negotiation and relationship-building skills",
        "Understanding of digital media industry",
        "Strategic thinking and analytical skills"
      ]
    }
  ];

  const typeColors: Record<string, string> = {
    "Creative": "bg-purple-500/10 text-purple-700 dark:text-purple-300",
    "Production": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    "Community": "bg-green-500/10 text-green-700 dark:text-green-300",
    "Content": "bg-orange-500/10 text-orange-700 dark:text-orange-300",
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
              Join Our Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We are constantly looking for talented individuals to join our growing team. 
              Help us create amazing content and build the future of digital storytelling.
            </p>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
              <p className="text-muted-foreground">
                Explore our current openings and find your perfect role
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {positions.map((position, index) => {
                const Icon = position.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{position.title}</CardTitle>
                            <Badge className={`mt-2 ${typeColors[position.type]}`} variant="secondary">
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
                        <h4 className="font-semibold text-sm">Requirements:</h4>
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
                            Apply Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Join Us Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-accent/5 to-background">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Join Jovita Hub?</h2>
              <p className="text-muted-foreground">
                Be part of something special
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardTitle>Collaborative Culture</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Work with talented individuals who share your passion for creating amazing content.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardTitle>Growth Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Develop your skills and advance your career in a rapidly growing organization.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Megaphone className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardTitle>Creative Freedom</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Express your creativity and bring your unique ideas to life.
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
                <CardTitle className="text-2xl">Don&apos;t See Your Role?</CardTitle>
                <CardDescription className="text-base">
                  We&apos;re always looking for talented people. Send us your resume and tell us how you can contribute to our team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/contact">
                  <Button size="lg">
                    Get in Touch
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
