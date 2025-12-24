
import { useEffect, useRef, useState } from "react";
import {
  Heading1, Heading2, Heading3, List, ListOrdered, Code, Quote,
  Strikethrough, Bold, Italic, Underline, Link2, Sparkles, Loader2,
  ChevronLeft, Image as ImageIcon, Rocket
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/apiConfig";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import SEO from "@/components/SEO/SEO";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

const API_URL = API_BASE_URL;

// --- Simple Markdown Renderer ---
const SimpleMarkdownRenderer = ({ content }) => {
  if (!content) return <div className="text-muted-foreground italic p-4">Preview will appear here...</div>;

  const renderContent = (text) => {
    let html = text
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 border-b pb-1">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/__(.*?)__/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/_(.*?)_/gim, '<em>$1</em>')
      .replace(/~~(.*?)~~/gim, '<del>$1</del>')
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-md my-4 overflow-x-auto"><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 py-1 my-4 italic text-muted-foreground">$1</blockquote>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="rounded-lg max-w-full my-4 border" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$1</a>')
      .replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n\n/gim, '<br/><br/>')
      .replace(/\n/gim, '<br/>');
    return { __html: html };
  };

  return <div className="prose dark:prose-invert max-w-none p-8 break-words break-all" dangerouslySetInnerHTML={renderContent(content)} />;
};

