// src/components/Dashboard/usePreview.js
import { useState, useCallback } from "react";
import { debounce } from "lodash";

const API_URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api`;

// Utility: Convert image URL to WebP
async function convertImageToWebP(imageUrl, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Needed for CORS
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("WebP conversion failed"));
        },
        "image/webp",
        quality
      );
    };
    img.onerror = () => reject(new Error("Image loading failed"));
  });
}

export function usePreview() {
  const [previewData, setPreviewData] = useState(null);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [previewError, setPreviewError] = useState(null);

  const fetchPreview = async (url, setFormData) => {
    if (!url || !url.startsWith("http")) {
      setPreviewData(null);
      return;
    }
    setIsFetchingPreview(true);
    setPreviewData(null);
    setPreviewError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_URL}/preview?url=${encodeURIComponent(url)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("No preview available");

      const data = await response.json();

      // Convert preview image to WebP if available
      if (data.image) {
        try {
          const webpBlob = await convertImageToWebP(data.image);
          // Convert Blob to base64 so you can store it in DB or send to backend
          const base64WebP = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(webpBlob);
          });
          data.image = base64WebP; // Replace original image with WebP
        } catch (err) {
          console.warn("WebP conversion failed:", err);
        }
      }

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : prev.tags || "",
      }));

      setPreviewData(data);
    } catch (error) {
      if (error.name === "AbortError") setPreviewError("Can't fetch preview (timed out).");
      else setPreviewError("Can't fetch preview.");
      setPreviewData(null);
    } finally {
      setIsFetchingPreview(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchPreview, 600), []);

  return { previewData, isFetchingPreview, previewError, debouncedFetch, setPreviewData, setPreviewError };
}
