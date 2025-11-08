import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Helper function to validate Google Drive links
const isGoogleDriveLink = (url: string): boolean => {
  const googleDrivePatterns = [
    /^https:\/\/drive\.google\.com\/file\/d\//,
    /^https:\/\/drive\.google\.com\/drive\/folders\//,
    /^https:\/\/drive\.google\.com\/open\?id=/,
    /^https:\/\/docs\.google\.com\/document\/d\//,
    /^https:\/\/docs\.google\.com\/spreadsheets\/d\//,
    /^https:\/\/docs\.google\.com\/presentation\/d\//,
  ];
  return googleDrivePatterns.some(pattern => pattern.test(url));
};

const videoSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200, "Title must be less than 200 characters"),
  description: z.string().trim().max(1000, "Description must be less than 1000 characters").optional().or(z.literal("")),
  videoUrl: z.string()
    .trim()
    .url("Must be a valid URL")
    .max(500, "URL must be less than 500 characters")
    .refine((url) => isGoogleDriveLink(url), {
      message: "Video URL must be a Google Drive link (e.g., https://drive.google.com/file/d/...)",
    }),
  thumbnailUrl: z.string()
    .trim()
    .url("Must be a valid URL")
    .max(500, "URL must be less than 500 characters")
    .refine((url) => isGoogleDriveLink(url), {
      message: "Thumbnail URL must be a Google Drive link (e.g., https://drive.google.com/file/d/...)",
    }),
});

const SubmitVideo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    assignmentId: "",
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
  });

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      // Load user's assignments
      const { data: assignmentsData } = await supabase
        .from("video_assignments")
        .select("*, scripts(id, serial_number, title, file_url)")
        .eq("assigned_to", session.user.id)
        .in("status", ["assigned", "in_progress"])
        .order("created_at", { ascending: false });

      setAssignments(assignmentsData || []);
    };
    init();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a video",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      // Validate assignment selection
      if (!formData.assignmentId) {
        toast({
          title: "Validation Error",
          description: "Please select an assignment",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate input before database insertion
      const validatedData = videoSchema.parse(formData);

      // Get script_id from assignment
      const assignment = assignments.find(a => a.id === formData.assignmentId);
      if (!assignment) {
        throw new Error("Assignment not found");
      }

      const { error } = await supabase
        .from("videos")
        .insert({
          user_id: user.id,
          script_id: assignment.scripts.id,
          assignment_id: formData.assignmentId,
          title: validatedData.title,
          description: validatedData.description || null,
          video_url: validatedData.videoUrl,
          thumbnail_url: validatedData.thumbnailUrl,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your video has been submitted successfully!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to submit video",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-4xl font-bold mb-8">Submit Video</h1>
          
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="assignment">Assignment *</Label>
                <Select
                  value={formData.assignmentId}
                  onValueChange={(value) => {
                    const assignment = assignments.find(a => a.id === value);
                    setFormData({ 
                      ...formData, 
                      assignmentId: value,
                      title: assignment?.scripts?.title || "",
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignments.map((assignment) => (
                      <SelectItem key={assignment.id} value={assignment.id}>
                        {assignment.scripts?.serial_number} - {assignment.scripts?.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {assignments.length === 0 && (
                  <p className="text-sm text-destructive">
                    You don't have any active assignments. Please wait for admin to assign a script to you.
                  </p>
                )}
                {formData.assignmentId && assignments.find(a => a.id === formData.assignmentId)?.scripts?.file_url && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      try {
                        const assignment = assignments.find(a => a.id === formData.assignmentId);
                        const fileName = assignment?.scripts?.file_url?.split('/scripts/')[1];
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
                    className="flex items-center gap-2 w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Script File
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Video title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of your video"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL *</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/d/..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must be a Google Drive link
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL *</Label>
                <Input
                  id="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/d/..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must be a Google Drive link
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Video"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubmitVideo;
