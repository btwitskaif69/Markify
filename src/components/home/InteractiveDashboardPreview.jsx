"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatDateUTC } from "@/lib/date";
import {
    Sun, Moon, ChevronRight, Sparkles, ExternalLink, Star, MoreVertical,
    Grid3X3, List, Search, Bookmark, Folder, Clock, TrendingUp, PanelLeftIcon,
    Settings, Upload, Download, Plus, Heart
} from "lucide-react";
import { useTheme } from "../theme-provider";

const logo = "/assets/logo.svg";

// Demo bookmark data - realistic examples
const DEMO_BOOKMARKS = [
    {
        id: "demo-1",
        title: "React Documentation",
        url: "https://react.dev",
        description: "Official React documentation with comprehensive guides and API reference.",
        category: "Learning",
        tags: "react, javascript, frontend",
        isFavorite: true,
        createdAt: "2025-01-20T10:30:00Z",
        previewImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    },
    {
        id: "demo-2",
        title: "GitHub - Your Projects",
        url: "https://github.com",
        description: "Where the world builds software. Host and review code.",
        category: "Tools",
        tags: "github, git, code",
        isFavorite: false,
        createdAt: "2025-01-19T14:20:00Z",
        previewImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=300&fit=crop",
    },
    {
        id: "demo-3",
        title: "Tailwind CSS",
        url: "https://tailwindcss.com",
        description: "A utility-first CSS framework for rapid UI development.",
        category: "Tools",
        tags: "css, tailwind, styling",
        isFavorite: true,
        createdAt: "2025-01-18T09:15:00Z",
        previewImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=300&fit=crop",
    },
    {
        id: "demo-4",
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org",
        description: "Resources for developers. HTML, CSS, JavaScript documentation.",
        category: "Learning",
        tags: "mdn, web, documentation",
        isFavorite: false,
        createdAt: "2025-01-17T16:45:00Z",
        previewImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop",
    },
    {
        id: "demo-5",
        title: "Figma Design",
        url: "https://figma.com",
        description: "The collaborative interface design tool.",
        category: "Tools",
        tags: "design, figma, ui",
        isFavorite: true,
        createdAt: "2025-01-16T11:30:00Z",
        previewImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    },
    {
        id: "demo-6",
        title: "Hacker News",
        url: "https://news.ycombinator.com",
        description: "Social news focusing on computer science and entrepreneurship.",
        category: "News",
        tags: "news, tech, startups",
        isFavorite: false,
        createdAt: "2025-01-15T08:00:00Z",
        previewImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
    },
    {
        id: "demo-7",
        title: "Vercel Platform",
        url: "https://vercel.com",
        description: "Develop. Preview. Ship. Best frontend experience.",
        category: "Tools",
        tags: "vercel, deployment, hosting",
        isFavorite: false,
        createdAt: "2025-01-14T13:00:00Z",
        previewImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    },
    {
        id: "demo-8",
        title: "Stack Overflow",
        url: "https://stackoverflow.com",
        description: "Where developers learn, share, and build careers.",
        category: "Learning",
        tags: "stackoverflow, qa, community",
        isFavorite: true,
        createdAt: "2025-01-13T10:00:00Z",
        previewImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop",
    },
];

const DEMO_COLLECTIONS = [
    { id: "col-1", name: "Work Resources", count: 12 },
    { id: "col-2", name: "Learning", count: 8 },
    { id: "col-3", name: "Inspiration", count: 15 },
];

