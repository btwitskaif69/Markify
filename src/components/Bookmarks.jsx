

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Grid, List, Star, ExternalLink, Edit, Trash2, Tag, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"



const categories = ["Work", "Personal", "Learning", "Entertainment", "Tools", "News", "Other"]

export default function MarkifyApp() {
  const [bookmarks, setBookmarks] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState(null)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    tags: "",
    category: "Other",
  })

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("markify-bookmarks")
    if (saved) {
      setBookmarks(JSON.parse(saved))
    } else {
      // Add some sample bookmarks
      const sampleBookmarks = [
        {
          id: "1",
          title: "GitHub",
          url: "https://github.com",
          description: "The world's leading software development platform",
          tags: ["development", "code", "git"],
          category: "Work",
          isFavorite: true,
          createdAt: new Date().toISOString(),
          favicon: "/placeholder.svg?height=16&width=16",
        },
        {
          id: "2",
          title: "MDN Web Docs",
          url: "https://developer.mozilla.org",
          description: "Resources for developers, by developers",
          tags: ["documentation", "web", "javascript"],
          category: "Learning",
          isFavorite: false,
          createdAt: new Date().toISOString(),
          favicon: "/placeholder.svg?height=16&width=16",
        },
        {
          id: "3",
          title: "Figma",
          url: "https://figma.com",
          description: "Collaborative interface design tool",
          tags: ["design", "ui", "collaboration"],
          category: "Tools",
          isFavorite: true,
          createdAt: new Date().toISOString(),
          favicon: "/placeholder.svg?height=16&width=16",
        },
      ]
      setBookmarks(sampleBookmarks)
      localStorage.setItem("markify-bookmarks", JSON.stringify(sampleBookmarks))
    }
  }, [])

  // Save bookmarks to localStorage whenever bookmarks change
  useEffect(() => {
    localStorage.setItem("markify-bookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])

  const handleSubmit = (e) => {
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

    if (editingBookmark) {
      setBookmarks((prev) => prev.map((b) => (b.id === editingBookmark.id ? bookmark : b)))
    } else {
      setBookmarks((prev) => [bookmark, ...prev])
    }

    // Reset form
    setFormData({ title: "", url: "", description: "", tags: "", category: "Other" })
    setIsAddDialogOpen(false)
    setEditingBookmark(null)
  }

  const handleEdit = (bookmark) => {
    setEditingBookmark(bookmark)
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      tags: bookmark.tags.join(", "),
      category: bookmark.category,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }

  const toggleFavorite = (id) => {
    setBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b)))
  }

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || bookmark.category === selectedCategory
    const matchesFavorites = !showFavoritesOnly || bookmark.isFavorite

    return matchesSearch && matchesCategory && matchesFavorites
  })

  const BookmarkCard = ({ bookmark }) => (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <img
              src={bookmark.favicon || "/placeholder.svg"}
              alt=""
              className="w-4 h-4 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=16&width=16"
              }}
            />
            <CardTitle className="text-sm truncate">{bookmark.title}</CardTitle>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFavorite(bookmark.id)}>
              <Star className={`h-4 w-4 ${bookmark.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(bookmark)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(bookmark.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-xs line-clamp-2">{bookmark.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {bookmark.category}
            </Badge>
            {bookmark.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {bookmark.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{bookmark.tags.length - 2}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(bookmark.url, "_blank")}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {new Date(bookmark.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )

  const BookmarkListItem = ({ bookmark }) => (
    <Card className="group hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src={bookmark.favicon || "/placeholder.svg"}
              alt=""
              className="w-4 h-4 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=16&width=16"
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm truncate">{bookmark.title}</h3>
                {bookmark.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{bookmark.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {bookmark.category}
                </Badge>
                {bookmark.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(bookmark.url, "_blank")}>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(bookmark)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(bookmark.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <h1 className="text-2xl font-bold">MARKIFY</h1>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingBookmark ? "Update" : "Add"} Bookmark</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Star className="h-4 w-4 mr-2" />
              Favorites
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  {viewMode === "grid" ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setViewMode("grid")}>
                  <Grid className="h-4 w-4 mr-2" />
                  Grid View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("list")}>
                  <List className="h-4 w-4 mr-2" />
                  List View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Tag className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookmarks</p>
                  <p className="text-2xl font-bold">{bookmarks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Favorites</p>
                  <p className="text-2xl font-bold">{bookmarks.filter((b) => b.isFavorite).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Filter className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{new Set(bookmarks.map((b) => b.category)).size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookmarks */}
        {filteredBookmarks.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No bookmarks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== "all" || showFavoritesOnly
                ? "Try adjusting your search or filters"
                : "Start by adding your first bookmark"}
            </p>
            {!searchTerm && selectedCategory === "all" && !showFavoritesOnly && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Bookmark
              </Button>
            )}
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-3"
            }
          >
            {filteredBookmarks.map((bookmark) =>
              viewMode === "grid" ? (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} />
              ) : (
                <BookmarkListItem key={bookmark.id} bookmark={bookmark} />
              ),
            )}
          </div>
        )}
      </main>
    </div>
  )
}
