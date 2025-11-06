import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

const ApplyJob = () => {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(searchParams.get("position") || "");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const positions = [
    "Script Writers",
    "Video Editors",
    "Format Creators",
    "Community Manager",
    "YouTube Creator",
    "Business Development Manager"
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for a position",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setUser(session.user);
    setEmail(session.user.email || "");
  };

  const validateFile = (file: File, fieldName: string): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      setError(`${fieldName} must be less than 10MB`);
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      setError(`${fieldName} must be a PDF or Word document`);
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) {
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError("You must be logged in to apply");
      setLoading(false);
      return;
    }

    if (!resumeFile) {
      setError("Resume is required");
      setLoading(false);
      return;
    }

    // Validate files
    if (!validateFile(resumeFile, "Resume")) {
      setLoading(false);
      return;
    }

    if (coverLetterFile && !validateFile(coverLetterFile, "Cover letter")) {
      setLoading(false);
      return;
    }

    try {
      // Upload resume
      const resumeUrl = await uploadFile(resumeFile, 'resumes');
      if (!resumeUrl) {
        setError("Failed to upload resume");
        setLoading(false);
        return;
      }

      // Upload cover letter if provided
      let coverLetterUrl = null;
      if (coverLetterFile) {
        coverLetterUrl = await uploadFile(coverLetterFile, 'cover-letters');
        if (!coverLetterUrl) {
          setError("Failed to upload cover letter");
          setLoading(false);
          return;
        }
      }

      // Submit application
      const { error: insertError } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          position,
          full_name: fullName,
          email,
          phone: phone || null,
          resume_url: resumeUrl,
          cover_letter_url: coverLetterUrl,
          message: message || null,
        });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      toast({
        title: "Application Submitted!",
        description: "We've received your application and will review it soon.",
      });

      // Redirect to dashboard or success page
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-4 py-12 bg-gradient-to-br from-background via-background to-accent/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Apply for a Position</h1>
            <p className="text-muted-foreground">
              Join our team and help us create amazing content
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Job Application Form</CardTitle>
              <CardDescription>
                Fill out the form below to apply. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Position */}
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Select value={position} onValueChange={setPosition} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume * (PDF or Word, max 10MB)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      required
                      className="cursor-pointer"
                    />
                    {resumeFile && (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  {resumeFile && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {/* Cover Letter Upload */}
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter (PDF or Word, max 10MB)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="coverLetter"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCoverLetterFile(e.target.files?.[0] || null)}
                      className="cursor-pointer"
                    />
                    {coverLetterFile && (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  {coverLetterFile && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {coverLetterFile.name} ({(coverLetterFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Additional Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us why you're a great fit for this position..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading || !resumeFile || !position || !fullName || !email}
                  >
                    {loading ? (
                      <>
                        <Upload className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/careers")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApplyJob;
