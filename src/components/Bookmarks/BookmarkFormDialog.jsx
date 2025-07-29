import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { debounce } from 'lodash';

const categories = ["Work", "Personal", "Learning", "Entertainment", "Tools", "News", "Other"];
const API_URL = "http://localhost:5000/api";

export default function BookmarkFormDialog({
  open,
  setOpen,
  formData,
  setFormData,
  onSubmit,
  editingBookmark,
  setEditingBookmark,
}) {
  const [previewData, setPreviewData] = useState(null);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);

  const fetchPreview = async (url) => {
    if (!url || !url.startsWith("http")) {
      setPreviewData(null);
      return;
    }
    setIsFetchingPreview(true);
    setPreviewData(null);
    try {
      const response = await fetch(`${API_URL}/preview?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error('No preview available');
      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
      }));
      setPreviewData(data);
    } catch (error) {
      console.error(error);
      setPreviewData(null);
    } finally {
      setIsFetchingPreview(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchPreview, 600), []);

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setFormData((prev) => ({ ...prev, url: newUrl }));
    debouncedFetch(newUrl);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const bookmarkDataForApi = {
      id: editingBookmark?.id,
      title: formData.title,
      url: formData.url.startsWith("http") ? formData.url : `https://${formData.url}`,
      description: formData.description,
      category: formData.category,
      tags: formData.tags,
      previewImage: previewData?.image || null, // Include the preview image URL
    };
    onSubmit(bookmarkDataForApi);
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setPreviewData(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setEditingBookmark(null);
            setFormData({ title: "", url: "", description: "", tags: "", category: "Other" });
            setPreviewData(null);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingBookmark ? "Edit Bookmark" : "Add New Bookmark"}</DialogTitle>
          <DialogDescription>
            {editingBookmark ? "Update your bookmark details." : "Save a new bookmark to your collection."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={handleUrlChange}
              placeholder="https://example.com"
              required
            />
          </div>
          {isFetchingPreview && (
            <div className="text-sm text-muted-foreground p-4 border rounded-md">Fetching preview...</div>
          )}
          {previewData && previewData.image && (
            <div className="mt-4 border rounded-md overflow-hidden">
              <img src={previewData.image} alt="Link preview" className="object-cover w-full aspect-video" />
              <div className="p-3 bg-muted/20">
                <h4 className="font-semibold truncate">{previewData.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{previewData.description}</p>
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter bookmark title"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the bookmark"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((category) => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
              placeholder="tag1, tag2, tag3"
            />
            <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{editingBookmark ? "Update" : "Add"} Bookmark</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}