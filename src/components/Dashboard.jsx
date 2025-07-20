import { useState, useEffect } from "react"
import BookmarkFormDialog from "@/components/Bookmarks/BookmarkFormDialog"
import Bookmarks from "./Bookmarks"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useTheme } from "./theme-provider"
import { Sun, Moon } from "lucide-react"
// ... other imports

export default function Dashboard() {
  // 🔼 State moved from Bookmarks.jsx
  const {theme, setTheme} = useTheme();
  const isDark = theme === "dark";


  const [bookmarks, setBookmarks] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    tags: "",
    category: "Other",
  })

  // 🔁 Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("markify-bookmarks")
    if (saved) {
      setBookmarks(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("markify-bookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])

  // 🔄 Add/Edit logic
  const handleSubmit = (bookmark) => {
    if (editingBookmark) {
      setBookmarks((prev) => prev.map((b) => (b.id === editingBookmark.id ? bookmark : b)))
    } else {
      setBookmarks((prev) => [bookmark, ...prev])
    }
    setFormData({ title: "", url: "", description: "", tags: "", category: "Other" })
    setIsAddDialogOpen(false)
    setEditingBookmark(null)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Username</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Bookmarks</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {/* Add Theme Toggle with sun and moon icons here */}
          <div onClick={()=> setTheme(isDark ? "light" : "dark")}
            className={`flex items-end cursor-pointer transition-transform duration-500 ${isDark ? "rotate-180" : "ratate-0"}`}>
            {isDark ? <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all" /> : <Moon className="h-6 w-6 text-gray-500" />}
          </div>
          {/* ✅ Add Button + Dialog */}
          <BookmarkFormDialog
            open={isAddDialogOpen}
            setOpen={setIsAddDialogOpen}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            editingBookmark={editingBookmark}
            setEditingBookmark={setEditingBookmark}
          />
        </header>

        {/* ✅ Main Content */}
        <Bookmarks
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          onEditBookmark={(bookmark) => {
            setEditingBookmark(bookmark)
            setFormData({
              title: bookmark.title,
              url: bookmark.url,
              description: bookmark.description,
              tags: bookmark.tags.join(", "),
              category: bookmark.category,
            })
            setIsAddDialogOpen(true)
          }}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
