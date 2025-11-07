import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EmailVerificationBanner = () => {
  const [user, setUser] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check current user and verification status
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user;
      setUser(currentUser);
      
      // Show banner if user exists but email is not confirmed
      if (currentUser && !currentUser.email_confirmed_at) {
        setIsVisible(true);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user;
      setUser(currentUser);
      
      if (currentUser && !currentUser.email_confirmed_at) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsResending(true);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    });

    setIsResending(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Verification Email Sent!",
        description: "Please check your inbox and spam folder.",
      });
    }
  };

  if (!isVisible || !user) return null;

  return (
    <Alert className="mb-4 bg-primary/10 border-primary/20">
      <div className="flex items-start gap-3">
        <Mail className="h-5 w-5 text-primary mt-0.5" />
        <div className="flex-1">
          <AlertDescription className="text-sm">
            <span className="font-semibold">Please verify your email address.</span>
            <br />
            We sent a verification link to <span className="font-medium">{user.email}</span>. 
            Check your inbox and spam folder.
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendVerification}
            disabled={isResending}
            className="mt-3"
          >
            {isResending ? "Sending..." : "Resend Verification Email"}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 -mt-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};

export default EmailVerificationBanner;
