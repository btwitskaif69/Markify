import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const API_URL = `${
  import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000"
}/api`;

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
  const contentRef = useRef(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
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

    if (isEditMode) {
      loadPost();
    }
  }, [isEditMode, slug, user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        coverImage: coverImage.trim() || undefined,
      };

      const method = isEditMode ? "PATCH" : "POST";
      const url = isEditMode
        ? `${API_URL}/blog/${postId}`
        : `${API_URL}/blog`;

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to save post.");
      }

      const saved = await res.json();
      toast.success(isEditMode ? "Post updated." : "Post created.");
      navigate(`/blog/${saved.slug}`);
    } catch (err) {
      toast.error(err.message || "Failed to save post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !postId) return;
    const confirmed = window.confirm("Delete this post? This cannot be undone.");
    if (!confirmed) return;

    try {
      const res = await authFetch(`${API_URL}/blog/${postId}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete post.");
      }
      toast.success("Post deleted.");
      navigate("/blog");
    } catch (err) {
      toast.error(err.message || "Failed to delete post.");
    }
  };

  const applyFormatting = (before, after = before) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    if (selectionStart == null || selectionEnd == null) return;

    const selected = value.slice(selectionStart, selectionEnd);
    const newValue =
      value.slice(0, selectionStart) +
      before +
      selected +
      after +
      value.slice(selectionEnd);

    setContent(newValue);

    const newStart = selectionStart + before.length;
    const newEnd = newStart + selected.length;

    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(newStart, newEnd);
    });
  };

  const handleAddLink = () => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    if (selectionStart == null || selectionEnd == null) return;

    const selected = value.slice(selectionStart, selectionEnd) || "link text";
    let url = window.prompt("Enter URL (include https://)", "https://");
    if (!url) return;
    url = url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

    const markdown = `[${selected}](${url})`;
    const newValue =
      value.slice(0, selectionStart) +
      markdown +
      value.slice(selectionEnd);

    setContent(newValue);

    const caretPos = selectionStart + markdown.length;
    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(caretPos, caretPos);
    });
  };

  return (
    <>
      <Navbar />

      <main className="bg-background text-foreground">
        <section className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
          <p className="text-xs text-muted-foreground mb-3">
            <Link to="/blog" className="hover:underline">
              &larr; Back to blog
            </Link>
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            {isEditMode ? "Edit blog post" : "Create a blog post"}
          </h1>

          {isInitialLoading ? (
            <p className="text-muted-foreground">Loading post...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Write a clear, descriptive title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Short summary (optional)
                </label>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  placeholder="A short summary that appears in the blog list."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Cover image URL (optional)
                </label>
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Content
                </label>
                <div className="flex flex-wrap gap-2 mb-2 text-xs">
                  <span className="text-muted-foreground mr-2">
                    Formatting:
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyFormatting("**", "**")}
                  >
                    Bold
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyFormatting("_", "_")}
                  >
                    Italic
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyFormatting("__", "__")}
                  >
                    Underline
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddLink}
                  >
                    Link
                  </Button>
                </div>
                <Textarea
                  ref={contentRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  placeholder="Write your post content here. Use line breaks to separate paragraphs. Use **bold**, _italic_, __underline__, or [text](https://example.com)."
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? isEditMode
                      ? "Saving..."
                      : "Publishing..."
                    : isEditMode
                    ? "Save changes"
                    : "Publish post"}
                </Button>
                {isEditMode && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default BlogEditor;
