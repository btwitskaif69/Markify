// src/components/Dashboard/usePreview.js
import { useState, useCallback } from "react";
import { debounce } from "lodash";

const API_URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api`;

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
