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
import { BookOpen, Video, Download, ExternalLink, Plus, Pencil, Trash2, Briefcase, Eye, DollarSign } from "lucide-react";
import AdminUserManagement from "@/components/AdminUserManagement";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [jobPositions, setJobPositions] = useState<any[]>([]);
  const [isPositionDialogOpen, setIsPositionDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<any>(null);
  const [positionForm, setPositionForm] = useState({
    title: '',
    type: '',
    icon: 'briefcase',
    description: '',
    requirements: ''
  });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewDialogContent, setViewDialogContent] = useState<any>(null);
  const [viewDialogType, setViewDialogType] = useState<'script' | 'video' | 'application' | null>(null);
  const [commissionData, setCommissionData] = useState<{
    total_commission: number;
    pending_payout: number;
    projects_count: number;
  } | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    script_id: '',
    assigned_to: '',
    role: '',
    requirements: ''
  });
  const [profiles, setProfiles] = useState<any[]>([]);

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
    const [appsResult, scriptsResult, videosResult, contactResult, positionsResult, assignmentsResult, profilesResult] = await Promise.all([
      supabase.from("creator_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("scripts").select("*, profiles(first_name, last_name)").order("created_at", { ascending: false }),
      supabase.from("videos").select("*, scripts(serial_number, title), video_assignments(id)").order("created_at", { ascending: false }),
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("job_positions").select("*").order("created_at", { ascending: false }),
      supabase.from("video_assignments").select("*, scripts(serial_number, title), profiles!video_assignments_assigned_to_fkey(id, first_name, last_name)").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, first_name, last_name, serial_number")
    ]);

    setApplications(appsResult.data || []);
    setScripts(scriptsResult.data || []);
    setVideos(videosResult.data || []);
    setContactSubmissions(contactResult.data || []);
    setJobPositions(positionsResult.data || []);
    setAssignments(assignmentsResult.data || []);
    setProfiles(profilesResult.data || []);
  };

  const loadUserData = async (userId: string) => {
    const [appsResult, scriptsResult, videosResult, splitsResult, assignmentsResult] = await Promise.all([
      supabase.from("creator_applications").select("*").eq("user_id", userId),
      supabase.from("scripts").select("*").eq("user_id", userId),
      supabase.from("videos").select("*, scripts(serial_number, title), video_assignments(id)").eq("user_id", userId),
      supabase.from("commission_splits").select("*, payhip_sales(sale_amount)").eq("contributor_id", userId),
      supabase.from("video_assignments").select("*, scripts(serial_number, title)").eq("assigned_to", userId).order("created_at", { ascending: false }),
    ]);

    setApplications(appsResult.data || []);
    setScripts(scriptsResult.data || []);
    setVideos(videosResult.data || []);
    setAssignments(assignmentsResult.data || []);

    // Calculate commission data
    if (splitsResult.data) {
      const totalCommission = splitsResult.data.reduce((sum, split) => 
        sum + parseFloat(split.commission_amount.toString()), 0
      );
      
      const projectIds = new Set(splitsResult.data.map(s => s.video_id));
      
      // Get payout history
      const { data: payouts } = await supabase
        .from('payout_records')
        .select('*')
        .eq('contributor_id', userId)
        .eq('status', 'completed');

      const completedPayouts = payouts?.reduce((sum, p) => 
        sum + parseFloat(p.amount.toString()), 0
      ) || 0;

      setCommissionData({
        total_commission: totalCommission,
        pending_payout: totalCommission - completedPayouts,
        projects_count: projectIds.size,
      });
    }
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
      ["Serial Number", "Title", "Description", "Content", "Status", "User ID", "Created At"].join(","),
      ...scripts.map(script => [
        script.serial_number || 'N/A',
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
      ["Serial Number", "Title", "Description", "Video URL", "Thumbnail URL", "Status", "User ID", "Created At"].join(","),
      ...videos.map(video => [
        video.serial_number || 'N/A',
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

  const handleSavePosition = async () => {
    if (!positionForm.title || !positionForm.type || !positionForm.description || !positionForm.requirements) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const requirements = positionForm.requirements.split('\n').filter(r => r.trim());
    
    if (editingPosition) {
      const { error } = await supabase
        .from('job_positions')
        .update({
          title: positionForm.title,
          type: positionForm.type,
          icon: positionForm.icon,
          description: positionForm.description,
          requirements
        })
        .eq('id', editingPosition.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update position",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "Position updated successfully"
      });
    } else {
      const { error } = await supabase
        .from('job_positions')
        .insert({
          title: positionForm.title,
          type: positionForm.type,
          icon: positionForm.icon,
          description: positionForm.description,
          requirements,
          created_by: user.id
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create position",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "Position created successfully"
      });
    }

    setIsPositionDialogOpen(false);
    loadAllData();
  };

  const togglePositionStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('job_positions')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update position status",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: `Position ${!currentStatus ? 'activated' : 'deactivated'} successfully`
    });
    
    loadAllData();
  };

  const deletePosition = async (id: string) => {
    if (!confirm('Are you sure you want to delete this position?')) return;

    const { error } = await supabase
      .from('job_positions')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete position",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Position deleted successfully"
    });
    
    loadAllData();
  };

  const handleSaveAssignment = async () => {
    if (!assignmentForm.script_id || !assignmentForm.assigned_to || !assignmentForm.role || !assignmentForm.requirements) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("video_assignments")
      .insert({
        script_id: assignmentForm.script_id,
        assigned_to: assignmentForm.assigned_to,
        assigned_by: user.id,
        role: assignmentForm.role,
        requirements: assignmentForm.requirements,
        status: 'assigned'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Assignment created successfully",
      });
      setIsAssignmentDialogOpen(false);
      setAssignmentForm({ script_id: '', assigned_to: '', role: '', requirements: '' });
      loadAllData();
    }
  };

  const updateAssignmentStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("video_assignments")
      .update({ 
        status,
        ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {})
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update assignment status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Assignment status updated",
      });
      if (isAdmin) {
        loadAllData();
      } else {
        loadUserData(user.id);
      }
    }
  };

  const downloadApplications = () => {
    const csvContent = [
      ["Name", "Email", "Creator Type", "Experience Level", "Portfolio URL", "Affiliate Link", "Status", "Created At"].join(","),
      ...applications.map(app => [
        `"${app.full_name}"`,
        app.email,
        app.creator_type ? app.creator_type.replace(/_/g, ' ').toUpperCase() : 'N/A',
        app.experience ? app.experience.replace(/_/g, ' ').toUpperCase() : 'N/A',
        app.portfolio_url || '',
        app.affiliate_link || '',
        app.status,
        new Date(app.created_at).toLocaleString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `creator_applications_${new Date().toISOString().split('T')[0]}.csv`;
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
              {isAdmin && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/admin/commissions")}
                  className="flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  Manage Commissions
                </Button>
              )}
              {!isAdmin && hasGuideAccess && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/commissions")}
                  className="flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  My Commissions
                </Button>
              )}
              <Button onClick={() => navigate("/submit-script")}>Submit Script</Button>
              <Button onClick={() => navigate("/submit-video")}>Submit Video</Button>
            </div>
          </div>

          {/* Commission Summary for all users */}
          {commissionData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Commission</p>
                    <p className="text-2xl font-bold">${commissionData.total_commission.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pending Payout</p>
                    <p className="text-2xl font-bold text-primary">${commissionData.pending_payout.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Projects</p>
                    <p className="text-2xl font-bold">{commissionData.projects_count}</p>
                  </div>
                  <Video className="h-8 w-8 text-primary" />
                </div>
              </Card>
            </div>
          )}

          <Tabs defaultValue="applications" className="w-full">
            <TabsList>
              <TabsTrigger value="applications">Creator Applications</TabsTrigger>
              <TabsTrigger value="scripts">Scripts</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              {isAdmin && <TabsTrigger value="contact">Contact Submissions</TabsTrigger>}
              {isAdmin && <TabsTrigger value="positions">Job Positions</TabsTrigger>}
              {isAdmin && <TabsTrigger value="admin">Admin Management</TabsTrigger>}
            </TabsList>

            <TabsContent value="applications">
              <Card className="p-6">
                {isAdmin && (
                  <div className="flex justify-end mb-4">
                    <Button 
                      variant="outline" 
                      onClick={downloadApplications}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Applications
                    </Button>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Creator Type</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Portfolio</TableHead>
                      <TableHead>Affiliate Link</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      {isAdmin && <TableHead>About</TableHead>}
                      {isAdmin && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>{app.full_name}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>
                          {app.creator_type ? (
                            <Badge variant="outline">
                              {app.creator_type === 'script_writer' && 'Script Writer'}
                              {app.creator_type === 'format_storytelling_writer' && 'Writer (Format + Storytelling)'}
                              {app.creator_type === 'blogger' && 'Blogger'}
                              {app.creator_type === 'video_format_creator' && 'Video Format Creator'}
                              {app.creator_type === 'video_editor' && 'Video Editor'}
                              {app.creator_type === 'full_video_creator' && 'Full Video Creator'}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {app.experience ? (
                            <Badge variant="secondary">
                              {app.experience.charAt(0).toUpperCase() + app.experience.slice(1)}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {app.portfolio_url ? (
                            <a 
                              href={app.portfolio_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              View <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {app.affiliate_link ? (
                            <a 
                              href={app.affiliate_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              View <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={app.status === "approved" ? "default" : "secondary"}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setViewDialogContent(app);
                                setViewDialogType('application');
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        )}
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
                      <TableHead>Serial #</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>File/Link</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      {isAdmin && <TableHead>View</TableHead>}
                      {isAdmin && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scripts.map((script) => (
                      <TableRow key={script.id}>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {script.serial_number}
                          </Badge>
                        </TableCell>
                        <TableCell>{script.title}</TableCell>
                        <TableCell>{script.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {script.file_url && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  try {
                                    // Extract file path from public URL
                                    const fileName = script.file_url.split('/scripts/')[1];
                                    if (!fileName) {
                                      toast({
                                        title: "Error",
                                        description: "Invalid file path",
                                        variant: "destructive",
                                      });
                                      return;
                                    }

                                    // Download using authenticated request
                                    const { data, error } = await supabase.storage
                                      .from('scripts')
                                      .download(fileName);

                                    if (error) throw error;

                                    // Create download link
                                    const url = window.URL.createObjectURL(data);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = fileName.split('/').pop() || 'script.docx';
                                    a.click();
                                    window.URL.revokeObjectURL(url);

                                    toast({
                                      title: "Success",
                                      description: "Script downloaded successfully",
                                    });
                                  } catch (error: any) {
                                    toast({
                                      title: "Error",
                                      description: error.message || "Failed to download script",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                                className="flex items-center gap-1 text-sm"
                              >
                                <Download className="h-3 w-3" />
                                Download Script
                              </Button>
                            )}
                            {script.content && !script.file_url && !script.google_drive_link && (
                              <span className="text-muted-foreground text-sm">Text content</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={script.status === "approved" ? "default" : "secondary"}>
                            {script.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(script.created_at).toLocaleDateString()}</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setViewDialogContent(script);
                                setViewDialogType('script');
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Read
                            </Button>
                          </TableCell>
                        )}
                        {isAdmin && (
                          <TableCell>
                            <div className="flex gap-2 flex-wrap">
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
                              {script.status === "approved" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setAssignmentForm({
                                      script_id: script.id,
                                      assigned_to: '',
                                      role: '',
                                      requirements: ''
                                    });
                                    setIsAssignmentDialogOpen(true);
                                  }}
                                >
                                  Assign
                                </Button>
                              )}
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
                      <TableHead>Video Serial</TableHead>
                      <TableHead>Script</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      {isAdmin && <TableHead>Video URL</TableHead>}
                      {isAdmin && <TableHead>Thumbnail URL</TableHead>}
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      {isAdmin && <TableHead>View</TableHead>}
                      {isAdmin && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {video.serial_number}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {video.scripts ? (
                            <div>
                              <Badge variant="secondary" className="font-mono text-xs mb-1">
                                {video.scripts.serial_number}
                              </Badge>
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {video.scripts.title}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{video.title}</TableCell>
                        <TableCell>{video.description}</TableCell>
                        {isAdmin && (
                          <TableCell>
                            {video.video_url ? (
                              <a 
                                href={video.video_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                View <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        )}
                        {isAdmin && (
                          <TableCell>
                            {video.thumbnail_url ? (
                              <a 
                                href={video.thumbnail_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                View <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        )}
                        <TableCell>
                          <Badge variant={video.status === "approved" ? "default" : "secondary"}>
                            {video.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(video.created_at).toLocaleDateString()}</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setViewDialogContent(video);
                                setViewDialogType('video');
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        )}
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
              <TabsContent value="contact">
                <Card className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>{submission.name}</TableCell>
                          <TableCell>{submission.email}</TableCell>
                          <TableCell>{submission.subject}</TableCell>
                          <TableCell className="max-w-xs truncate">{submission.message}</TableCell>
                          <TableCell>
                            {submission.resume_url ? (
                              <a 
                                href={submission.resume_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                View <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={submission.status === "resolved" ? "default" : "secondary"}>
                              {submission.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateStatus("contact_submissions", submission.id, "resolved")}
                              >
                                Mark Resolved
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            )}

            {isAdmin && (
              <TabsContent value="positions">
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Job Positions</h2>
                    <Dialog open={isPositionDialogOpen} onOpenChange={setIsPositionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => {
                          setEditingPosition(null);
                          setPositionForm({
                            title: '',
                            type: '',
                            icon: 'briefcase',
                            description: '',
                            requirements: ''
                          });
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Position
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{editingPosition ? 'Edit Position' : 'Add New Position'}</DialogTitle>
                          <DialogDescription>
                            {editingPosition ? 'Update the job position details' : 'Create a new job position to display on the careers page'}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Position Title</Label>
                            <Input
                              id="title"
                              value={positionForm.title}
                              onChange={(e) => setPositionForm({...positionForm, title: e.target.value})}
                              placeholder="e.g., Community Manager"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="type">Job Type</Label>
                            <Input
                              id="type"
                              value={positionForm.type}
                              onChange={(e) => setPositionForm({...positionForm, type: e.target.value})}
                              placeholder="e.g., Full-time, Part-time, Contract"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="icon">Icon</Label>
                            <Select value={positionForm.icon} onValueChange={(value) => setPositionForm({...positionForm, icon: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="briefcase">Briefcase</SelectItem>
                                <SelectItem value="users">Users</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="filetext">File Text</SelectItem>
                                <SelectItem value="megaphone">Megaphone</SelectItem>
                                <SelectItem value="trendingup">Trending Up</SelectItem>
                                <SelectItem value="messagesquare">Message Square</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={positionForm.description}
                              onChange={(e) => setPositionForm({...positionForm, description: e.target.value})}
                              placeholder="Brief description of the position"
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="requirements">Requirements (one per line)</Label>
                            <Textarea
                              id="requirements"
                              value={positionForm.requirements}
                              onChange={(e) => setPositionForm({...positionForm, requirements: e.target.value})}
                              placeholder="Enter each requirement on a new line"
                              rows={5}
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsPositionDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSavePosition}>
                              {editingPosition ? 'Update' : 'Create'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobPositions.map((position) => (
                        <TableRow key={position.id}>
                          <TableCell className="font-medium">{position.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{position.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={position.is_active ? "default" : "secondary"}>
                              {position.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(position.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingPosition(position);
                                  setPositionForm({
                                    title: position.title,
                                    type: position.type,
                                    icon: position.icon,
                                    description: position.description,
                                    requirements: position.requirements.join('\n')
                                  });
                                  setIsPositionDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => togglePositionStatus(position.id, position.is_active)}
                              >
                                {position.is_active ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deletePosition(position.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="assignments">
              <Card className="p-6">
                {isAdmin && (
                  <div className="flex justify-end mb-4">
                    <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Create Assignment
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create Video Assignment</DialogTitle>
                          <DialogDescription>
                            Assign a script to a video creator or editor with production requirements
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label>Script</Label>
                            <Select 
                              value={assignmentForm.script_id} 
                              onValueChange={(value) => setAssignmentForm({...assignmentForm, script_id: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a script" />
                              </SelectTrigger>
                              <SelectContent>
                                {scripts.filter(s => s.status === 'approved').map((script) => (
                                  <SelectItem key={script.id} value={script.id}>
                                    {script.serial_number} - {script.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Assign To</Label>
                            <Select 
                              value={assignmentForm.assigned_to} 
                              onValueChange={(value) => setAssignmentForm({...assignmentForm, assigned_to: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select user" />
                              </SelectTrigger>
                              <SelectContent>
                                {profiles.map((profile) => (
                                  <SelectItem key={profile.id} value={profile.id}>
                                    {profile.serial_number} - {profile.first_name} {profile.last_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Role</Label>
                            <Select 
                              value={assignmentForm.role} 
                              onValueChange={(value) => setAssignmentForm({...assignmentForm, role: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="video_creator">Video Creator</SelectItem>
                                <SelectItem value="video_editor">Video Editor</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Production Requirements</Label>
                            <Textarea
                              value={assignmentForm.requirements}
                              onChange={(e) => setAssignmentForm({...assignmentForm, requirements: e.target.value})}
                              placeholder="Enter detailed production requirements..."
                              rows={6}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAssignmentDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveAssignment}>
                            Create Assignment
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Script</TableHead>
                      {isAdmin && <TableHead>Assigned To</TableHead>}
                      <TableHead>Role</TableHead>
                      <TableHead>Requirements</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isAdmin ? 7 : 6} className="text-center text-muted-foreground">
                          No assignments yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      assignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell>
                            <div className="space-y-2">
                              <div>
                                <Badge variant="outline" className="font-mono text-xs mb-1">
                                  {assignment.scripts?.serial_number}
                                </Badge>
                                <p className="text-sm">{assignment.scripts?.title}</p>
                              </div>
                              {assignment.scripts?.file_url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={async () => {
                                    try {
                                      const fileName = assignment.scripts.file_url.split('/scripts/')[1];
                                      if (!fileName) {
                                        toast({
                                          title: "Error",
                                          description: "Invalid file path",
                                          variant: "destructive",
                                        });
                                        return;
                                      }

                                      const { data, error } = await supabase.storage
                                        .from('scripts')
                                        .download(fileName);

                                      if (error) throw error;

                                      const url = window.URL.createObjectURL(data);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = fileName.split('/').pop() || 'script.docx';
                                      a.click();
                                      window.URL.revokeObjectURL(url);

                                      toast({
                                        title: "Success",
                                        description: "Script downloaded successfully",
                                      });
                                    } catch (error: any) {
                                      toast({
                                        title: "Error",
                                        description: error.message || "Failed to download script",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                  className="flex items-center gap-1 w-full"
                                >
                                  <Download className="h-3 w-3" />
                                  Download Script
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          {isAdmin && (
                            <TableCell>
                              {assignment.profiles?.first_name} {assignment.profiles?.last_name}
                            </TableCell>
                          )}
                          <TableCell>
                            <Badge variant="secondary">
                              {assignment.role === 'video_creator' ? 'Video Creator' : 'Video Editor'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate" title={assignment.requirements}>
                              {assignment.requirements}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              assignment.status === 'completed' ? 'default' : 
                              assignment.status === 'in_progress' ? 'secondary' : 
                              'outline'
                            }>
                              {assignment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(assignment.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2 flex-wrap">
                              {!isAdmin && assignment.status === 'assigned' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateAssignmentStatus(assignment.id, 'in_progress')}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => updateAssignmentStatus(assignment.id, 'rejected')}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {!isAdmin && assignment.status === 'in_progress' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateAssignmentStatus(assignment.id, 'completed')}
                                >
                                  Mark Complete
                                </Button>
                              )}
                              {isAdmin && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setViewDialogContent(assignment);
                                    setViewDialogType('script');
                                    setViewDialogOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewDialogType === 'script' && 'Script Details'}
              {viewDialogType === 'video' && 'Video Details'}
              {viewDialogType === 'application' && 'Application Details'}
            </DialogTitle>
          </DialogHeader>
          
          {viewDialogType === 'script' && viewDialogContent && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="font-semibold">Serial Number</Label>
                <p className="mt-1 text-muted-foreground">{viewDialogContent.serial_number}</p>
              </div>
              <div>
                <Label className="font-semibold">Title</Label>
                <p className="mt-1">{viewDialogContent.title}</p>
              </div>
              <div>
                <Label className="font-semibold">Description</Label>
                <p className="mt-1 text-muted-foreground">{viewDialogContent.description || 'No description provided'}</p>
              </div>
              
              {viewDialogContent.file_url && (
                <div>
                  <Label className="font-semibold">Uploaded File</Label>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        const fileName = viewDialogContent.file_url.split('/scripts/')[1];
                        if (!fileName) {
                          toast({
                            title: "Error",
                            description: "Invalid file path",
                            variant: "destructive",
                          });
                          return;
                        }

                        const { data, error } = await supabase.storage
                          .from('scripts')
                          .download(fileName);

                        if (error) throw error;

                        const url = window.URL.createObjectURL(data);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName.split('/').pop() || 'script.docx';
                        a.click();
                        window.URL.revokeObjectURL(url);

                        toast({
                          title: "Success",
                          description: "Script downloaded successfully",
                        });
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description: error.message || "Failed to download script",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="mt-2 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Script
                  </Button>
                </div>
              )}
              
              {viewDialogContent.google_drive_link && (
                <div>
                  <Label className="font-semibold">Google Drive Link</Label>
                  <a 
                    href={viewDialogContent.google_drive_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-2 text-primary hover:underline"
                  >
                    {viewDialogContent.google_drive_link}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
              
              {viewDialogContent.content && (
                <div>
                  <Label className="font-semibold">Script Content</Label>
                  <div className="mt-2 p-4 bg-muted rounded-lg max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{viewDialogContent.content}</pre>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4">
                <div>
                  <Label className="font-semibold">Status</Label>
                  <p className="mt-1">
                    <Badge variant={viewDialogContent.status === "approved" ? "default" : "secondary"}>
                      {viewDialogContent.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Submitted</Label>
                  <p className="mt-1 text-muted-foreground">{new Date(viewDialogContent.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {viewDialogType === 'video' && viewDialogContent && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="font-semibold">Serial Number</Label>
                <p className="mt-1 text-muted-foreground">{viewDialogContent.serial_number}</p>
              </div>
              <div>
                <Label className="font-semibold">Title</Label>
                <p className="mt-1">{viewDialogContent.title}</p>
              </div>
              <div>
                <Label className="font-semibold">Description</Label>
                <p className="mt-1 text-muted-foreground">{viewDialogContent.description || 'No description provided'}</p>
              </div>
              <div>
                <Label className="font-semibold">Video URL</Label>
                <a 
                  href={viewDialogContent.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-2 text-primary hover:underline"
                >
                  {viewDialogContent.video_url}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              {viewDialogContent.thumbnail_url && (
                <div>
                  <Label className="font-semibold">Thumbnail</Label>
                  <div className="mt-2">
                    <img 
                      src={viewDialogContent.thumbnail_url} 
                      alt="Video thumbnail"
                      className="max-w-md rounded-lg border"
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-4">
                <div>
                  <Label className="font-semibold">Status</Label>
                  <p className="mt-1">
                    <Badge variant={viewDialogContent.status === "approved" ? "default" : "secondary"}>
                      {viewDialogContent.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Submitted</Label>
                  <p className="mt-1 text-muted-foreground">{new Date(viewDialogContent.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {viewDialogType === 'application' && viewDialogContent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Full Name</Label>
                  <p className="mt-1">{viewDialogContent.full_name}</p>
                </div>
                <div>
                  <Label className="font-semibold">Email</Label>
                  <p className="mt-1">{viewDialogContent.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Creator Type</Label>
                  <p className="mt-1">
                    {viewDialogContent.creator_type === 'script_writer' && 'Script Writer'}
                    {viewDialogContent.creator_type === 'format_storytelling_writer' && 'Writer (Format + Storytelling)'}
                    {viewDialogContent.creator_type === 'blogger' && 'Blogger'}
                    {viewDialogContent.creator_type === 'video_format_creator' && 'Video Format Creator'}
                    {viewDialogContent.creator_type === 'video_editor' && 'Video Editor'}
                    {viewDialogContent.creator_type === 'full_video_creator' && 'Full Video Creator'}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Experience Level</Label>
                  <p className="mt-1">{viewDialogContent.experience?.charAt(0).toUpperCase() + viewDialogContent.experience?.slice(1)}</p>
                </div>
              </div>
              <div>
                <Label className="font-semibold">Tell us about Yourself</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">{viewDialogContent.experience || 'No information provided'}</p>
                </div>
              </div>
              {viewDialogContent.portfolio_url && (
                <div>
                  <Label className="font-semibold">Portfolio URL</Label>
                  <a 
                    href={viewDialogContent.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-2 text-primary hover:underline"
                  >
                    {viewDialogContent.portfolio_url}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
              {viewDialogContent.affiliate_link && (
                <div>
                  <Label className="font-semibold">Affiliate Link</Label>
                  <a 
                    href={viewDialogContent.affiliate_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-2 text-primary hover:underline"
                  >
                    {viewDialogContent.affiliate_link}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
              <div className="flex gap-4">
                <div>
                  <Label className="font-semibold">Status</Label>
                  <p className="mt-1">
                    <Badge variant={viewDialogContent.status === "approved" ? "default" : "secondary"}>
                      {viewDialogContent.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Submitted</Label>
                  <p className="mt-1 text-muted-foreground">{new Date(viewDialogContent.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
