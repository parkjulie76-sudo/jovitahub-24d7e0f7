import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
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
