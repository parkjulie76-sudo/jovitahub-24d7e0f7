import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.string().trim().email({ message: "Please enter a valid email address" }).max(255, { message: "Email must be less than 255 characters" });

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate email
      const validatedEmail = emailSchema.parse(email);

      // Insert into database
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert({ email: validatedEmail });

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation - email already subscribed
          toast({
            title: "Already Subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully Subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail("");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid Email",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Subscription Failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Jovita Hub</h3>
            <p className="text-secondary-foreground/80 text-sm">
              Empowering creators to make meaningful content and lasting impact.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Creators</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li><Link to="/join-creator" className="hover:text-secondary-foreground transition-colors">Join as Creator</Link></li>
              <li><Link to="/script-writers" className="hover:text-secondary-foreground transition-colors">Script Writers</Link></li>
              <li><Link to="/video-creators" className="hover:text-secondary-foreground transition-colors">Video Creators</Link></li>
              <li><a href="/#how-it-works" className="hover:text-secondary-foreground transition-colors">How It Works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li><Link to="/about" className="hover:text-secondary-foreground transition-colors">About Us</Link></li>
              <li><Link to="/charity" className="hover:text-secondary-foreground transition-colors">Our Impact</Link></li>
              <li><Link to="/careers" className="hover:text-secondary-foreground transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li><Link to="/help" className="hover:text-secondary-foreground transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-secondary-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-secondary-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-secondary-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mb-8 max-w-md">
          <h4 className="font-semibold mb-4">Newsletter</h4>
          <p className="text-sm text-secondary-foreground/80 mb-4">
            Stay updated with our latest opportunities and news.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 border-secondary-foreground/20"
              disabled={isSubmitting}
              required
            />
            <Button 
              type="submit" 
              variant="secondary" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-secondary-foreground/60 mb-4 md:mb-0">
            © 2025 Jovita Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-secondary-foreground/80">
            <span>Made with</span>
            <Heart className="w-4 h-4 fill-accent text-accent" />
            <span>for creators everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
