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
import { Upload } from "lucide-react";

const scriptSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200, "Title must be less than 200 characters"),
  description: z.string().trim().max(1000, "Description must be less than 1000 characters").optional().or(z.literal("")),
  googleDriveLink: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
});

const SubmitScript = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    googleDriveLink: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a Word document (.doc or .docx)",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setScriptFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a script",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      // Check if at least one content source is provided
      if (!scriptFile && !formData.googleDriveLink) {
        toast({
          title: "Validation Error",
          description: "Please provide either a script file or a Google Drive link",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Check that only one method is provided
      if (scriptFile && formData.googleDriveLink) {
        toast({
          title: "Validation Error",
          description: "Please provide either a file upload OR a Google Drive link, not both",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate input before database insertion
      const validatedData = scriptSchema.parse(formData);

      let fileUrl = null;

      // Upload file if provided
      if (scriptFile) {
        const fileExt = scriptFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('scripts')
          .upload(fileName, scriptFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('scripts')
          .getPublicUrl(fileName);
        
        fileUrl = publicUrl;
      }

      const { error } = await supabase
        .from("scripts")
        .insert({
          user_id: user.id,
          title: validatedData.title,
          description: validatedData.description || null,
          google_drive_link: validatedData.googleDriveLink || null,
          file_url: fileUrl,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your script has been submitted successfully!",
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
          description: error.message || "Failed to submit script",
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
          <h1 className="text-4xl font-bold mb-8">Submit Script</h1>
          
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Script title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of your script"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scriptFile">Upload Script File (Word Document)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="scriptFile"
                      type="file"
                      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {scriptFile && (
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        {scriptFile.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Accepted formats: .doc, .docx (Max 10MB)</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">OR</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="googleDriveLink">Google Drive Link</Label>
                  <Input
                    id="googleDriveLink"
                    type="url"
                    value={formData.googleDriveLink}
                    onChange={(e) => setFormData({ ...formData, googleDriveLink: e.target.value })}
                    placeholder="https://drive.google.com/..."
                  />
                  <p className="text-sm text-muted-foreground">Make sure the file is shared with view access</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Script"}
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

export default SubmitScript;
