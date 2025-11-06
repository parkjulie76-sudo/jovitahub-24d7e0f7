import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen, Target, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ScriptWriterGuide = () => {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this page.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Check if user has required role
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (error) throw error;

      const userRoles = roles?.map(r => r.role) || [];
      const allowedRoles = ["admin", "script_writer", "video_creator"];
      const authorized = userRoles.some(role => allowedRoles.includes(role));

      if (!authorized) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setHasAccess(true);
    } catch (error) {
      console.error("Error checking access:", error);
      toast({
        title: "Error",
        description: "Failed to verify access permissions.",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">The 7 Laws Mastered by Wealthy People</h1>
            <p className="text-xl text-muted-foreground">Story Telling Scripts Guide</p>
          </div>

          {/* Targeting Readers Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <CardTitle>Targeting Readers</CardTitle>
              </div>
              <CardDescription>Three key audience segments for your storytelling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">1. Conscious Leaders & Entrepreneurs</h3>
                  <p className="text-sm text-muted-foreground">
                    High-achieving professionals or founders who have material success but emotional/spiritual dissatisfaction. 
                    Seek "higher meaning" behind wealth, business growth, and personal fulfillment. Value inner balance and 
                    emotional peace, yet live in high-stress, competitive environments.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">2. Spiritually Curious Intellectuals</h3>
                  <p className="text-sm text-muted-foreground">
                    Logical thinkers fascinated by consciousness, energy, or metaphysical laws but skeptical of religion. 
                    Readers of Joe Dispenza, Neville Goddard, Eckhart Tolle. Seek a structured, intellectual bridge between 
                    spirituality and science.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">3. Emotionally Burned-Out Professionals</h3>
                  <p className="text-sm text-muted-foreground">
                    People suffering from depression, emptiness, or loss of motivation. Searching for healing through 
                    meditation, energy awareness, or self-hypnosis. Open to the idea that mental illness = "energy imbalance."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Needs Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <CardTitle>Core Needs & Emotional States</CardTitle>
              </div>
              <CardDescription>Understanding what your audience is feeling and seeking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold mb-2">Meaning Beyond Money</h4>
                    <p className="text-sm text-muted-foreground italic">"I'm successful but empty."</p>
                  </div>
                  <div>
                    <p className="text-sm">The 7 Laws book provides spiritual intelligence and purpose beyond material success.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold mb-2">Mental & Emotional Healing</h4>
                    <p className="text-sm text-muted-foreground italic">"I'm anxious, depressed, or drained."</p>
                  </div>
                  <div>
                    <p className="text-sm">Energy awareness and self-mastery techniques for emotional balance.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold mb-2">Spiritual Intelligence</h4>
                    <p className="text-sm text-muted-foreground italic">"Science can't explain everything."</p>
                  </div>
                  <div>
                    <p className="text-sm">Bridge between spiritual wisdom and scientific understanding.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold mb-2">Self-Mastery & Control</h4>
                    <p className="text-sm text-muted-foreground italic">"I want to manifest results consistently."</p>
                  </div>
                  <div>
                    <p className="text-sm">Practical laws and principles for consistent manifestation.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold mb-2">Purpose & Leadership Awakening</h4>
                    <p className="text-sm text-muted-foreground italic">"I want to use my power to uplift others."</p>
                  </div>
                  <div>
                    <p className="text-sm">Guidance on using wealth and influence for positive impact.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Viral Storytelling Tips Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-primary" />
                <CardTitle>Viral Story Telling Script Tips</CardTitle>
              </div>
              <CardDescription>3 proven techniques for creating engaging content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border-l-4 border-primary bg-primary/5">
                  <h4 className="font-semibold mb-2">Show Impact with Original Sentences</h4>
                  <p className="text-sm text-muted-foreground">
                    Use direct quotes from "7 Laws" book and present 3 new knowledge points that resonate with your target readers.
                  </p>
                </div>

                <div className="p-4 border-l-4 border-primary bg-primary/5">
                  <h4 className="font-semibold mb-2">But/Therefore Storytelling</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Use Dan Harmon's Story Circle format to create compelling narratives with clear progression.
                  </p>
                  <ul className="text-sm space-y-1 ml-4 list-disc">
                    <li>Start with a relatable situation</li>
                    <li>Introduce conflict or challenge</li>
                    <li>Show transformation through the 7 Laws</li>
                    <li>End with resolution and hope</li>
                  </ul>
                </div>

                <div className="p-4 border-l-4 border-primary bg-primary/5">
                  <h4 className="font-semibold mb-2">Emotional Connection Themes</h4>
                  <p className="text-sm text-muted-foreground mb-2">Focus on universal human experiences:</p>
                  <ul className="text-sm space-y-1 ml-4 list-disc">
                    <li><strong>Love between Family members</strong> - Universal bonds that resonate deeply</li>
                    <li><strong>Love to Humanity</strong> - Broader compassion and connection</li>
                    <li><strong>Hope for Better Life</strong> - Aspirational transformation stories</li>
                    <li><strong>Motivation Success Stories</strong> - Real examples of positive change</li>
                  </ul>
                </div>

                <div className="mt-6 p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                  <p className="text-sm font-medium text-center">
                    💡 Pro Tip: Study viral hooks and storytelling patterns. Focus on authentic emotional connection 
                    rather than manipulation. Your goal is to inspire and uplift your audience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScriptWriterGuide;