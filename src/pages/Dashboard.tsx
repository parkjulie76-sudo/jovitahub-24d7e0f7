import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, Video, Download } from "lucide-react";
import AdminUserManagement from "@/components/AdminUserManagement";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasGuideAccess, setHasGuideAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [scripts, setScripts] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Check if user is admin
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);

    const userRoles = roles?.map(r => r.role) || [];
    const hasAdminRole = userRoles.includes("admin");
    const hasGuideRoles = userRoles.some(role => 
      ["admin", "script_writer", "video_creator"].includes(role)
    );
    
    setIsAdmin(hasAdminRole);
    setHasGuideAccess(hasGuideRoles);

    if (hasAdminRole) {
      loadAllData();
    } else {
      loadUserData(session.user.id);
    }
    
    setLoading(false);
  };

  const loadAllData = async () => {
    const [appsResult, scriptsResult, videosResult] = await Promise.all([
      supabase.from("creator_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("scripts").select("*").order("created_at", { ascending: false }),
      supabase.from("videos").select("*").order("created_at", { ascending: false }),
    ]);

    setApplications(appsResult.data || []);
    setScripts(scriptsResult.data || []);
    setVideos(videosResult.data || []);
  };

  const loadUserData = async (userId: string) => {
    const [appsResult, scriptsResult, videosResult] = await Promise.all([
      supabase.from("creator_applications").select("*").eq("user_id", userId),
      supabase.from("scripts").select("*").eq("user_id", userId),
      supabase.from("videos").select("*").eq("user_id", userId),
    ]);

    setApplications(appsResult.data || []);
    setScripts(scriptsResult.data || []);
    setVideos(videosResult.data || []);
  };

  const updateStatus = async (table: string, id: string, status: string) => {
    const { error } = await supabase
      .from(table as any)
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
      if (isAdmin) {
        loadAllData();
      } else {
        loadUserData(user.id);
      }
    }
  };

  const downloadScripts = () => {
    const csvContent = [
      ["Title", "Description", "Content", "Status", "User ID", "Created At"].join(","),
      ...scripts.map(script => [
        `"${script.title}"`,
        `"${script.description || ''}"`,
        `"${script.content}"`,
        script.status,
        script.user_id,
        new Date(script.created_at).toLocaleString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scripts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadVideos = () => {
    const csvContent = [
      ["Title", "Description", "Video URL", "Thumbnail URL", "Status", "User ID", "Created At"].join(","),
      ...videos.map(video => [
        `"${video.title}"`,
        `"${video.description || ''}"`,
        video.video_url,
        video.thumbnail_url || '',
        video.status,
        video.user_id,
        new Date(video.created_at).toLocaleString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `videos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <EmailVerificationBanner />
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">
              {isAdmin ? "Admin Dashboard" : "My Dashboard"}
            </h1>
            <div className="flex gap-2">
              {hasGuideAccess && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/script-writer-guide")}
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Writer's Guide
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/video-creator-guide")}
                    className="flex items-center gap-2"
                  >
                    <Video className="h-4 w-4" />
                    Video Guide
                  </Button>
                </>
              )}
              <Button onClick={() => navigate("/submit-script")}>Submit Script</Button>
              <Button onClick={() => navigate("/submit-video")}>Submit Video</Button>
            </div>
          </div>

          <Tabs defaultValue="applications" className="w-full">
            <TabsList>
              <TabsTrigger value="applications">Creator Applications</TabsTrigger>
              <TabsTrigger value="scripts">Scripts</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              {isAdmin && <TabsTrigger value="admin">Admin Management</TabsTrigger>}
            </TabsList>

            <TabsContent value="applications">
              <Card className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      {isAdmin && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>{app.full_name}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>
                          <Badge variant={app.status === "approved" ? "default" : "secondary"}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateStatus("creator_applications", app.id, "approved")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateStatus("creator_applications", app.id, "rejected")}
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="scripts">
              <Card className="p-6">
                {isAdmin && (
                  <div className="flex justify-end mb-4">
                    <Button 
                      variant="outline" 
                      onClick={downloadScripts}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Scripts
                    </Button>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      {isAdmin && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scripts.map((script) => (
                      <TableRow key={script.id}>
                        <TableCell>{script.title}</TableCell>
                        <TableCell>{script.description}</TableCell>
                        <TableCell>
                          <Badge variant={script.status === "approved" ? "default" : "secondary"}>
                            {script.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(script.created_at).toLocaleDateString()}</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateStatus("scripts", script.id, "approved")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateStatus("scripts", script.id, "rejected")}
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="videos">
              <Card className="p-6">
                {isAdmin && (
                  <div className="flex justify-end mb-4">
                    <Button 
                      variant="outline" 
                      onClick={downloadVideos}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Videos
                    </Button>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      {isAdmin && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell>{video.title}</TableCell>
                        <TableCell>{video.description}</TableCell>
                        <TableCell>
                          <Badge variant={video.status === "approved" ? "default" : "secondary"}>
                            {video.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(video.created_at).toLocaleDateString()}</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateStatus("videos", video.id, "approved")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateStatus("videos", video.id, "rejected")}
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="admin">
                <AdminUserManagement />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