// Contained Sidebar Component (not fixed positioned)
const ContainedSidebar = ({ isCollapsed, onToggle }) => {
    return (
        <div
            className={`hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 ${isCollapsed ? "w-12" : "w-56"
                }`}
        >
            {/* Header */}
            <div className="flex items-center gap-2 p-2 h-14">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg flex-shrink-0">
                    <img src={logo} alt="Markify" width={20} height={20} className="h-5 w-5" />
                </div>
                {!isCollapsed && (
                    <span className="truncate text-lg font-semibold">Markify</span>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-hidden p-2 space-y-1">
                {/* All Bookmarks */}
                <div className={`flex items-center gap-2 px-2 py-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground ${isCollapsed ? "justify-center" : ""}`}>
                    <Bookmark className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && (
                        <>
                            <span className="text-sm">All Bookmarks</span>
                            <Badge variant="secondary" className="ml-auto text-xs">8</Badge>
                        </>
                    )}
                </div>

                {/* Shared */}
                <div className={`flex items-center gap-2 px-2 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer ${isCollapsed ? "justify-center" : ""}`}>
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm">Shared</span>}
                </div>

                {/* Collections Section */}
                {!isCollapsed && (
                    <div className="pt-4">
                        <div className="flex items-center justify-between px-2 mb-2">
                            <span className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wide">Collections</span>
                            <Plus className="w-3.5 h-3.5 text-sidebar-foreground/50 hover:text-sidebar-foreground cursor-pointer" />
                        </div>
                        {DEMO_COLLECTIONS.map((col) => (
                            <div
                                key={col.id}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer"
                            >
                                <Folder className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm truncate">{col.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Import/Export */}
                {!isCollapsed && (
                    <div className="pt-4">
                        <div className="px-2 mb-2">
                            <span className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wide">Import / Export</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer">
                            <Upload className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">Import Data</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer">
                            <Download className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">Export Data</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer - User */}
            <div className="p-2 border-t border-sidebar-border">
                <div className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-sidebar-accent/50 cursor-pointer ${isCollapsed ? "justify-center" : ""}`}>
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-primary">DU</span>
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Demo User</p>
                            <p className="text-xs text-muted-foreground truncate">demo@markify.app</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Demo Bookmark Card
const DemoBookmarkCard = ({ bookmark }) => {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=64`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            <Card className="p-2 pb-0 gap-0 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out relative group h-full flex flex-col">
                {/* Image Preview */}
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="w-full h-32 sm:h-36 overflow-hidden rounded-md bg-muted flex items-center justify-center mb-2">
                        {bookmark.previewImage ? (
                            <img
                                src={bookmark.previewImage}
                                alt={bookmark.title}
                                className="object-cover h-full w-full"
                                loading="lazy"
                            />
                        ) : (
                            <img src={faviconUrl} alt={`${bookmark.title} favicon`} className="w-16 h-16 object-contain" loading="lazy" />
                        )}
                    </div>
                </a>

                {/* Content */}
                <div className="flex flex-col flex-grow p-2">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-semibold text-primary pr-2 truncate">{bookmark.title}</h3>
                        <Button variant="ghost" size="icon" className="flex-shrink-0 h-7 w-7 -mt-1 -mr-1">
                            <Star className={`h-4 w-4 ${bookmark.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                        </Button>
                    </div>

                    <div className="flex-grow">
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{bookmark.description}</p>
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[0.7rem] text-primary hover:underline truncate flex items-center mb-2"
                        >
                            <ExternalLink className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{bookmark.url}</span>
                        </a>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                        {bookmark.tags.split(",").slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {tag.trim()}
                            </Badge>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pb-2">
                        <span className="text-primary">{bookmark.category}</span>
                        <span>{formatDateUTC(bookmark.createdAt)}</span>
                    </div>
                </div>

                {/* Action Button */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xl font-bold rounded-lg w-7 h-7 flex items-center justify-center shadow-md cursor-pointer bg-accent">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </Card>
        </motion.div>
    );
};

// Stats Component
const DemoStats = ({ bookmarks }) => {
    const totalBookmarks = bookmarks.length;
    const favorites = bookmarks.filter(b => b.isFavorite).length;
    const categories = [...new Set(bookmarks.map(b => b.category))].length;

    return (
        <div className="grid grid-cols-3 gap-3 mb-4">
            <Card className="p-3 text-center">
                <p className="text-2xl font-bold text-primary">{totalBookmarks}</p>
                <p className="text-xs text-muted-foreground">Total</p>
            </Card>
            <Card className="p-3 text-center">
                <p className="text-2xl font-bold text-yellow-500">{favorites}</p>
                <p className="text-xs text-muted-foreground">Favorites</p>
            </Card>
            <Card className="p-3 text-center">
                <p className="text-2xl font-bold text-green-500">{categories}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
            </Card>
        </div>
    );
};

const InteractiveDashboardPreview = () => {
    const { theme, setTheme } = useTheme();
    const [isDark, setIsDark] = useState(theme === "dark");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        setIsDark(theme === "dark");
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(isDark ? "light" : "dark");
    };

    const filteredBookmarks = DEMO_BOOKMARKS.filter((bookmark) => {
        const matchesSearch =
            bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bookmark.tags.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || bookmark.category === selectedCategory;
        const matchesFavorites = !showFavoritesOnly || bookmark.isFavorite;
        return matchesSearch && matchesCategory && matchesFavorites;
    });

    const categories = ["all", ...new Set(DEMO_BOOKMARKS.map(b => b.category))];

    return (
        <div className="flex w-full items-center justify-center px-4 sm:px-8 py-0 -mt-32">
            {/* Perspective wrapper for 3D effect - centered */}
            <div
                className="relative w-full max-w-[1700px] flex justify-center"
                style={{ perspective: "2000px", perspectiveOrigin: "50% 50%" }}
            >
                {/* Main dashboard with transform and glow */}
                <div
                    className="relative"
                    style={{
                        transform: "rotateY(30deg) rotateX(40deg) translateX(10%)",
                        transformStyle: "preserve-3d",
                        transformOrigin: "center center",
                        filter: "drop-shadow(0 0 50px rgba(255, 102, 0, 0.6))",
                    }}
                >
                    {/* Dashboard container - with soft glow */}
                    <div
                        className="relative rounded-xl sm:rounded-3xl overflow-hidden transition-transform duration-500 hover:scale-[1.01]"
                        style={{
                            boxShadow: "0 0 60px 20px rgba(255, 102, 0, 0.4), 0 0 120px 40px rgba(255, 102, 0, 0.25)",
                        }}
                    >
                        {/* Demo Badge */}
                        <div className="flex items-center justify-between mb-2 px-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary-foreground/80" />
                                <span className="text-xs sm:text-sm font-medium text-primary-foreground/90">
                                    Interactive Preview - Try it out!
                                </span>
                            </div>
                            <Link href="/signup">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="text-xs h-7 px-3 bg-white/90 hover:bg-white text-primary"
                                >
                                    Get Started Free
                                    <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                            </Link>
                        </div>

                        {/* Dashboard Container - Uses relative positioning */}
                        <div className="bg-background rounded-lg sm:rounded-2xl overflow-hidden shadow-inner">
                            <div className="flex min-h-[700px] lg:min-h-[800px]">
                                {/* Sidebar */}
                                <ContainedSidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

                                {/* Main Content */}
                                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                                    {/* Header */}
                                    <header className="flex h-14 shrink-0 items-center gap-2 justify-between px-4 border-b border-border">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7"
                                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                            >
                                                <PanelLeftIcon className="w-4 h-4" />
                                            </Button>
                                            <Separator orientation="vertical" className="mr-2 h-4" />
                                            <span className="text-sm font-medium hidden sm:inline">Demo User's Bookmarks</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={handleThemeToggle}
                                                className={`flex items-center cursor-pointer transition-transform duration-500 ${isDark ? "rotate-180" : "rotate-0"}`}
                                            >
                                                {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-500" />}
                                            </div>

                                            <Button size="sm" className="h-8 text-xs">
                                                <Plus className="w-3.5 h-3.5 mr-1" />
                                                Add Bookmark
                                            </Button>
                                        </div>
                                    </header>

                                    {/* Content Area */}
                                    <div className="flex-1 overflow-auto p-4">
                                        {/* Filters */}
                                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                            {/* Search */}
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    placeholder="Global search..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-9 h-9 text-sm"
                                                />
                                            </div>

                                            {/* Controls */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {/* Category Filter */}
                                                <div className="flex items-center gap-1">
                                                    {categories.slice(0, 4).map((cat) => (
                                                        <Button
                                                            key={cat}
                                                            size="sm"
                                                            variant={selectedCategory === cat ? "default" : "outline"}
                                                            className="text-xs h-8 px-2 capitalize"
                                                            onClick={() => setSelectedCategory(cat)}
                                                        >
                                                            {cat}
                                                        </Button>
                                                    ))}
                                                </div>

                                                {/* Favorites Toggle */}
                                                <Button
                                                    size="sm"
                                                    variant={showFavoritesOnly ? "default" : "outline"}
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                                >
                                                    <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
                                                </Button>

                                                {/* View Toggle */}
                                                <div className="flex items-center border rounded-md">
                                                    <Button
                                                        size="sm"
                                                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                                                        className="h-8 w-8 p-0 rounded-r-none"
                                                        onClick={() => setViewMode("grid")}
                                                    >
                                                        <Grid3X3 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={viewMode === "list" ? "secondary" : "ghost"}
                                                        className="h-8 w-8 p-0 rounded-l-none"
                                                        onClick={() => setViewMode("list")}
                                                    >
                                                        <List className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <DemoStats bookmarks={DEMO_BOOKMARKS} />

                                        {/* Bookmarks Grid */}
                                        {filteredBookmarks.length === 0 ? (
                                            <Card className="p-8 text-center">
                                                <div className="text-muted-foreground">
                                                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                    <p className="text-sm">No bookmarks found. Try adjusting your filters.</p>
                                                </div>
                                            </Card>
                                        ) : (
                                            <div
                                                className={
                                                    viewMode === "grid"
                                                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                                                        : "space-y-2"
                                                }
                                            >
                                                {filteredBookmarks.map((bookmark) => (
                                                    <DemoBookmarkCard key={bookmark.id} bookmark={bookmark} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InteractiveDashboardPreview;
