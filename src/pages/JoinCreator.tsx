import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DollarSign, Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const creatorSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  creatorType: z.enum(["script-writer", "video-editor"], { required_error: "Please select your creator type" }),
  experience: z.string().trim().min(1, { message: "Please select your experience level" }),
  portfolio: z.string().trim().max(500, { message: "Portfolio URL must be less than 500 characters" }).optional(),
  message: z.string().trim().min(10, { message: "Message must be at least 10 characters" }).max(1000, { message: "Message must be less than 1000 characters" }),
  agreedToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the Terms of Service" }),
});

const JoinCreator = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    creatorType: "",
    experience: "",
    portfolio: "",
    message: "",
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = creatorSchema.parse(formData);
      
      // Here you would typically send to your backend or Supabase
      console.log("Form submitted:", validatedData);
      
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        creatorType: "",
        experience: "",
        portfolio: "",
        message: "",
        agreedToTerms: false,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    const processedValue = field === "agreedToTerms" ? value === "true" : value;
    setFormData(prev => ({ ...prev, [field]: processedValue }));
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
                  Video Editors: $1,000 - $3,000/month
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

              {/* Creator Type */}
              <div className="space-y-2">
                <Label>I am a *</Label>
                <RadioGroup
                  value={formData.creatorType}
                  onValueChange={(value) => handleChange("creatorType", value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="script-writer" id="script-writer" />
                    <Label htmlFor="script-writer" className="font-normal cursor-pointer">
                      Script Writer (Viral short video scripts)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="video-editor" id="video-editor" />
                    <Label htmlFor="video-editor" className="font-normal cursor-pointer">
                      Video Editor (Short video editing)
                    </Label>
                  </div>
                </RadioGroup>
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
                    onCheckedChange={(checked) => handleChange("agreedToTerms", checked.toString())}
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
