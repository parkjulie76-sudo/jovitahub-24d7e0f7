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
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

const scriptSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200, "Title must be less than 200 characters"),
  description: z.string().trim().max(1000, "Description must be less than 1000 characters").optional().or(z.literal("")),
  googleDriveLink: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
});

const SubmitScript = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
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
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid File",
          description: "Please upload a Word document (.doc or .docx)",
          variant: "destructive",
        });
        return;
      }
      // Validate file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
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
      // Validate that at least one content source is provided
      if (!file && !formData.googleDriveLink) {
        toast({
          title: "Validation Error",
          description: "Please either upload a file or provide a Google Drive link",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate input
      const validatedData = scriptSchema.parse(formData);

      let fileUrl = null;

      // Upload file if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('scripts')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('scripts')
          .getPublicUrl(fileName);
        
        fileUrl = urlData.publicUrl;
      }

      // Insert script record
      const { error } = await supabase
        .from("scripts")
        .insert({
          user_id: user.id,
          title: validatedData.title,
          description: validatedData.description || null,
          file_url: fileUrl,
          google_drive_link: validatedData.googleDriveLink || null,
          content: null,
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
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of your script"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload Script File (Word Document) *</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file"
                    type="file"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Upload className="h-4 w-4" />
                      <span>{file.name}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Accepted formats: .doc, .docx (Max size: 10MB)
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
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
                <p className="text-sm text-muted-foreground">
                  Make sure the link is set to "Anyone with the link can view"
                </p>
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
