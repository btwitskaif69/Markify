import React, { useEffect, useRef, useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/apiConfig";

const API_URL = API_BASE_URL;

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
        coverImage: coverImage ? coverImage.trim() : undefined,
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
      navigate(`/dashboard/${user.id}/admin`);
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
      navigate(`/dashboard/${user.id}/admin`);
    } catch (err) {
      toast.error(err.message || "Failed to delete post.");
    }
  };

  const handleCoverImageUpload = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setCoverImage(result); // data:<mime>;base64,<data>
      } else {
        toast.error("Failed to read image file.");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read image file.");
    };

    reader.readAsDataURL(file);
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

  const handleGeminiRefactor = async () => {
    if (!content || !content.trim()) {
      toast.error("Add some content before refactoring.");
      return;
    }

    setIsSubmitting(true); // Re-use submitting state to show loading
    try {
      const res = await authFetch(`${API_URL}/gemini/refactor`, {
        method: "POST",
        body: JSON.stringify({ text: content }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to refactor content.");
      }

      const data = await res.json();
      setContent(data.refactoredText);
      toast.success("Content refactored with Gemini!");
    } catch (err) {
      toast.error(err.message || "Failed to refactor content.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkWordOccurrences = () => {
    if (!content || !content.trim()) {
      toast.error("Add some content before linking words.");
      return;
    }

    const termInput = window.prompt(
      "Enter the word you want to link (exact match):",
      ""
    );
    if (!termInput) return;

    const term = termInput.trim();
    if (!term) return;

    let url = window.prompt("Enter URL (include https://)", "https://");
    if (!url) return;
    url = url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

    const escapeRegExp = (str) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const linkRegex = /\[[^\]]+\]\([^)]+\)/g;
    const placeholders = [];
    const placeholderPrefix = "__BLOG_LINK__";
    let index = 0;

    const withoutExistingLinks = content.replace(linkRegex, (match) => {
      const placeholder = `${placeholderPrefix}${index++}__`;
      placeholders.push({ placeholder, value: match });
      return placeholder;
    });

    const wordRegex = new RegExp(`\\b${escapeRegExp(term)}\\b`, "g");
    const linked = withoutExistingLinks.replace(
      wordRegex,
      `[${term}](${url})`
    );

    let finalContent = linked;
    placeholders.forEach(({ placeholder, value }) => {
      finalContent = finalContent.replace(placeholder, value);
    });

    if (finalContent === content) {
      toast.error("No matching word found in the content.");
      return;
    }

    setContent(finalContent);
    toast.success(`Linked all occurrences of "${term}".`);
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
    <main className="bg-background text-foreground min-h-screen flex">
      <section className="container mx-auto px-4 py-10 md:py-16 max-w-3xl">
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
                Cover image (optional)
              </label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                />
                <Input
                  value={coverImage.startsWith("data:") ? "" : coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Or paste an image URL (https://...)"
                />
                {coverImage && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Preview
                    </p>
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="w-full max-h-64 object-cover rounded-md border border-border"
                    />
                  </div>
                )}
              </div>
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleLinkWordOccurrences}
                >
                  Link word everywhere
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGeminiRefactor}
                  className="gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                >
                  <Sparkles className="h-3 w-3" />
                  Refactor with Gemini
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
  );
};

export default BlogEditor;