const BlogEditor = () => {
  const { slug } = useParams();
  const isEditMode = Boolean(slug);
  const { user, isAuthenticated, isLoading, authFetch } = useAuth();
  const navigate = useNavigate();

  const [postId, setPostId] = useState(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(isEditMode);

  // Auto-Link State
  const [linkKeyword, setLinkKeyword] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const contentRef = useRef(null);

  // Helper to escape regex special characters
  const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const handleAutoLink = () => {
    if (!linkKeyword || !linkUrl) return;

    try {
      const escapedKeyword = escapeRegex(linkKeyword);
      // Regex: matching keyword as whole word, avoiding existing markdown links
      // Negative lookbehind (?<!\[) ensures we don't match matching [keyword]
      // This is a basic implementation and might loop if not careful, but fine for simple cases.
      const regex = new RegExp(`(?<!\\[)\\b${escapedKeyword}\\b(?!\\])`, 'gi');

      let count = 0;
      const newContent = content.replace(regex, (match) => {
        if (count >= 3) return match;
        count++;
        return `[${match}](${linkUrl})`;
      });

      if (count > 0) {
        setContent(newContent);
        toast.success(`Linked ${count} occurrences of "${linkKeyword}"`);
        setLinkKeyword("");
        setLinkUrl("");
      } else {
        toast.info(`No occurrences of "${linkKeyword}" found to link.`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to apply links.");
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login");
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const loadPost = async () => {
      if (!isEditMode) return;
      try {
        const res = await fetch(`${API_URL}/blog/${slug}`);
        if (!res.ok) throw new Error("Failed to load post.");
        const data = await res.json();
        if (data.authorId && user && data.authorId !== user.id) {
          toast.error("You are not allowed to edit this post.");
          navigate("/blog");
          return;
        }
        setPostId(data.id);
        setTitle(data.title || "");
        setExcerpt(data.excerpt || "");
        setContent(data.content || "");
        setCoverImage(data.coverImage || "");
      } catch (err) {
        toast.error(err.message || "Failed to load post.");
        navigate("/blog");
      } finally {
        setIsInitialLoading(false);
      }
    };
    if (isEditMode) loadPost();
  }, [isEditMode, slug, user, navigate]);

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required.");

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        coverImage: coverImage ? coverImage.trim() : undefined,
        published: !isDraft,
      };

      const method = isEditMode ? "PATCH" : "POST";
      const url = isEditMode ? `${API_URL}/blog/${postId}` : `${API_URL}/blog`;

      const res = await authFetch(url, { method, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to save post.");

      toast.success(isDraft ? "Draft saved successfully." : (isEditMode ? "Post updated." : "Post published!"));
      navigate(`/dashboard/${user.id}/admin`);
    } catch (err) {
      toast.error(err.message || "Failed to save post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCoverImageUpload = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Invalid image.");

    // Show local preview immediately while uploading
    const reader = new FileReader();
    reader.onloadend = () => { if (typeof reader.result === "string") setCoverImage(reader.result); };
    reader.readAsDataURL(file);

    // Upload to R2
    try {
      const formData = new FormData();
      // Since the backend expects a JSON with base64, we need to convert it first or use FormData if backend supported it.
      // My upload.controller expects JSON body { image, folder }.

      // Let's rely on the base64 conversion we just did.
      // Wait for reader? Or do it again.

      // Simpler: Just convert to base64 promise
      const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      const base64Image = await toBase64(file);

      const toastId = toast.loading("Uploading image...");

      const res = await authFetch(`${API_URL}/upload`, {
        method: 'POST',
        body: JSON.stringify({
          image: base64Image,
          folder: 'blog-covers'
        })
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setCoverImage(data.url);
      toast.dismiss(toastId);
      toast.success("Image uploaded to R2!");

    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image to R2.");
    }
  };

  const applyParams = (before, after = before) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end, value: val } = textarea;
    const newVal = val.substring(0, start) + before + val.substring(start, end) + after + val.substring(end);
    setContent(newVal);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (end - start));
    }, 0);
  };

  const applyPrefix = (prefix) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end, value: val } = textarea;
    let lineStart = val.lastIndexOf("\n", start - 1) + 1;
    let lineEnd = val.indexOf("\n", end);
    if (lineEnd === -1) lineEnd = val.length;
    const lines = val.slice(lineStart, lineEnd).split("\n").map(l => prefix + l).join("\n");
    setContent(val.slice(0, lineStart) + lines + val.slice(lineEnd));
  };

  if (isInitialLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <main className="bg-background min-h-screen py-10 px-4">
      <SEO
        title={isEditMode ? "Edit blog post" : "New blog post"}
        description="Create or update a Markify blog post."
        noindex
      />
      <div className="container mx-auto max-w-[1600px]">
        <div className="mb-6 flex items-center justify-between">
          <Link to={`/dashboard/${user?.id}/admin`} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{isEditMode ? "Edit Post" : "New Post"}</h1>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          {/* Metadata Section */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <Input
                value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Post Title"
                className="text-lg font-semibold h-12"
                required
              />
              <Textarea
                value={excerpt} onChange={e => setExcerpt(e.target.value)}
                placeholder="Short excerpt for SEO (optional)..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <div className="border border-dashed rounded-lg h-[132px] flex flex-col items-center justify-center text-muted-foreground relative overflow-hidden group hover:border-primary transition-colors bg-muted/20">
                {coverImage ? (
                  <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="h-6 w-6 mb-2" />
                    <span className="text-xs">Upload Cover Image</span>
                  </>
                )}
                <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleCoverImageUpload} />
              </div>
              {coverImage && <Button type="button" variant="ghost" size="sm" className="w-full text-destructive h-6" onClick={() => setCoverImage("")}>Remove Image</Button>}
            </div>
          </div>

          <Separator />

          {/* Editor Section */}
          <div className="border rounded-lg overflow-hidden bg-card shadow-sm min-h-[750px] flex flex-col">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-3 border-b bg-muted/30">
              <Button type="button" variant="ghost" size="icon" onClick={() => applyPrefix("# ")}><Heading1 className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => applyPrefix("## ")}><Heading2 className="h-4 w-4" /></Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button type="button" variant="ghost" size="icon" onClick={() => applyParams("**")}><Bold className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => applyParams("_")}><Italic className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => applyParams("`")}><Code className="h-4 w-4" /></Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button type="button" variant="ghost" size="icon" onClick={() => applyPrefix("- ")}><List className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => applyPrefix("1. ")}><ListOrdered className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => applyPrefix("> ")}><Quote className="h-4 w-4" /></Button>
              <div className="flex-1" />
              <Button type="button" variant="ghost" size="sm" className="text-indigo-500 gap-1" onClick={() => toast.info("AI features coming soon!")}>
                <Sparkles className="h-3 w-3" /> AI Refactor
              </Button>
            </div>

            {/* Extended Toolbar - Auto Link */}
            <div className="flex items-center gap-2 p-2 px-4 border-b bg-muted/20 text-xs text-muted-foreground">
              <span className="font-semibold">Tools:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                    <Link2 className="h-3 w-3" /> Auto-Link
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Auto-Link Keywords</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically link all occurrences of a word.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="link-word">Word</Label>
                        <Input
                          id="link-word"
                          placeholder="e.g. Markify"
                          className="col-span-2 h-8"
                          value={linkKeyword}
                          onChange={(e) => setLinkKeyword(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="link-url">URL</Label>
                        <Input
                          id="link-url"
                          placeholder="https://..."
                          className="col-span-2 h-8"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAutoLink} disabled={!linkKeyword || !linkUrl} size="sm">
                      Apply Links
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Split View */}
            <ResizablePanelGroup direction="horizontal" className="flex-1">
              <ResizablePanel defaultSize={50} minSize={30}>
                <Textarea
                  ref={contentRef}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full h-full resize-none border-none focus-visible:ring-0 p-8 font-mono text-base leading-loose rounded-none"
                  placeholder="Write in markdown..."
                />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full bg-muted/10 border-l flex flex-col">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground px-4 py-2 bg-muted/30 border-b">Preview</div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <SimpleMarkdownRenderer content={content} />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(`/dashboard/${user?.id}/admin`)}>Cancel</Button>
            <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting}>
              Save Draft
            </Button>
            <Button type="submit" className="min-w-[120px]" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
              {isEditMode ? "Update & Publish" : "Publish Post"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default BlogEditor;
