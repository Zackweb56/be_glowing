"use client";

import { useState, useEffect, useCallback } from "react";
import { MdAdd as Plus, MdEdit as Pencil, MdDeleteOutline as Trash2, MdStar as Star, MdSave as Save, MdClose as X, MdLoop as Loader2, MdFormatQuote as MessageSquareQuote, MdHelpOutline as HelpCircle, MdToggleOff as ToggleLeft, MdToggleOn as ToggleRight, MdExpandMore as ChevronDown, MdWarningAmber as AlertTriangle, MdCheck as Check, MdViewQuilt as LayoutTemplate, MdImage as ImageIcon } from 'react-icons/md';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toast } from "@/components/admin/Toast";
import { cn } from "@/lib/utils";

// ── Shared helpers ─────────────────────────────────────────────────────────────

function Req({ children }) {
  return (
    <span className="flex items-center gap-1">
      {children}<span className="text-red-500 text-sm leading-none">*</span>
    </span>
  );
}

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
          <span>{loading ? "Deleting..." : "Yes"}</span>
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

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "h-5 w-5",
              n <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
}

const TESTIMONIAL_BLANK = { name: "", location: "", stars: 5, comment: "", isActive: true, sortOrder: 0 };
const FAQ_BLANK = { question: "", answer: "", isActive: true, sortOrder: 0 };

// ── TESTIMONIALS tab ───────────────────────────────────────────────────────────

function TestimonialsTab({ showToast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(TESTIMONIAL_BLANK);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (data.success) setItems(data.testimonials);
    } catch {
      showToast("Failed to load testimonials", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openAdd = () => { setForm(TESTIMONIAL_BLANK); setEditId(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({ name: item.name, location: item.location, stars: item.stars, comment: item.comment, isActive: item.isActive, sortOrder: item.sortOrder });
    setEditId(item._id);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditId(null); setForm(TESTIMONIAL_BLANK); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.comment.trim()) {
      showToast("Name and comment are required", "error");
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/admin/testimonials/${editId}` : "/api/admin/testimonials";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        closeModal();
        fetchItems();
      } else {
        showToast(data.message || "Save failed", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        setItems(prev => prev.filter(i => i._id !== id));
      } else {
        showToast(data.message || "Delete failed", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setDeletingId(null);
      setDeleteConfirm(null);
    }
  };

  const toggleActive = async (item) => {
    try {
      const newState = !item.isActive;
      const res = await fetch(`/api/admin/testimonials/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, isActive: newState }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.map(i => i._id === item._id ? { ...i, isActive: newState } : i));
        showToast(`Testimonial ${newState ? "enabled" : "disabled"}`, "success");
      } else {
        showToast("Failed to toggle status", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Customer Testimonials</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage the reviews shown on the home page. Only active entries are displayed.
          </p>
        </div>
        <Button onClick={openAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      <Dialog open={showModal} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
            <DialogDescription>Customer reviews will be displayed on the storefront.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="t-name"><Req>Customer Name</Req></Label>
              <Input id="t-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sarah B." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-location">Location</Label>
              <Input id="t-location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Casablanca" />
            </div>
            <div className="space-y-1.5">
              <Label>Star Rating</Label>
              <div className="pt-1">
                <StarPicker value={form.stars} onChange={v => setForm(p => ({ ...p, stars: v }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-order">Sort Order</Label>
              <Input id="t-order" type="number" min="0" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: e.target.value }))} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="t-comment"><Req>Review Comment</Req></Label>
              <textarea
                id="t-comment"
                value={form.comment}
                onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
                rows={4}
                placeholder="Customer's review..."
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 text-foreground resize-none"
              />
            </div>
            <div className="flex items-center gap-3 sm:col-span-2 mt-2">
              <button type="button" onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}>
                {form.isActive
                  ? <ToggleRight className="h-7 w-7 text-emerald-500" />
                  : <ToggleLeft className="h-7 w-7 text-muted-foreground" />}
              </button>
              <span className="text-xs text-muted-foreground">{form.isActive ? "Visible on store" : "Hidden from store"}</span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeModal} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <MessageSquareQuote className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No testimonials yet. Add your first one.</p>
        </div>
      ) : (
        <TooltipProvider>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item._id} className={cn(
                "rounded-xl border p-4 flex flex-col sm:flex-row sm:items-start gap-4 transition-colors",
                item.isActive ? "bg-card border-border" : "bg-muted/30 border-dashed border-border/50 opacity-60"
              )}>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">{item.name}</span>
                    {item.location && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{item.location}</span>
                    )}
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("h-3.5 w-3.5", i < item.stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic leading-relaxed line-clamp-2">"{item.comment}"</p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
                  {deleteConfirm === item._id ? (
                    <DeleteConfirm onConfirm={() => handleDelete(item._id)} onCancel={() => setDeleteConfirm(null)} loading={deletingId === item._id} />
                  ) : (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={() => toggleActive(item)} className="hover:scale-105 transition-transform" aria-label={item.isActive ? "Deactivate" : "Activate"}>
                            {item.isActive
                              ? <ToggleRight className="h-6 w-6 text-emerald-500" />
                              : <ToggleLeft className="h-6 w-6 text-muted-foreground" />}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>{item.isActive ? "Disable" : "Enable"}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={() => openEdit(item)} className="h-8 w-8 p-0">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Testimonial</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(item._id)} className="h-8 w-8 p-0 hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TooltipProvider>
      )}
    </div>
  );
}

