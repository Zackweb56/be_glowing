"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdAdd as Plus, MdDeleteOutline as Trash2, MdEdit as Edit2, MdDragIndicator as GripVertical, MdToggleOff as ToggleLeft, MdToggleOn as ToggleRight, MdExpandMore as ChevronDown, MdExpandLess as ChevronUp, MdImage as ImageIcon, MdClose as X, MdCheck as Check, MdWarningAmber as AlertTriangle, MdInventory2 as Package, MdFolderOpen as FolderOpen, MdStar as Star, MdLoop as Loader2, MdErrorOutline as AlertCircle, MdCheckCircleOutline as CheckCircle2 } from 'react-icons/md';
import { Toast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";

// ─── Utilities ────────────────────────────────────────────────────────────────
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}


// ─── Inline Delete Confirm ────────────────────────────────────────────────────
function DeleteConfirm({ onConfirm, onCancel, message = "Delete?", loading = false }) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
        <span className="text-destructive text-[11px] font-bold whitespace-nowrap">{message}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          disabled={loading}
          onClick={onConfirm}
          className="flex items-center gap-1 px-2.5 py-1 bg-destructive hover:bg-destructive/80 text-white text-[11px] font-bold rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
          <span>{loading ? "Deleting..." : "Yes, Delete"}</span>
        </button>
        {!loading && (
          <button onClick={onCancel} className="flex items-center gap-1 px-2.5 py-1 bg-muted hover:bg-accent text-muted-foreground text-[11px] rounded-lg transition-colors">
            <X className="h-3 w-3" /> Cancel
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Alert Banner ─────────────────────────────────────────────────────────────
function AlertBanner({ type, message }) {
  if (!message) return null;
  return (
    <div className={cn(
      "flex items-start gap-2.5 px-4 py-3 rounded-md text-sm border",
      type === "error" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    )}>
      {type === "error" ? <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> : <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />}
      <span>{message}</span>
    </div>
  );
}

// ─── Required Label ───────────────────────────────────────────────────────────
function Req({ children }) {
  return (
    <span className="flex items-center gap-1">
      {children}<span className="text-red-500 text-sm leading-none">*</span>
    </span>
  );
}

// ─── Category Modal ───────────────────────────────────────────────────────────
function CategoryModal({ initial, onSave, onClose, saving }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError("");
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) setImageUrl(data.url);
      else setError(data.message || "Upload failed");
    } catch { setError("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSave = () => {
    if (!name.trim()) { setError("Category name is required"); return; }
    onSave({ name: name.trim(), description: description.trim(), image: imageUrl.trim() });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Category" : "New Category"}</DialogTitle>
          <DialogDescription>Categories group your jewelry products.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <AlertBanner type="error" message={error} />

          <div className="space-y-1.5">
            <Label htmlFor="cat-name"><Req>Name</Req></Label>
            <Input id="cat-name" autoFocus value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rings, Necklaces, Anklets"
              className="bg-background border-border"
              onKeyDown={(e) => e.key === "Enter" && !saving && handleSave()}
              disabled={saving} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Description</Label>
            <textarea id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)}
              rows={2} placeholder="Brief description of this collection..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 border-border resize-none"
              disabled={saving} />
          </div>

          <div className="space-y-1.5">
            <Label>Thumbnail Image</Label>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 rounded-lg border border-border bg-accent/20 flex items-center justify-center overflow-hidden relative">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
                )}
                {uploading && <div className="absolute inset-0 bg-background/70 flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin" /></div>}
              </div>
              <div className="flex-1 space-y-1.5">
                <input type="file" id="cat-img" accept="image/jpeg, image/png, image/webp" onChange={handleImageUpload} className="hidden" disabled={uploading || saving} />
                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("cat-img")?.click()} disabled={uploading || saving}>
                  {uploading ? "Uploading..." : "Upload File"}
                </Button>
                <p className="text-[10px] text-muted-foreground">Max size: 2MB. Format: JPEG, PNG, WEBP.</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || uploading}>
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : (initial ? "Save Changes" : "Add Category")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Product Modal ────────────────────────────────────────────────────────────
function ProductModal({ initial, categoryId, categories, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price?.toString() ?? "",
    compareAtPrice: initial?.compareAtPrice?.toString() ?? "",
    status: initial?.status ?? "active",
    featured: initial?.featured ?? false,
    images: initial?.images ?? [],
    category: initial?.category?._id ?? initial?.category ?? categoryId ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState("main");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (form.images.length + files.length > 5) {
      setError(`Maximum of 5 images allowed (you tried to add ${files.length} more)`);
      return;
    }
    setUploading(true); setError("");
    const uploadedUrls = [];
    for (const file of files) {
      const fd = new FormData(); fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.success) uploadedUrls.push(data.url);
        else { setError(data.message || "Upload failed"); break; }
      } catch { setError("Upload failed"); break; }
    }
    if (uploadedUrls.length > 0) set("images", [...form.images, ...uploadedUrls]);
    setUploading(false);
  };

  const makeMainImg = (i) => {
    if (i === 0) return;
    const newImages = [...form.images];
    const main = newImages.splice(i, 1)[0];
    newImages.unshift(main);
    set("images", newImages);
  };

  const removeImg = (i) => set("images", form.images.filter((_, idx) => idx !== i));

  const handleSave = () => {
    setError(""); setSuccess("");
    if (!form.name.trim()) { setError("Product name is required"); setTab("main"); return; }
    if (form.price === "" || isNaN(form.price) || Number(form.price) < 0) { setError("A valid price is required"); setTab("main"); return; }
    if (form.compareAtPrice && Number(form.compareAtPrice) < Number(form.price)) { setError("Compare price cannot be less than regular price"); setTab("main"); return; }
    if (!form.category) { setError("Please select a category"); setTab("main"); return; }
    onSave({ ...form, price: Number(form.price), compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null });
  };

  const TABS = [
    { key: "main", label: "Details" },
    { key: "images", label: `Images (${form.images.length})` },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>Fields marked <span className="text-red-500">*</span> are required.</DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-border -mx-6 px-6">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn(
                "pb-2 mr-6 text-sm font-medium transition-colors border-b-2",
                tab === t.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              )}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-4 py-2">
          <AlertBanner type="error" message={error} />
          <AlertBanner type="success" message={success} />

          {tab === "main" && (
            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="p-name"><Req>Product Name</Req></Label>
                <Input id="p-name" autoFocus value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Gold Butterfly Ring" className="bg-background border-border" disabled={saving} />
              </div>

              {/* Category selector is hidden per requirements */}
              <input type="hidden" value={form.category} />

              {/* Description */}
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="p-desc">Description</Label>
                <textarea id="p-desc" value={form.description} onChange={(e) => set("description", e.target.value)}
                  rows={3} placeholder="Material, size, care instructions..."
                  className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 resize-none"
                  disabled={saving} />
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <Label htmlFor="p-price"><Req>Price (DH)</Req></Label>
                <Input id="p-price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)}
                  placeholder="99.00" className="bg-background border-border" disabled={saving} />
              </div>

              {/* Compare Price */}
              <div className="space-y-1.5">
                <Label htmlFor="p-compare">Compare Price (DH)</Label>
                <Input id="p-compare" type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)}
                  placeholder="149.00" className="bg-background border-border" disabled={saving} />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label htmlFor="p-status">Status</Label>
                <select id="p-status" value={form.status} onChange={(e) => set("status", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={saving}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2 pt-5">
                <Checkbox id="p-featured" checked={form.featured} onCheckedChange={(checked) => set("featured", checked)} disabled={saving} />
                <Label htmlFor="p-featured" className="cursor-pointer flex items-center gap-1.5 leading-none">
                  <Star className="h-3.5 w-3.5 text-amber-500" /> Featured product
                </Label>
              </div>
            </div>
          )}

          {tab === "images" && (
            <div className="space-y-4">
              {/* Image previews */}
              <div className="flex flex-wrap gap-2">
                {form.images.map((img, i) => (
                  <div key={i} className="h-20 w-20 relative rounded-lg border border-border overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => removeImg(i)}
                        className="h-5 w-5 bg-background/80 hover:bg-destructive hover:text-white rounded-full flex items-center justify-center transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                      {i !== 0 && (
                        <button type="button" onClick={() => makeMainImg(i)} title="Make Main Image"
                          className="h-5 w-5 bg-background/80 hover:bg-amber-500 hover:text-white rounded-full flex items-center justify-center transition-colors">
                          <Star className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 text-[9px] text-center bg-primary/80 text-primary-foreground py-0.5 font-bold">MAIN</span>
                    )}
                  </div>
                ))}
                {uploading && (
                  <div className="h-20 w-20 border border-dashed border-border rounded-lg flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}
                {form.images.length === 0 && !uploading && (
                  <div className="flex flex-col items-center justify-center w-full py-8 gap-2 text-muted-foreground/50">
                    <ImageIcon className="h-8 w-8" />
                    <p className="text-xs">No images yet</p>
                  </div>
                )}
              </div>

              {/* Upload button */}
              <div className="flex flex-col gap-1.5">
                <input type="file" id="p-img-file" accept="image/jpeg, image/png, image/webp" multiple onChange={handleImageUpload} className="hidden" disabled={uploading || saving || form.images.length >= 5} />
                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("p-img-file")?.click()} disabled={uploading || saving || form.images.length >= 5} className="w-fit">
                  {uploading ? <><Loader2 className="h-3 w-3 mr-1.5 animate-spin" />Uploading...</> : <><ImageIcon className="h-3 w-3 mr-1.5" />Upload File(s)</>}
                </Button>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                  <p>Max size: 2MB. Format: JPEG, PNG, WEBP. First image is the main photo.</p>
                  <p>{form.images.length}/5 images</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || uploading}>
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : (initial ? "Save Changes" : "Add Product")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SortableProductRow({ product, onEdit, onDelete, onToggle, deleting }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product._id });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  const stock = product.stock ?? 0;
  const threshold = product.stock?.alertThreshold ?? product.alertThreshold ?? 5;
  const isOut = stock === 0;
  const isLow = stock > 0 && stock <= threshold;
  const isInStock = stock > threshold;

  const images = product.images || [];

  return (
    <div ref={setNodeRef} style={style} className={cn(
      "bg-card border border-border/60 hover:border-border rounded-xl overflow-hidden transition-all",
      !product.isActive && "opacity-60"
    )}>
      {/* Main row */}
      <div className={cn(
        "flex flex-col sm:flex-row sm:items-center gap-3 px-3 py-3 group transition-colors",
        expanded && "border-b border-border/60"
      )}>
        {/* Left: drag + image + info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <button {...attributes} {...listeners} className="text-muted-foreground/40 hover:text-muted-foreground shrink-0 cursor-grab active:cursor-grabbing touch-none p-1">
                <GripVertical className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Drag to reorder</TooltipContent>
          </Tooltip>

          <div className="h-11 w-11 shrink-0 rounded-lg bg-accent/20 border border-border/60 flex items-center justify-center overflow-hidden relative">
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-4 w-4 text-muted-foreground/20" />
            )}
            {images.length > 1 && (
              <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] font-bold px-1 rounded-tl-md">
                +{images.length - 1}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold truncate">{product.name}</span>
              {product.featured && <Star className="h-3 w-3 shrink-0 fill-amber-500 text-amber-500" />}
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-auto sm:hidden p-1 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
              >
                {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <Badge variant={product.status === "active" ? "default" : "secondary"} className="text-[9px] px-1.5 py-0 uppercase">
                {product.status}
              </Badge>
              {isOut && <Badge variant="destructive" className="text-[9px] px-1.5 py-0">Out of Stock</Badge>}
              {isLow && <Badge className="text-[9px] px-1.5 py-0 bg-amber-500/10 text-amber-500 border-amber-500/20">Low Stock</Badge>}
              {isInStock && <Badge className="text-[9px] px-1.5 py-0 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">In Stock</Badge>}
            </div>
          </div>
        </div>

        {/* Right: price + actions */}
        <div className="flex items-center gap-3 justify-between sm:justify-end pl-10 sm:pl-0 border-t border-border/30 sm:border-0 pt-2 sm:pt-0 mt-1 sm:mt-0">
          <div className="text-right">
            <span className="text-sm font-bold text-primary">{product.price?.toFixed(2)} DH</span>
            {product.compareAtPrice && (
              <span className="ml-1.5 text-[10px] text-muted-foreground line-through">{product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>

          {confirmDelete ? (
            <DeleteConfirm
              onConfirm={() => onDelete(product._id)}
              onCancel={() => setConfirmDelete(false)}
              message="Delete product?"
              loading={deleting}
            />
          ) : (
            <div className="flex items-center gap-1">
              {/* Edit */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => onEdit(product)} className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Edit product</TooltipContent>
              </Tooltip>

              {/* Delete */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setConfirmDelete(true)} className="p-1.5 rounded-lg bg-muted/50 hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Delete product</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>

      {/* Expanded details section */}
      {expanded && (
        <div className="px-4 py-4 bg-muted/10 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Product Description */}
          {product.description && (
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Image gallery */}
          {images.length > 0 && (
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Images ({images.length})</h4>
              <div className="flex flex-wrap gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative h-16 w-16 rounded-lg border border-border overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 text-[7px] text-center bg-primary/80 text-primary-foreground py-0.5 font-bold">MAIN</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-card border border-border/60 rounded-lg p-3">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Status</p>
              <p className="text-sm font-semibold capitalize mt-0.5">{product.status}</p>
            </div>
            <div className="bg-card border border-border/60 rounded-lg p-3">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Stock</p>
              <p className="text-sm font-semibold mt-0.5">
                <span className={cn(
                  isOut ? "text-destructive" : isLow ? "text-amber-500" : "text-emerald-500"
                )}>
                  {stock}
                </span>
                <span className="text-[10px] text-muted-foreground ml-1">units</span>
              </p>
              <p className="text-[10px] text-muted-foreground">Threshold: {threshold}</p>
            </div>
            <div className="bg-card border border-border/60 rounded-lg p-3">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Featured</p>
              <p className="text-sm font-semibold mt-0.5 flex items-center gap-1">
                {product.featured ? (
                  <>
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> Yes
                  </>
                ) : (
                  "No"
                )}
              </p>
            </div>
            <div className="bg-card border border-border/60 rounded-lg p-3">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Compare Price</p>
              <p className="text-sm font-semibold mt-0.5">
                {product.compareAtPrice ? (
                  <>
                    {product.compareAtPrice.toFixed(2)} DH
                    <span className="text-[10px] text-emerald-500 ml-1">(-{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%)</span>
                  </>
                ) : (
                  <span className="text-muted-foreground text-xs">Not set</span>
                )}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[10px] text-muted-foreground border-t border-border/30 pt-3 mt-1">
            <span>Created: {new Date(product.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
            <span className="hidden sm:inline text-border">|</span>
            <span>Last updated: {new Date(product.updatedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sortable Category Card ────────────────────────────────────────────────────
function SortableCategoryCard({ category, onEditCat, onDeleteCat, onToggleCat, onAddProduct, onEditProduct, onDeleteProduct, onToggleProduct, onReorderProducts, categories, deletingIds }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category._id });
  const [collapsed, setCollapsed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleProductDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = category.products.findIndex((p) => p._id === active.id);
    const newIdx = category.products.findIndex((p) => p._id === over.id);
    onReorderProducts(category._id, arrayMove(category.products, oldIdx, newIdx));
  };

  const enabledCount = category.products.filter((p) => p.isActive).length;

  return (
    <div ref={setNodeRef} style={style} className={cn("bg-card border border-border rounded-2xl overflow-hidden shadow-sm", !category.isActive && "opacity-80")}>
      {/* Category header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 bg-muted/30 border-b border-border group">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Drag handle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button {...attributes} {...listeners} className="text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing touch-none shrink-0 p-1">
                <GripVertical className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Drag to reorder</TooltipContent>
          </Tooltip>

          {/* Category image */}
          {category.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={category.image} alt={category.name} className="h-8 w-8 rounded-lg object-cover shrink-0 border border-border" />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-accent/30 border border-border flex items-center justify-center shrink-0">
              <FolderOpen className="h-4 w-4 text-muted-foreground/40" />
            </div>
          )}

          {/* Name + count */}
          <button onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-2 flex-1 text-left min-w-0">
            <span className="font-bold text-foreground text-sm truncate">{category.name}</span>
            <span className="text-[10px] text-muted-foreground bg-muted border border-border/80 px-1.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
              {enabledCount}/{category.products.length} active
            </span>
          </button>

          <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground p-1 hover:bg-accent rounded-lg transition-colors">
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>

        {/* Category actions */}
        <div className="flex items-center gap-1.5 justify-between sm:justify-end pl-9 sm:pl-0 border-t border-border/30 sm:border-0 pt-2 sm:pt-0">
          {confirmDelete ? (
            <DeleteConfirm
              onConfirm={() => onDeleteCat(category._id)}
              onCancel={() => setConfirmDelete(false)}
              message="Delete category & all products?"
              loading={deletingIds.includes(category._id)}
            />
          ) : (
            <>
              <div className="flex items-center gap-0.5">
                {/* Toggle category */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => onToggleCat(category._id, !category.isActive)}
                      className={cn("p-1.5 rounded-lg transition-colors",
                        category.isActive ? "text-emerald-500 hover:bg-emerald-500/10" : "text-muted-foreground hover:bg-accent")}>
                      {category.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{category.isActive ? "Disable category" : "Enable category"}</TooltipContent>
                </Tooltip>
                {/* Edit */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => onEditCat(category)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Edit category</TooltipContent>
                </Tooltip>
                {/* Delete */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => setConfirmDelete(true)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Delete category</TooltipContent>
                </Tooltip>
              </div>

              <div className="w-px h-5 bg-border mx-1" />

              {/* Add product */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => onAddProduct(category._id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-3 py-1.5 rounded-lg transition-colors">
                    <Plus className="h-3.5 w-3.5" /> Add Product
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Add new product to this category</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>

      {/* Product list */}
      {!collapsed && (
        <div className="p-3 space-y-2">
          {category.products.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground/40">
              <Package className="h-8 w-8" />
              <p className="text-sm">No products in this category</p>
              <button onClick={() => onAddProduct(category._id)} className="text-xs text-primary hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add first product
              </button>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleProductDragEnd}>
              <SortableContext items={category.products.map((p) => p._id)} strategy={verticalListSortingStrategy}>
                {category.products.map((product) => (
                  <SortableProductRow
                    key={product._id}
                    product={product}
                    onEdit={onEditProduct}
                    onDelete={(pid) => onDeleteProduct(category._id, pid)}
                    onToggle={onToggleProduct}
                    deleting={deletingIds.includes(product._id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Catalog Builder Page ────────────────────────────────────────────────
export default function CatalogPage() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deletingIds, setDeletingIds] = useState([]);

  // Modals
  const [catModal, setCatModal] = useState(null); // null | "add" | {category}
  const [productModal, setProductModal] = useState(null); // null | { catId, product? }
  const [savingCat, setSavingCat] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // DnD sensors for categories
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const showToast = useCallback((message, type = "success") => setToast({ message, type }), []);

  const fetchCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/catalog");
      const data = await res.json();
      if (data.success) setCatalog(data.catalog);
      else showToast("Failed to load catalog", "error");
    } catch { showToast("Connection error", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchCatalog(); }, [fetchCatalog]);

  // ─ Category CRUD ────────────────────────────────────────────────────────────
  const handleSaveCat = async (fields) => {
    setSavingCat(true);
    const isEdit = catModal !== "add" && catModal?._id;
    const url = isEdit ? `/api/admin/categories/${catModal._id}` : "/api/admin/categories";
    const method = isEdit ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) });
      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? "Category updated!" : "Category created!");
        if (isEdit && catModal.image && catModal.image !== fields.image) {
          fetch("/api/admin/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: catModal.image }) }).catch(() => { });
        }
        setCatModal(null);
        fetchCatalog();
      } else {
        showToast(data.message || "Save failed", "error");
      }
    } catch { showToast("Server error", "error"); }
    finally { setSavingCat(false); }
  };

  const handleDeleteCat = async (catId) => {
    const category = catalog.find(c => c._id === catId);
    setDeletingIds((d) => [...d, catId]);
    try {
      const res = await fetch(`/api/admin/categories/${catId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Category deleted");
        fetchCatalog();
        if (category?.image) fetch("/api/admin/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: category.image }) }).catch(() => { });
        category?.products?.forEach(p => {
          p.images?.forEach(img => fetch("/api/admin/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: img }) }).catch(() => { }));
        });
      }
      else showToast(data.message || "Delete failed", "error");
    } catch { showToast("Server error", "error"); }
    finally { setDeletingIds((d) => d.filter((x) => x !== catId)); }
  };

  const handleToggleCat = async (catId, isActive) => {
    setCatalog((prev) => prev.map((c) => c._id === catId ? { ...c, isActive } : c));
    try {
      const res = await fetch(`/api/admin/categories/${catId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive }) });
      if (res.ok) showToast(isActive ? "Category enabled" : "Category disabled");
      else throw new Error();
    } catch { showToast("Toggle failed", "error"); fetchCatalog(); }
  };

  // ─ Product CRUD ─────────────────────────────────────────────────────────────
  const handleSaveProduct = async (fields) => {
    setSavingProduct(true);
    const isEdit = productModal?.product?._id;
    const url = isEdit ? `/api/admin/products/${productModal.product._id}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";
    const payload = { ...fields, category: fields.category || productModal.catId };
    if (!isEdit) { payload.initialStock = 0; payload.alertThreshold = 5; }
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? "Product updated!" : "Product added!");
        if (isEdit && productModal.product.images) {
          const removed = productModal.product.images.filter(img => !fields.images.includes(img));
          removed.forEach(img => fetch("/api/admin/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: img }) }).catch(() => { }));
        }
        setProductModal(null);
        fetchCatalog();
      } else {
        showToast(data.message || "Save failed", "error");
      }
    } catch { showToast("Server error", "error"); }
    finally { setSavingProduct(false); }
  };

  const handleDeleteProduct = async (catId, productId) => {
    const category = catalog.find(c => c._id === catId);
    const product = category?.products?.find(p => p._id === productId);
    setDeletingIds((d) => [...d, productId]);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Product deleted");
        fetchCatalog();
        product?.images?.forEach(img => fetch("/api/admin/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: img }) }).catch(() => { }));
      }
      else showToast(data.message || "Delete failed", "error");
    } catch { showToast("Server error", "error"); }
    finally { setDeletingIds((d) => d.filter((x) => x !== productId)); }
  };

  const handleToggleProduct = async (productId, isActive) => {
    setCatalog((prev) => prev.map((c) => ({
      ...c, products: c.products.map((p) => p._id === productId ? { ...p, isActive } : p)
    })));
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive }) });
      if (res.ok) showToast(isActive ? "Product enabled" : "Product disabled");
      else throw new Error();
    } catch { showToast("Toggle failed", "error"); fetchCatalog(); }
  };

  // ─ Drag-and-drop ─────────────────────────────────────────────────────────────
  const handleCategoryDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = catalog.findIndex((c) => c._id === active.id);
    const newIdx = catalog.findIndex((c) => c._id === over.id);
    const reordered = arrayMove(catalog, oldIdx, newIdx);
    setCatalog(reordered);
    try {
      await fetch("/api/admin/catalog/reorder", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "categories", items: reordered.map((c, i) => ({ id: c._id, sortOrder: i })) }),
      });
    } catch { showToast("Reorder failed", "error"); fetchCatalog(); }
  };

  const handleReorderProducts = async (catId, reordered) => {
    setCatalog((prev) => prev.map((c) => c._id === catId ? { ...c, products: reordered } : c));
    try {
      await fetch("/api/admin/catalog/reorder", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "products", items: reordered.map((p, i) => ({ id: p._id, sortOrder: i })) }),
      });
    } catch { showToast("Reorder failed", "error"); fetchCatalog(); }
  };

  // ─ Stats ─────────────────────────────────────────────────────────────────────
  const totalProducts = catalog.reduce((s, c) => s + c.products.length, 0);
  const activeCategories = catalog.filter((c) => c.isActive).length;
  const activeProducts = catalog.reduce((s, c) => s + c.products.filter((p) => p.isActive).length, 0);

  // All categories (flat) for the product modal category picker
  const allCategories = catalog;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Catalog Builder</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Drag to reorder categories and products. Toggle to show/hide.</p>
          </div>
          <Button onClick={() => setCatModal("add")} className="w-fit gap-2">
            <Plus className="h-4 w-4" /> New Category
          </Button>
        </div>

        {/* Stats bar */}
        {!loading && (
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FolderOpen className="h-3.5 w-3.5" />
              <strong className="text-foreground">{activeCategories}</strong>/{catalog.length} categories active
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              <strong className="text-foreground">{activeProducts}</strong>/{totalProducts} products active
            </span>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading catalog...</p>
          </div>
        ) : catalog.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="h-16 w-16 rounded-2xl bg-muted/60 border border-border flex items-center justify-center">
              <FolderOpen className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <div>
              <p className="text-sm font-semibold">No categories yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create your first category to start adding products.</p>
            </div>
            <Button onClick={() => setCatModal("add")} className="gap-2"><Plus className="h-4 w-4" />Create Category</Button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
            <SortableContext items={catalog.map((c) => c._id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {catalog.map((category) => (
                  <SortableCategoryCard
                    key={category._id}
                    category={category}
                    categories={allCategories}
                    onEditCat={(cat) => setCatModal(cat)}
                    onDeleteCat={handleDeleteCat}
                    onToggleCat={handleToggleCat}
                    onAddProduct={(catId) => setProductModal({ catId, product: null })}
                    onEditProduct={(product) => setProductModal({ catId: product.category, product })}
                    onDeleteProduct={handleDeleteProduct}
                    onToggleProduct={handleToggleProduct}
                    onReorderProducts={handleReorderProducts}
                    deletingIds={deletingIds}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Category Modal */}
        {catModal !== null && (
          <CategoryModal
            initial={catModal === "add" ? null : catModal}
            onSave={handleSaveCat}
            onClose={() => setCatModal(null)}
            saving={savingCat}
          />
        )}

        {/* Product Modal */}
        {productModal !== null && (
          <ProductModal
            initial={productModal.product}
            categoryId={productModal.catId}
            categories={allCategories}
            onSave={handleSaveProduct}
            onClose={() => setProductModal(null)}
            saving={savingProduct}
          />
        )}

        {/* Toast */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </TooltipProvider>
  );
}
