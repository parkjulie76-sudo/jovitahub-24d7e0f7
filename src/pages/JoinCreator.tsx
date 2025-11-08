import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DollarSign, Zap, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const creatorSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  creatorType: z.enum(["script_writer", "video_format_creator", "video_editor", "full_video_creator", "format_storytelling_writer", "blogger"], { required_error: "Please select your creator type" }),
  experience: z.string().trim().min(1, { message: "Please select your experience level" }),
  portfolio: z.string().trim().max(500, { message: "Portfolio URL must be less than 500 characters" }).optional(),
  affiliateLink: z.string()
    .trim()
    .url({ message: "Please enter a valid URL" })
    .min(1, { message: "Affiliate link is required" })
    .max(500, { message: "Affiliate link must be less than 500 characters" })
    .refine((url) => {
      try {
        const urlObj = new URL(url);
        return urlObj.hostname.includes('payhip.com');
      } catch {
        return false;
      }
    }, { message: "Affiliate link must be from payhip.com (e.g., https://payhip.com/b/...)" }),
  message: z.string().trim().min(10, { message: "Message must be at least 10 characters" }).max(1000, { message: "Message must be less than 1000 characters" }),
  agreedToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the Terms of Service" }),
});

const JoinCreator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    creatorType: "",
    experience: "",
    portfolio: "",
    affiliateLink: "",
    message: "",
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = creatorSchema.parse(formData);
      
      // Check if user is already logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      let userId: string;
      
      if (session?.user) {
        // User is already logged in, use their ID
        userId = session.user.id;
      } else {
        // Sign up the user first
        const redirectUrl = `${window.location.origin}/dashboard`;
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (authError) {
          // Handle specific error cases
          if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
            throw new Error("This email is already registered. Please sign in instead.");
          }
          if (authError.message.includes("rate_limit") || authError.status === 429) {
            throw new Error("Too many signup attempts. Please wait a moment and try again.");
          }
          throw authError;
        }
        
        if (!authData.user) {
          throw new Error("Failed to create account. Please try again.");
        }
        
        userId = authData.user.id;
      }

      // Check if application already exists
      const { data: existingApp } = await supabase
        .from("creator_applications")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingApp) {
        toast({
          title: "Application Already Submitted",
          description: "You have already submitted a creator application. Check your dashboard for status.",
        });
        navigate("/dashboard");
        return;
      }

      // Submit creator application
      const { error: appError } = await supabase
        .from("creator_applications")
        .insert({
          user_id: userId,
          full_name: validatedData.name,
          email: validatedData.email,
          creator_type: validatedData.creatorType,
          experience: validatedData.experience,
          portfolio_url: validatedData.portfolio || null,
          affiliate_link: validatedData.affiliateLink || null,
          agreed_to_terms: validatedData.agreedToTerms,
          status: "pending",
        });

      if (appError) {
        if (appError.code === "23505") {
          throw new Error("You have already submitted an application.");
        }
        throw appError;
      }
      
      toast({
        title: "Welcome to Jovita Hub!",
        description: "Your account has been created and application submitted. Redirecting to dashboard...",
      });
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
      
    } catch (error) {
      console.error("Application submission error:", error);
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Validation Error",
          description: "Please check the form and fix any errors.",
          variant: "destructive",
        });
      } else {
        const errorMessage = error instanceof Error ? error.message : "Failed to submit application. Please try again.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join as a{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Creator
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Create viral short video scripts and edits to sell JovitaHub digital products. 
              Earn real income doing what you love.
            </p>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">High Earning Potential</h3>
                <p className="text-sm text-muted-foreground">
                  Script Writers: $1,000 - $50,000/month
                </p>
              </Card>
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Stable Income</h3>
                <p className="text-sm text-muted-foreground">
                  Video Creators: $1,000 - $3,000/month
                </p>
              </Card>
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Create Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Your content helps sell digital products and drives change
                </p>
              </Card>
            </div>
          </div>

          {/* Application Form */}
          <Card className="max-w-2xl mx-auto p-8 bg-card/50 backdrop-blur-sm border-border">
            <h2 className="text-2xl font-bold mb-6">Creator Application</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your full name"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="your@email.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              {/* Creator Type */}
              <div className="space-y-2">
                <Label htmlFor="creatorType">Creator Type *</Label>
                <Select
                  value={formData.creatorType}
                  onValueChange={(value) => handleChange("creatorType", value)}
                >
                  <SelectTrigger className={errors.creatorType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select your creator type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="script_writer">Script Writer</SelectItem>
                    <SelectItem value="format_storytelling_writer">Writer (Format + Storytelling Script)</SelectItem>
                    <SelectItem value="blogger">Blogger</SelectItem>
                    <SelectItem value="video_format_creator">Video Format Creator</SelectItem>
                    <SelectItem value="video_editor">Video Editor</SelectItem>
                    <SelectItem value="full_video_creator">Video Creator (Format + Script + Video Edit)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.creatorType && <p className="text-sm text-destructive">{errors.creatorType}</p>}
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level *</Label>
                <RadioGroup
                  value={formData.experience}
                  onValueChange={(value) => handleChange("experience", value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner" className="font-normal cursor-pointer">
                      Beginner (0-1 years)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate" className="font-normal cursor-pointer">
                      Intermediate (1-3 years)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expert" id="expert" />
                    <Label htmlFor="expert" className="font-normal cursor-pointer">
                      Expert (3+ years)
                    </Label>
                  </div>
                </RadioGroup>
                {errors.experience && <p className="text-sm text-destructive">{errors.experience}</p>}
              </div>

              {/* Portfolio */}
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio/Samples Link (Optional)</Label>
                <Input
                  id="portfolio"
                  value={formData.portfolio}
                  onChange={(e) => handleChange("portfolio", e.target.value)}
                  placeholder="https://your-portfolio.com or social media link"
                  className={errors.portfolio ? "border-destructive" : ""}
                />
                {errors.portfolio && <p className="text-sm text-destructive">{errors.portfolio}</p>}
              </div>

              {/* Affiliate Link - REQUIRED */}
              <div className="space-y-3">
                <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 animate-pulse-subtle">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-base flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        Get Your Affiliate Link First
                      </h3>
                      <Badge variant="destructive" className="animate-pulse">Required</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Before filling out the form, you must register and get your unique affiliate link. 
                      <span className="font-semibold text-foreground"> Use the same email address</span> for tracking.
                    </p>
                    <Button 
                      variant="default" 
                      size="lg" 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open('https://payhip.com/auth/register/af68eb302bd61bd', '_blank', 'noopener,noreferrer');
                      }}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 animate-pulse shadow-lg shadow-primary/50"
                    >
                      🔗 Click Here and Get Your Affiliate Link
                    </Button>
                  </div>
                </Card>

                <div className="space-y-2">
                  <Label htmlFor="affiliateLink">
                    Copy and Paste Your Affiliate Link * <span className="text-xs text-muted-foreground">(from Payhip)</span>
                  </Label>
                  <Input
                    id="affiliateLink"
                    value={formData.affiliateLink}
                    onChange={(e) => handleChange("affiliateLink", e.target.value)}
                    placeholder="https://payhip.com/b/..."
                    className={errors.affiliateLink ? "border-destructive" : ""}
                    required
                  />
                  {errors.affiliateLink && <p className="text-sm text-destructive">{errors.affiliateLink}</p>}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Tell us about yourself *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Why do you want to join? What makes your work stand out?"
                  rows={5}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
              </div>


              {/* Terms of Service Agreement */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => handleChange("agreedToTerms", checked === true)}
                    className={errors.agreedToTerms ? "border-destructive" : ""}
                  />
                  <Label htmlFor="terms" className="font-normal leading-relaxed cursor-pointer">
                    I agree to the{" "}
                    <Link to="/terms-of-service" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    *
                  </Label>
                </div>
                {errors.agreedToTerms && <p className="text-sm text-destructive">{errors.agreedToTerms}</p>}
              </div>

              <Button
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JoinCreator;