// ── FAQS tab ───────────────────────────────────────────────────────────────────

function FAQsTab({ showToast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(FAQ_BLANK);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/faqs");
      const data = await res.json();
      if (data.success) setItems(data.faqs);
    } catch {
      showToast("Failed to load FAQs", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openAdd = () => { setForm(FAQ_BLANK); setEditId(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({ question: item.question, answer: item.answer, isActive: item.isActive, sortOrder: item.sortOrder });
    setEditId(item._id);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditId(null); setForm(FAQ_BLANK); };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      showToast("Question and answer are required", "error");
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/admin/faqs/${editId}` : "/api/admin/faqs";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        closeModal();
        fetchItems();
      } else {
        showToast(data.message || "Save failed", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        setItems(prev => prev.filter(i => i._id !== id));
      } else {
        showToast(data.message || "Delete failed", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setDeletingId(null);
      setDeleteConfirm(null);
    }
  };

  const toggleActive = async (item) => {
    try {
      const newState = !item.isActive;
      const res = await fetch(`/api/admin/faqs/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, isActive: newState }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.map(i => i._id === item._id ? { ...i, isActive: newState } : i));
        showToast(`FAQ ${newState ? "enabled" : "disabled"}`, "success");
      } else {
        showToast("Failed to toggle status", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">FAQs</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage frequently asked questions shown on the home page.
          </p>
        </div>
        <Button onClick={openAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      </div>

      <Dialog open={showModal} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit FAQ" : "New FAQ"}</DialogTitle>
            <DialogDescription>Clear answers help customers make confident purchases.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="faq-q"><Req>Question</Req></Label>
              <Input id="faq-q" value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} placeholder="e.g. What are your shipping times?" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="faq-a"><Req>Answer</Req></Label>
              <textarea
                id="faq-a"
                value={form.answer}
                onChange={e => setForm(p => ({ ...p, answer: e.target.value }))}
                rows={5}
                placeholder="Detailed answer..."
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 text-foreground resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="faq-order">Sort Order</Label>
                <Input id="faq-order" type="number" min="0" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: e.target.value }))} />
              </div>
              <div className="space-y-1.5 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <button type="button" onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}>
                    {form.isActive
                      ? <ToggleRight className="h-7 w-7 text-emerald-500" />
                      : <ToggleLeft className="h-7 w-7 text-muted-foreground" />}
                  </button>
                  <span className="text-xs text-muted-foreground">{form.isActive ? "Visible" : "Hidden"}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeModal} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <HelpCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No FAQs yet. Add your first one.</p>
        </div>
      ) : (
        <TooltipProvider>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item._id} className={cn(
                "rounded-xl border transition-colors",
                item.isActive ? "bg-card border-border" : "bg-muted/30 border-dashed border-border/50 opacity-60"
              )}>
                <button
                  onClick={() => setExpanded(expanded === item._id ? null : item._id)}
                  className="w-full flex items-center justify-between p-4 text-left gap-4"
                >
                  <span className="font-semibold text-sm text-foreground line-clamp-1">{item.question}</span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", expanded === item._id && "rotate-180")} />
                </button>
                {expanded === item._id && (
                  <div className="px-4 pb-4 border-t border-border/50 pt-3">
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{item.answer}</p>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {deleteConfirm === item._id ? (
                        <DeleteConfirm onConfirm={() => handleDelete(item._id)} onCancel={() => setDeleteConfirm(null)} loading={deletingId === item._id} />
                      ) : (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => toggleActive(item)} className="hover:scale-105 transition-transform" aria-label={item.isActive ? "Deactivate" : "Activate"}>
                                {item.isActive
                                  ? <ToggleRight className="h-6 w-6 text-emerald-500" />
                                  : <ToggleLeft className="h-6 w-6 text-muted-foreground" />}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>{item.isActive ? "Disable" : "Enable"}</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="ghost" onClick={() => openEdit(item)} className="h-8 w-8 p-0">
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit FAQ</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(item._id)} className="h-8 w-8 p-0 hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TooltipProvider>
      )}
    </div>
  );
}

