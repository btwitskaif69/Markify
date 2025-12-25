import React, { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/apiConfig";
import logo from "@/assets/logo.svg";
import ImageCropper from "./ImageCropper";

export default function AccountDialog({ open, setOpen, user, authFetch, onProfileUpdate }) {
    const [name, setName] = useState(user?.name || "");
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
    const [avatarBase64, setAvatarBase64] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cropperOpen, setCropperOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const fileInputRef = useRef(null);

    // Reset form when dialog opens
    useEffect(() => {
        if (open && user) {
            setName(user.name || "");
            setAvatarPreview(user.avatar || null);
            setAvatarBase64(null);
            setImageToCrop(null);
        }
    }, [open, user]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }

        // Validate file size (max 5MB for cropping, will be compressed after)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB.");
            return;
        }

        // Convert to base64 and open cropper
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            setImageToCrop(base64);
            setCropperOpen(true);
        };
        reader.readAsDataURL(file);

        // Reset file input so same file can be selected again
        e.target.value = "";
    };

    const handleCropComplete = (croppedImage) => {
        setAvatarPreview(croppedImage);
        setAvatarBase64(croppedImage);
        setImageToCrop(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Name cannot be empty.");
            return;
        }

        setIsSubmitting(true);

        try {
            const updateData = { name: name.trim() };
            if (avatarBase64) {
                updateData.avatar = avatarBase64;
            }

            const response = await authFetch(`${API_BASE_URL}/users/profile`, {
                method: "PATCH",
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to update profile.");
            }

            const { user: updatedUser } = await response.json();

            // Update the user in context
            onProfileUpdate?.(updatedUser);

            toast.success("Profile updated successfully!");
            setOpen(false);
        } catch (error) {
            toast.error(error.message || "Failed to update profile.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInitials = (name) => {
        return name
            ? name.split(" ").map((n) => n[0]).join("").toUpperCase()
            : "U";
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Account Settings</DialogTitle>
                        <DialogDescription>
                            Update your profile information and avatar.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                <Avatar className="h-24 w-24 border-4 border-primary/20">
                                    <AvatarImage src={avatarPreview} alt={name} className="object-cover" />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                        {getInitials(name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <p className="text-sm text-muted-foreground">Click to upload and crop avatar</p>
                        </div>

                        {/* Name Input */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        {/* Email (Read-only) */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={user?.email || ""}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 bg-primary-foreground rounded-full flex items-center justify-center animate-spin mr-2">
                                            <img src={logo} alt="" width={12} height={12} className="w-3 h-3" />
                                        </div>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Image Cropper Dialog */}
            <ImageCropper
                open={cropperOpen}
                setOpen={setCropperOpen}
                imageSrc={imageToCrop}
                onCropComplete={handleCropComplete}
            />
        </>
    );
}

