// pages/Bookmarks.jsx
import { useState } from "react"
import BookmarkCard from "@/components/Bookmarks/BookmarkCard"
import BookmarkListItem from "@/components/Bookmarks/BookmarkListItem"
import BookmarkFilters from "@/components/Bookmarks/BookmarkFilters"
import BookmarkStats from "@/components/Bookmarks/BookmarkStats"
import { Card } from "@/components/ui/card"

export default function Bookmarks() {
  // State for bookmarks data
  const [bookmarks, setBookmarks] = useState([
    {
      id: "1",
      title: "React Documentation",
      url: "https://reactjs.org",
      description: "Official React documentation with guides and API references",
      tags: ["react", "frontend", "documentation"],
      category: "Learning",
      isFavorite: true,
      createdAt: "2024-03-15T08:30:00Z",
      favicon: "/react.svg"
    },
    {
      id: "2",
      title: "CSS Tricks",
      url: "https://css-tricks.com",
      description: "Daily articles about CSS, HTML, JavaScript, and all things web development",
      tags: ["css", "webdev", "design"],
      category: "Learning",
      isFavorite: false,
      createdAt: "2024-04-22T14:15:00Z",
      favicon: "/css-tricks.ico"
    },
    {
      id: "3",
      title: "GitHub",
      url: "https://github.com",
      description: "World's leading software development platform",
      tags: ["git", "version-control", "collaboration"],
      category: "Tools",
      isFavorite: true,
      createdAt: "2023-11-05T09:45:00Z",
      favicon: "/github.png"
    },
    {
      id: "4",
      title: "Netflix",
      url: "https://netflix.com",
      description: "Stream movies and TV shows online",
      tags: ["entertainment", "movies", "streaming"],
      category: "Entertainment",
      isFavorite: false,
      createdAt: "2024-01-18T19:20:00Z",
      favicon: "/netflix.ico"
    },
    {
      id: "5",
      title: "Hacker News",
      url: "https://news.ycombinator.com",
      description: "Tech news aggregator for developers and entrepreneurs",
      tags: ["news", "tech", "programming"],
      category: "News",
      isFavorite: true,
      createdAt: "2024-05-01T07:10:00Z",
      favicon: "/hacker-news.png"
    },
    {
      id: "6",
      title: "Google Drive",
      url: "https://drive.google.com",
      description: "Cloud storage and file collaboration platform",
      tags: ["storage", "productivity", "cloud"],
      category: "Work",
      isFavorite: false,
      createdAt: "2023-09-12T11:30:00Z",
      favicon: "/google-drive.svg"
    },
    {
      id: "7",
      title: "MDN Web Docs",
      url: "https://developer.mozilla.org",
      description: "Resources for developers by developers",
      tags: ["documentation", "web", "reference"],
      category: "Learning",
      isFavorite: true,
      createdAt: "2024-02-28T16:45:00Z",
      favicon: "/mdn.ico"
    },
    {
      id: "8",
      title: "Spotify",
      url: "https://spotify.com",
      description: "Music streaming service with millions of songs",
      tags: ["music", "entertainment", "audio"],
      category: "Entertainment",
      isFavorite: false,
      createdAt: "2023-12-14T21:05:00Z",
      favicon: "/spotify.png"
    },
    {
      id: "9",
      title: "Stack Overflow",
      url: "https://stackoverflow.com",
      description: "Q&A community for programmers",
      tags: ["programming", "help", "community"],
      category: "Tools",
      isFavorite: true,
      createdAt: "2024-04-05T13:20:00Z",
      favicon: "/stack-overflow.svg"
    },
    {
      id: "10",
      title: "Personal Blog",
      url: "https://my-personal-blog.com",
      description: "My personal thoughts and projects",
      tags: ["personal", "writing", "journal"],
      category: "Personal",
      isFavorite: false,
      createdAt: "2024-03-01T10:00:00Z",
      favicon: "/blog.ico"
    },
        {
      id: "11",
      title: "Personal Blog",
      url: "https://btwitskaif.vercel.app/",
      description: "My personal thoughts and projects",
      tags: ["personal", "writing", "journal"],
      category: "Personal",
      isFavorite: false,
      createdAt: "2024-03-01T10:00:00Z",
      favicon: "/blog.ico"
    }
  ]);
  
  // Edit bookmark handler
  const handleEditBookmark = (updatedBookmark) => {
    setBookmarks(prev => 
      prev.map(b => b.id === updatedBookmark.id ? updatedBookmark : b)
    );
  };

  // UI state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Delete bookmark handler
  const handleDelete = (id) => setBookmarks((prev) => prev.filter((b) => b.id !== id))
  
  // Toggle favorite handler
  const toggleFavorite = (id) =>
    setBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b)))

  // Filter bookmarks
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || bookmark.category === selectedCategory
    const matchesFavorites = !showFavoritesOnly || bookmark.isFavorite
    return matchesSearch && matchesCategory && matchesFavorites
  })

  return (
    <main className="container mx-auto px-4 py-6">
      <BookmarkFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        viewMode={viewMode}
        setViewMode={setViewMode}
        categories={["Work", "Personal", "Learning", "Entertainment", "Tools", "News", "Other"]}
      />

      <BookmarkStats bookmarks={bookmarks} />

      {filteredBookmarks.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium">No bookmarks found</p>
            <p className="mt-2">Try adjusting your filters or add new bookmarks</p>
          </div>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-3"
          }
        >
          {filteredBookmarks.map((bookmark) =>
            viewMode === "grid" ? (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={handleEditBookmark}
                onDelete={handleDelete}
                onToggleFavorite={toggleFavorite}
              />
            ) : (
              <BookmarkListItem
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={handleEditBookmark}
                onDelete={handleDelete}
              />
            )
          )}
        </div>
      )}
    </main>
  )
}