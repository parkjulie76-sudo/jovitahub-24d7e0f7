import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, CheckCircle2, AlertCircle } from "lucide-react";

const AdminSetup = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    setLoading(true);

    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Check if current user is admin
    const { data: currentUserRoles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);

    const isAdmin = currentUserRoles?.some(role => role.role === "admin") || false;
    setIsCurrentUserAdmin(isAdmin);

    // Check if any admin exists
    const { data: adminRoles, error: adminError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("role", "admin");

    if (adminError) {
      toast({
        title: "Error",
        description: "Failed to check admin status",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const hasAdmin = adminRoles && adminRoles.length > 0;
    setAdminExists(hasAdmin);

    setLoading(false);
  };

  const claimAdminRole = async () => {
    if (!user) return;

    setClaiming(true);

    try {
      // Call secure edge function instead of direct database insert
      const { data, error } = await supabase.functions.invoke("assign-admin-role");

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || "Failed to claim admin role");
      }

      toast({
        title: "Success!",
        description: "You are now an admin. Redirecting to dashboard...",
      });
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to claim admin role",
        variant: "destructive",
      });
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Checking admin status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-accent/5">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
            <CardDescription>
              {adminExists 
                ? "Admin configuration status" 
                : "Claim the first admin role"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCurrentUserAdmin ? (
              <>
                <Alert className="border-green-500/50 bg-green-500/5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <strong>You are an admin!</strong> You have full access to the platform.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => navigate("/dashboard")} 
                    className="flex-1"
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    onClick={() => navigate("/")} 
                    variant="outline"
                    className="flex-1"
                  >
                    Go Home
                  </Button>
                </div>
              </>
            ) : !adminExists ? (
              <>
                <Alert className="border-primary/50 bg-primary/5">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    <strong>No admin exists yet!</strong> Be the first to claim the admin role.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4 pt-2">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p><strong>Admin privileges include:</strong></p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>Approve or reject creator applications</li>
                      <li>Review and manage submitted scripts</li>
                      <li>Review and manage submitted videos</li>
                      <li>Manage user roles</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={claimAdminRole} 
                    className="w-full" 
                    size="lg"
                    disabled={claiming}
                  >
                    {claiming ? "Claiming Admin Role..." : "Claim Admin Role"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You don't have admin access. Contact an existing admin to grant you permissions.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={() => navigate("/")} 
                  variant="outline"
                  className="w-full"
                >
                  Back to Home
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminSetup;
