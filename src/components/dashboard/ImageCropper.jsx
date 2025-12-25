import React, { useState, useRef, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function ImageCropper({ open, setOpen, imageSrc, onCropComplete }) {
    const [crop, setCrop] = useState({
        unit: "%",
        width: 80,
        height: 80,
        x: 10,
        y: 10,
        aspect: 1, // Square crop for avatars
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const imgRef = useRef(null);

    const onImageLoad = useCallback((e) => {
        const { width, height } = e.currentTarget;

        // Center the crop
        const cropSize = Math.min(width, height) * 0.8;
        const x = (width - cropSize) / 2;
        const y = (height - cropSize) / 2;

        setCrop({
            unit: "px",
            width: cropSize,
            height: cropSize,
            x,
            y,
        });
    }, []);

    const getCroppedImg = useCallback(() => {
        if (!completedCrop || !imgRef.current) {
            return null;
        }

        const image = imgRef.current;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return null;
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // Set canvas size to desired output size (256x256 for avatar)
        const outputSize = 256;
        canvas.width = outputSize;
        canvas.height = outputSize;

        // Calculate the actual crop dimensions
        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        const cropWidth = completedCrop.width * scaleX;
        const cropHeight = completedCrop.height * scaleY;

        // Apply transformations
        ctx.save();
        ctx.translate(outputSize / 2, outputSize / 2);
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.translate(-outputSize / 2, -outputSize / 2);

        // Draw the cropped image
        ctx.drawImage(
            image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            outputSize,
            outputSize
        );
        ctx.restore();

        // Convert to base64
        return canvas.toDataURL("image/jpeg", 0.9);
    }, [completedCrop, rotate, scale]);

    const handleSave = () => {
        const croppedImage = getCroppedImg();
        if (croppedImage) {
            onCropComplete(croppedImage);
            setOpen(false);
            // Reset state
            setScale(1);
            setRotate(0);
        }
    };

    const handleCancel = () => {
        setOpen(false);
        setScale(1);
        setRotate(0);
    };

    const handleRotate = () => {
        setRotate((prev) => (prev + 90) % 360);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Crop Your Image</DialogTitle>
                    <DialogDescription>
                        Drag to reposition and resize the crop area.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-4">
                    {/* Image Cropper */}
                    <div className="flex justify-center bg-muted/30 rounded-lg p-4 max-h-[350px] overflow-auto">
                        {imageSrc && (
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={1}
                                circularCrop
                                className="max-w-full"
                            >
                                <img
                                    ref={imgRef}
                                    src={imageSrc}
                                    alt="Crop preview"
                                    width={300}
                                    height={300}
                                    loading="lazy"
                                    decoding="async"
                                    onLoad={onImageLoad}
                                    style={{
                                        transform: `scale(${scale}) rotate(${rotate}deg)`,
                                        maxHeight: "300px",
                                        objectFit: "contain",
                                    }}
                                />
                            </ReactCrop>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-4">
                        {/* Zoom Control */}
                        <div className="flex items-center gap-3">
                            <ZoomOut className="h-4 w-4 text-muted-foreground" />
                            <Slider
                                value={[scale]}
                                min={0.5}
                                max={2}
                                step={0.1}
                                onValueChange={([value]) => setScale(value)}
                                className="flex-1"
                            />
                            <ZoomIn className="h-4 w-4 text-muted-foreground" />
                        </div>

                        {/* Rotate Button */}
                        <div className="flex justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRotate}
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Rotate 90 deg
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSave}>
                        Apply Crop
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
