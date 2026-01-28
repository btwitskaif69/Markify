// src/components/Dashboard/useCollectionActions.js
import { useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/client/lib/apiConfig";

const API_URL = API_BASE_URL;

export function useCollectionActions(authFetch, setCollections) {
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleCollectionSubmit = async (collectionData) => {
    const isEditing = !!editingCollection;
    const url = isEditing
      ? `${API_URL}/collections/${collectionData.id}`
      : `${API_URL}/collections`;
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await authFetch(url, {
        method,
        body: JSON.stringify({ name: collectionData.name }),
      });
      if (response.status === 409) {
        const err = await response.json();
        throw new Error(err.message);
      }
      if (!response.ok) throw new Error(`Failed to ${isEditing ? "rename" : "create"} collection.`);

      const { collection: returnedCollection } = await response.json();

      setCollections((prev) =>
        isEditing
          ? prev.map((c) => (c.id === returnedCollection.id ? returnedCollection : c))
          : [...prev, returnedCollection].sort((a, b) => a.name.localeCompare(b.name))
      );

      toast.success(isEditing ? "Collection renamed!" : "Collection created!");
      setIsCollectionDialogOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    const originalCollections = [];
    setCollections((prev) => {
      originalCollections.push(...prev);
      return prev.filter((c) => c.id !== collectionId);
    });
    toast.success("Collection deleted.");
    try {
      const response = await authFetch(`${API_URL}/collections/${collectionId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete on server.");
    } catch (err) {
      toast.error("Failed to delete. Restoring collection.");
      setCollections(originalCollections);
    }
  };

  const openDeleteConfirm = (collectionId) => {
    setItemToDelete(collectionId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      handleDeleteCollection(itemToDelete);
      setItemToDelete(null);
    }
    setIsConfirmOpen(false);
  };

  const handleCreateCollectionClick = () => {
    setEditingCollection(null);
    setCollectionName("");
    setIsCollectionDialogOpen(true);
  };

  const handleRenameCollectionClick = (collection) => {
    setEditingCollection(collection);
    setCollectionName(collection.name);
    setIsCollectionDialogOpen(true);
  };

  return {
    isCollectionDialogOpen,
    setIsCollectionDialogOpen,
    editingCollection,
    collectionName,
    setCollectionName,
    isConfirmOpen,
    setIsConfirmOpen,
    handleCollectionSubmit,
    handleCreateCollectionClick,
    handleRenameCollectionClick,
    openDeleteConfirm,
    confirmDelete,
  };
}