// ── HERO SECTION tab ───────────────────────────────────────────────────────────

function HeroSectionTab({ showToast }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroType, setHeroType] = useState("creative");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroBackgroundImage, setHeroBackgroundImage] = useState("");

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setHeroType(data.settings.heroType || "creative");
        setHeroTitle(data.settings.heroTitle || "Reveal Your Natural Glow");
        setHeroSubtitle(data.settings.heroSubtitle || "Premium jewelry & accessories crafted to elevate your style.");
        setHeroBackgroundImage(data.settings.heroBackgroundImage || "");
      }
    } catch {
      showToast("Failed to load hero settings", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroType,
          heroTitle,
          heroSubtitle,
          heroBackgroundImage
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Hero section settings saved!", "success");
      } else {
        showToast(data.message || "Save failed", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl bg-card border border-border rounded-xl p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-medium">Hero Section Setup</h3>
        <p className="text-sm text-muted-foreground">Choose the layout and content for the top section of your store homepage.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Layout Type</Label>
          <div className="grid grid-cols-2 gap-4">
            <label className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-muted/50",
              heroType === "creative" ? "border-primary bg-primary/5" : "border-muted"
            )}>
              <input type="radio" name="heroType" value="creative" checked={heroType === "creative"} onChange={(e) => setHeroType(e.target.value)} className="sr-only" />
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                <LayoutTemplate className="h-6 w-6 text-primary" />
              </div>
              <span className="font-semibold text-sm">Creative (Current)</span>
              <span className="text-xs text-muted-foreground text-center">Split layout with portrait slider</span>
            </label>
            <label className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-muted/50",
              heroType === "simple" ? "border-primary bg-primary/5" : "border-muted"
            )}>
              <input type="radio" name="heroType" value="simple" checked={heroType === "simple"} onChange={(e) => setHeroType(e.target.value)} className="sr-only" />
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <span className="font-semibold text-sm">Simple Image</span>
              <span className="text-xs text-muted-foreground text-center">Full width background with text</span>
            </label>
          </div>
        </div>

        {heroType === "simple" && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <Label>Background Image URL</Label>
              <Input value={heroBackgroundImage} onChange={(e) => setHeroBackgroundImage(e.target.value)} placeholder="https://res.cloudinary.com/... or /images/bg.jpg" />
              <p className="text-xs text-muted-foreground">Upload your image to Cloudinary and paste the URL here. Recommended size: 1920x1080px.</p>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="Reveal Your Natural Glow" />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} placeholder="Premium jewelry & accessories..." />
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Layout
        </Button>
      </div>
    </form>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────


export default function HomeContentPage() {
  const [activeTab, setActiveTab] = useState("testimonials");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const tabs = [
    { id: "hero", label: "Hero Section", icon: LayoutTemplate },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Home Page Content</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage dynamic content displayed on the public store home page.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "hero" && <HeroSectionTab showToast={showToast} />}
        {activeTab === "testimonials" && <TestimonialsTab showToast={showToast} />}
        {activeTab === "faqs" && <FAQsTab showToast={showToast} />}
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
