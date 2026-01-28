import React from 'react';
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

export default function CollectionFormDialog({
  open,
  setOpen,
  onSubmit,
  editingCollection,
  collectionName,
  setCollectionName,
}) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Pass the name and the ID (if editing) to the parent handler
    onSubmit({
      id: editingCollection?.id,
      name: collectionName,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingCollection ? "Rename Collection" : "Create New Collection"}</DialogTitle>
          <DialogDescription>
            {editingCollection ? "Enter a new name for your collection." : "Enter a name for your new collection."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="name" className="sr-only">Collection Name</Label>
            <Input
              id="name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="e.g., Design Inspiration"
              required
              autoComplete="off"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingCollection ? "Save Changes" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}