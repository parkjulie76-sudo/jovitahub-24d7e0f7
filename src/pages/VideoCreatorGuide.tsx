import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Video, Camera, Lightbulb, TrendingUp, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VideoCreatorGuide = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold">Video Creator Excellence Guide</h1>
            <p className="text-xl text-muted-foreground">
              Professional standards and best practices for creating impactful video content
            </p>
          </div>

          {/* Video Production Standards */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Camera className="h-6 w-6 text-primary" />
                <CardTitle>Production Quality Standards</CardTitle>
              </div>
              <CardDescription>Technical requirements for professional video content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Video Specifications</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>Resolution:</strong> Minimum 1080p (1920x1080), 4K preferred for future-proofing</li>
                    <li><strong>Frame Rate:</strong> 24fps for cinematic, 30fps for standard, 60fps for action</li>
                    <li><strong>Aspect Ratio:</strong> 16:9 for YouTube/horizontal, 9:16 for shorts/vertical</li>
                    <li><strong>Format:</strong> MP4 (H.264 codec) for maximum compatibility</li>
                    <li><strong>File Size:</strong> Optimize for platform limits while maintaining quality</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Audio Quality</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>Microphone:</strong> Use external mic, never rely on camera audio alone</li>
                    <li><strong>Sample Rate:</strong> 48kHz, 16-bit minimum (industry standard)</li>
                    <li><strong>Noise Floor:</strong> Record in quiet environments, use noise reduction carefully</li>
                    <li><strong>Levels:</strong> Peak at -6dB to -3dB, normalize to -14 LUFS for platforms</li>
                    <li><strong>Clarity:</strong> Clear speech is more important than background music</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Pro Tip: The 3-Second Rule
                </h4>
                <p className="text-sm text-muted-foreground">
                  Viewers decide within 3 seconds whether to keep watching. Start with your strongest hook, 
                  compelling visual, or most intriguing statement. No long intros!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Storytelling for Video */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Video className="h-6 w-6 text-primary" />
                <CardTitle>Visual Storytelling Techniques</CardTitle>
              </div>
              <CardDescription>Crafting compelling narratives through video</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border-l-4 border-primary bg-primary/5">
                  <h4 className="font-semibold mb-3">The Hook-Problem-Solution Structure</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>0-3 seconds:</strong> The Hook - Start with the most compelling moment or question</p>
                    <p><strong>3-15 seconds:</strong> The Problem - Present the issue, challenge, or curiosity gap</p>
                    <p><strong>15-90% of video:</strong> The Journey - Show the process, build tension, educate</p>
                    <p><strong>Final 10%:</strong> The Solution - Deliver the payoff, reveal, or transformation</p>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-primary bg-primary/5">
                  <h4 className="font-semibold mb-3">B-Roll Mastery</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ <strong>Never show talking heads for more than 5-7 seconds</strong> without cutting to B-roll</li>
                    <li>✓ <strong>Match B-roll to dialogue:</strong> Show what you're talking about when you talk about it</li>
                    <li>✓ <strong>Motion is key:</strong> Static shots are boring - use pans, zooms, or moving subjects</li>
                    <li>✓ <strong>Variety in shot types:</strong> Mix wide, medium, and close-up shots</li>
                    <li>✓ <strong>Smooth transitions:</strong> Use J-cuts, L-cuts, and match cuts for professional feel</li>
                  </ul>
                </div>

                <div className="p-4 border-l-4 border-primary bg-primary/5">
                  <h4 className="font-semibold mb-3">Emotional Pacing</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Great videos take viewers on an emotional journey. Use these techniques:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Music dynamics:</strong> Build tension with music swells, release with resolution</li>
                    <li>• <strong>Edit rhythm:</strong> Fast cuts for excitement, long holds for emotional moments</li>
                    <li>• <strong>Sound design:</strong> Strategic silence can be more powerful than noise</li>
                    <li>• <strong>Visual rhythm:</strong> Alternate between calm and energetic visuals</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Optimization */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <CardTitle>Engagement & Algorithm Optimization</CardTitle>
              </div>
              <CardDescription>Maximize reach and viewer retention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Retention Strategies</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✓ Pattern interrupt every 7-10 seconds (visual change, text, zoom)</li>
                      <li>✓ Open loops: Promise reveals later in the video</li>
                      <li>✓ Strategic chapter markers for easy navigation</li>
                      <li>✓ Mid-roll hooks: "But wait, there's more" moments</li>
                      <li>✓ End with CTA that drives comments, likes, or shares</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Thumbnail & Title Strategy</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✓ <strong>Thumbnail:</strong> Faces with strong emotion, high contrast, readable text</li>
                      <li>✓ <strong>Title:</strong> Front-load keywords, create curiosity, 60 chars max</li>
                      <li>✓ <strong>Consistency:</strong> Thumbnail and title must match video content</li>
                      <li>✓ <strong>Test variations:</strong> A/B test when possible</li>
                      <li>✓ <strong>Brand style:</strong> Develop recognizable visual style</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Platform-Specific Best Practices
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <strong className="text-foreground">YouTube Long-form:</strong>
                      <p className="text-muted-foreground mt-1">8-15 min sweet spot, strong first 30 sec, chapter markers</p>
                    </div>
                    <div>
                      <strong className="text-foreground">YouTube Shorts:</strong>
                      <p className="text-muted-foreground mt-1">Under 60 sec, vertical 9:16, hook in first frame, loop-able</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Social Media:</strong>
                      <p className="text-muted-foreground mt-1">Captions mandatory, silent-friendly, native uploads over links</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editing Workflow */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <CardTitle>Professional Editing Workflow</CardTitle>
              </div>
              <CardDescription>From raw footage to polished final product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold">Organization & Rough Cut</h5>
                      <p className="text-sm text-muted-foreground">
                        Import and organize all footage, create string-out of best takes, establish basic structure
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      2
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold">Story Assembly</h5>
                      <p className="text-sm text-muted-foreground">
                        Refine narrative flow, cut for pacing, remove dead air and filler words, ensure logical progression
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      3
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold">Visual Enhancement</h5>
                      <p className="text-sm text-muted-foreground">
                        Add B-roll, graphics, text overlays, transitions, color grading, visual effects
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      4
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold">Audio Mixing</h5>
                      <p className="text-sm text-muted-foreground">
                        Clean dialogue, balance music and SFX, add sound effects, normalize audio levels
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      5
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold">Final Polish & Export</h5>
                      <p className="text-sm text-muted-foreground">
                        Review for errors, test on different devices, export with optimal settings, create thumbnail
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Quality Checklist Before Publishing</h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>☑ Audio levels consistent throughout</li>
                        <li>☑ No visible mistakes or glitches</li>
                        <li>☑ Thumbnail accurately represents content</li>
                        <li>☑ Captions/subtitles added and accurate</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>☑ Opening hook is strong and clear</li>
                        <li>☑ Call-to-action is present and clear</li>
                        <li>☑ Video flows smoothly without jarring cuts</li>
                        <li>☑ Export settings match platform requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Metrics */}
          <div className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-border text-center">
            <h2 className="text-3xl font-bold mb-4">Measure What Matters</h2>
            <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
              Focus on these key metrics to understand your content's impact and improve consistently:
            </p>
            <div className="grid md:grid-cols-4 gap-6 text-left">
              <div className="p-4 bg-background/50 rounded-lg">
                <h4 className="font-semibold mb-2">Average View Duration</h4>
                <p className="text-sm text-muted-foreground">Most important metric - shows if content is engaging</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <h4 className="font-semibold mb-2">Click-Through Rate</h4>
                <p className="text-sm text-muted-foreground">Measures thumbnail and title effectiveness</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <h4 className="font-semibold mb-2">Audience Retention</h4>
                <p className="text-sm text-muted-foreground">Where viewers drop off - identify weak points</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <h4 className="font-semibold mb-2">Engagement Rate</h4>
                <p className="text-sm text-muted-foreground">Likes, comments, shares - shows content resonance</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VideoCreatorGuide;