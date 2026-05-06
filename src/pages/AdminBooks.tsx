import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, BookOpen, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface BookRow {
  id: string;
  title: string;
  file_path: string;
  status: string;
  chunk_count: number;
  error_message: string | null;
  created_at: string;
}

export default function AdminBooks() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [books, setBooks] = useState<BookRow[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!data) {
        toast({ title: "Access denied", description: "Admins only", variant: "destructive" });
        navigate("/");
        return;
      }
      setIsAdmin(true);
      setChecking(false);
      loadBooks();
    })();
  }, [navigate]);

  async function loadBooks() {
    const { data, error } = await supabase
      .from("chatbot_books")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
      return;
    }
    setBooks(data || []);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) {
      toast({ title: "Missing fields", description: "Provide title and PDF file", variant: "destructive" });
      return;
    }
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "PDF only", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const path = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("chatbot-books").upload(path, file);
      if (upErr) throw upErr;

      const { data: bookRow, error: insErr } = await supabase
        .from("chatbot_books")
        .insert({
          title: title.trim(),
          file_path: path,
          status: "processing",
          uploaded_by: user.id,
        })
        .select()
        .single();
      if (insErr) throw insErr;

      toast({ title: "Uploaded", description: "Processing book… this can take 1–3 minutes." });
      setTitle("");
      setFile(null);
      (document.getElementById("book-file") as HTMLInputElement).value = "";
      loadBooks();

      // Trigger ingest
      const { error: fnErr } = await supabase.functions.invoke("ingest-book", {
        body: { bookId: bookRow.id },
      });
      if (fnErr) {
        toast({ title: "Processing failed", description: fnErr.message, variant: "destructive" });
      } else {
        toast({ title: "Book ready", description: "The chatbot can now answer from this book." });
      }
      loadBooks();
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(book: BookRow) {
    if (!confirm(`Delete "${book.title}"? The chatbot will no longer use it.`)) return;
    await supabase.storage.from("chatbot-books").remove([book.file_path]);
    const { error } = await supabase.from("chatbot_books").delete().eq("id", book.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Deleted" });
    loadBooks();
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Chatbot Knowledge — Books</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Upload a PDF book. The chatbot will use its content (combined with Jovita Hub knowledge) to answer
          user questions. Uploading a new book replaces the previous one.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload a new book</CardTitle>
            <CardDescription>PDF only. Text-based PDFs work best (scanned images won't extract).</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="book-title">Book title</Label>
                <Input
                  id="book-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Storyteller's Handbook"
                  disabled={uploading}
                />
              </div>
              <div>
                <Label htmlFor="book-file">PDF file</Label>
                <Input
                  id="book-file"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={uploading}
                />
              </div>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" /> Upload & Train
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current book</CardTitle>
          </CardHeader>
          <CardContent>
            {books.length === 0 ? (
              <p className="text-muted-foreground">No book uploaded yet.</p>
            ) : (
              <ul className="space-y-3">
                {books.map((b) => (
                  <li key={b.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <div className="font-medium">{b.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            b.status === "ready" ? "default" : b.status === "failed" ? "destructive" : "secondary"
                          }
                        >
                          {b.status}
                        </Badge>
                        <span>{b.chunk_count} chunks</span>
                        <span>· {new Date(b.created_at).toLocaleDateString()}</span>
                      </div>
                      {b.error_message && (
                        <div className="text-sm text-destructive mt-1">{b.error_message}</div>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(b)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
