// components/Bookmarks/BookmarkFormDialog.jsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

const categories = ["Work", "Personal", "Learning", "Entertainment", "Tools", "News", "Other"]

export default function BookmarkFormDialog({
  open,
  setOpen,
  formData,
  setFormData,
  onSubmit,
  editingBookmark,
  setEditingBookmark,
}) {
  const handleFormSubmit = (e) => {
    e.preventDefault()

    const bookmark = {
      id: editingBookmark?.id || Date.now().toString(),
      title: formData.title,
      url: formData.url.startsWith("http") ? formData.url : `https://${formData.url}`,
      description: formData.description,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      category: formData.category,
      isFavorite: editingBookmark?.isFavorite || false,
      createdAt: editingBookmark?.createdAt || new Date().toISOString(),
      favicon: `/placeholder.svg?height=16&width=16&query=${formData.title.toLowerCase()}+favicon`,
    }

    onSubmit(bookmark)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setEditingBookmark(null)
            setFormData({ title: "", url: "", description: "", tags: "", category: "Other" })
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
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com"
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
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingBookmark ? "Update" : "Add"} Bookmark</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
