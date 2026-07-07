"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Image as ImageIcon, Loader2, AlertTriangle, CheckCircle2,
  AlertCircle, Eye, Pencil, Trash2, ToggleLeft, ToggleRight, X,
  TrendingUp, PackageX, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toast } from "@/components/admin/Toast";
import { cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getStockStatus(item) {
  if (!item.isInitialized) return { label: "Not Initialized", color: "bg-muted/60 text-muted-foreground border-border/60" };
  if (item.quantity === 0) return { label: "Out of Stock", color: "bg-destructive/10 text-destructive border-destructive/20" };
  if (item.quantity <= item.alertThreshold) return { label: "Low Stock", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
  return { label: "In Stock", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
}

function SellRate({ initial, sold }) {
  if (!initial || initial === 0) return <span className="text-muted-foreground text-xs">N/A</span>;
  const rate = Math.round((sold / initial) * 100);
  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Sell rate:</span>
        <span className={cn("text-xs font-bold", rate > 50 ? "text-emerald-500" : rate > 20 ? "text-amber-500" : "text-destructive")}>
          {rate}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted/40 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", rate > 50 ? "bg-emerald-500" : rate > 20 ? "bg-amber-500" : "bg-destructive")}
          style={{ width: `${Math.min(rate, 100)}%` }}
        />
      </div>
    </div>
  );
}

function AlertBanner({ type, message }) {
  if (!message) return null;
  const isErr = type === "error";
  return (
    <div className={`flex items-start gap-2.5 px-3 py-2.5 rounded-md text-sm border ${isErr ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"}`}>
      {isErr ? <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> : <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />}
      <span>{message}</span>
    </div>
  );
}

// ─── Initialize Stock Modal ───────────────────────────────────────────────────
function InitializeModal({ item, onClose, onSuccess }) {
  const [qty, setQty] = useState("0");
  const [threshold, setThreshold] = useState("5");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (qty === "" || isNaN(qty) || parseInt(qty) < 0) { setError("Quantity must be 0 or greater"); return; }
    if (threshold === "" || isNaN(threshold) || parseInt(threshold) < 0) { setError("Threshold must be 0 or greater"); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch(`/api/admin/stock/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "initialize", quantity: parseInt(qty), alertThreshold: parseInt(threshold) }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess("Stock initialized successfully!", data.stock);
        onClose();
      } else {
        setError(data.message || "Failed to initialize stock");
      }
    } catch { setError("Server error. Please try again."); }
    finally { setSubmitting(false); }
  };

  const product = item.product || {};
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Initialize Stock</DialogTitle>
          <DialogDescription>Set the initial stock quantity for this product. <span className="text-destructive font-semibold">This can only be done once.</span></DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <AlertBanner type="error" message={error} />
          <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border/80">
            <div className="h-12 w-12 shrink-0 rounded-md bg-accent/20 border border-border overflow-hidden flex items-center justify-center">
              {product.images?.[0]
                ? <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                : <ImageIcon className="h-4 w-4 text-muted-foreground/30" />}
            </div>
            <div>
              <p className="font-semibold text-sm">{product.name}</p>
              <p className="text-xs text-primary font-medium">{product.price?.toFixed(2)} DH</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="init-qty">Initial Quantity <span className="text-red-500">*</span></Label>
              <Input id="init-qty" type="number" min="0" value={qty} onChange={(e) => setQty(e.target.value)} className="bg-background border-border" disabled={submitting} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="init-threshold">Alert Threshold <span className="text-red-500">*</span></Label>
              <Input id="init-threshold" type="number" min="0" value={threshold} onChange={(e) => setThreshold(e.target.value)} className="bg-background border-border" disabled={submitting} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground bg-muted/30 rounded-md p-2 border border-border/50">
            <span className="font-semibold text-foreground">Note:</span> After initialization, use the <span className="font-medium">Add Sales</span> action to record sold units and automatically reduce remaining stock.
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Initializing...</> : "Initialize Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Add Sales Modal ──────────────────────────────────────────────────────────
function AddSalesModal({ item, onClose, onSuccess }) {
  const [soldCount, setSoldCount] = useState("0");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const preview = parseInt(soldCount) > 0 ? {
    newQty: Math.max(0, item.quantity - parseInt(soldCount)),
    totalSold: (item.soldQuantity || 0) + parseInt(soldCount),
    newSales: parseInt(soldCount),
  } : null;

  const handleSubmit = async () => {
    if (!soldCount || isNaN(soldCount) || parseInt(soldCount) <= 0) { setError("Enter a positive sold count"); return; }
    if (parseInt(soldCount) > item.quantity) { setError(`Cannot sell ${soldCount} — only ${item.quantity} available`); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch(`/api/admin/stock/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_sales", soldCount: parseInt(soldCount) }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess("Sales recorded successfully!", data.stock);
        onClose();
      } else {
        setError(data.message || "Failed to record sales");
      }
    } catch { setError("Server error. Please try again."); }
    finally { setSubmitting(false); }
  };

  const product = item.product || {};
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Sales</DialogTitle>
          <DialogDescription>Record new sales for <strong>{product.name}</strong>. Stock initial: {item.initialQuantity}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <AlertBanner type="error" message={error} />
          {/* Current Stock Summary */}
          <div className="grid grid-cols-3 text-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/60">
            <div>
              <p className="text-lg font-bold text-foreground">{item.initialQuantity}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Initial</p>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-500">{item.quantity}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Current</p>
            </div>
            <div>
              <p className="text-lg font-bold text-amber-500">{item.soldQuantity || 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Already Sold</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sales-count">New Sales Count <span className="text-red-500">*</span></Label>
            <Input id="sales-count" type="number" min="0" max={item.quantity} value={soldCount} onChange={(e) => setSoldCount(e.target.value)} className="bg-background border-border" disabled={submitting} />
            <p className="text-[10px] text-muted-foreground">Enter the number of new sales (max: {item.quantity} available)</p>
          </div>

          {/* Preview */}
          {preview && (
            <div className="space-y-1.5 rounded-lg border border-border/60 bg-muted/20 p-3">
              <p className="text-xs font-semibold text-emerald-500">Result after update:</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">New stock remaining:</span><span className="font-bold text-emerald-500">{preview.newQty}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total sold:</span><span className="font-bold text-amber-500">{preview.totalSold}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">New sales added:</span><span className="font-bold text-foreground">{preview.newSales}</span></div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting || parseInt(soldCount) <= 0}>
            {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Add Sales"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Stock Detail Modal (View) ─────────────────────────────────────────────
function StockDetailModal({ item, onClose }) {
  const product = item.product || {};
  const status = getStockStatus(item);
  const sellRate = item.initialQuantity ? Math.round((item.soldQuantity / item.initialQuantity) * 100) : 0;
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Stock Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-4 p-3 bg-muted/40 rounded-lg border border-border/80">
            <div className="h-14 w-14 shrink-0 rounded-lg bg-accent/20 border border-border overflow-hidden flex items-center justify-center">
              {product.images?.[0]
                ? <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                : <ImageIcon className="h-5 w-5 text-muted-foreground/30" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-primary font-medium">{product.price?.toFixed(2)} DH</p>
              <p className="text-xs text-muted-foreground">{product.category?.name}</p>
            </div>
            <Badge className={cn("text-[10px] px-2 py-0.5 border", status.color)}>{status.label}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Initial Stock", value: item.initialQuantity ?? 0, color: "text-foreground" },
              { label: "Current Stock", value: item.quantity ?? 0, color: "text-emerald-500" },
              { label: "Units Sold", value: item.soldQuantity ?? 0, color: "text-amber-500" },
              { label: "Alert Threshold", value: item.alertThreshold ?? 5, color: "text-muted-foreground" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={cn("text-2xl font-bold mt-0.5", color)}>{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Performance</p>
            <SellRate initial={item.initialQuantity} sold={item.soldQuantity} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded-md bg-muted/20 p-2 border border-border/50">
              <p className="font-medium text-foreground">Created</p>
              <p>{new Date(item.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</p>
            </div>
            <div className="rounded-md bg-muted/20 p-2 border border-border/50">
              <p className="font-medium text-foreground">Last Updated</p>
              <p>{new Date(item.updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function StockPage() {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState(null);

  const [activeModal, setActiveModal] = useState(null); // { type: 'init'|'sales'|'view', item }

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchStock = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stock");
      const data = await res.json();
      if (data.success) setStockItems(data.stock);
    } catch (err) {
      console.error("Failed to fetch stock:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStock(); }, [fetchStock]);

  const handleStockSuccess = (msg, updatedStock) => {
    showToast(msg, "success");
    setStockItems((prev) =>
      prev.map((item) => (item._id === updatedStock._id ? { ...item, ...updatedStock } : item))
    );
  };

  const handleToggleActive = async (item) => {
    try {
      const res = await fetch(`/api/admin/stock/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_active", isActive: !item.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setStockItems((prev) =>
          prev.map((s) => (s._id === item._id ? { ...s, isActive: !item.isActive } : s))
        );
        showToast(data.stock.isActive ? "Product enabled" : "Product disabled", "success");
      } else {
        showToast(data.message || "Failed to toggle", "error");
      }
    } catch {
      showToast("Server error", "error");
    }
  };

  const filtered = stockItems.filter((item) => {
    const product = item.product || {};
    const matchSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const isNotInit = !item.isInitialized;
    const isOut = item.isInitialized && item.quantity === 0;
    const isLow = item.isInitialized && item.quantity > 0 && item.quantity <= item.alertThreshold;
    const isInStock = item.isInitialized && item.quantity > item.alertThreshold;
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "uninit" && isNotInit) ||
      (statusFilter === "out" && isOut) ||
      (statusFilter === "low" && isLow) ||
      (statusFilter === "in" && isInStock);
    return matchSearch && matchStatus;
  });

  // Summary stats
  const totalProducts = stockItems.length;
  const totalActive = stockItems.filter((i) => i.isActive).length;
  const totalStock = stockItems.reduce((acc, i) => acc + (i.quantity || 0), 0);
  const totalSold = stockItems.reduce((acc, i) => acc + (i.soldQuantity || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Stock Management</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Track inventory, sales, and replenishment alerts.</p>
      </div>

      <Separator />

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Products", value: totalProducts },
          { label: "Active Products", value: totalActive },
          { label: "Stock Total", value: `${totalStock} units` },
          { label: "Units Sold", value: `${totalSold} units` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by product name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 bg-card border-border" />
        </div>
        <div className="flex bg-muted/60 p-0.5 rounded-lg border border-border/80 w-fit self-start sm:self-auto gap-0.5 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "uninit", label: "Not Initialized" },
            { key: "in", label: "In Stock" },
            { key: "low", label: "Low" },
            { key: "out", label: "Out" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                statusFilter === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading inventory...</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <PackageX className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium">No inventory found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchTerm || statusFilter !== "all" ? "Try adjusting your filters." : "Products will appear here once activated."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Stock Quantity</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Performance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const product = item.product || {};
                const status = getStockStatus(item);
                const isDisabledToggle = !item.isInitialized;
                return (
                  <tr key={item._id} className="border-b border-border/40 hover:bg-accent/20 transition-colors">
                    {/* Product */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-md bg-accent/20 border border-border overflow-hidden flex items-center justify-center">
                          {product.images?.[0]
                            ? <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                            : <ImageIcon className="h-4 w-4 text-muted-foreground/30" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-muted-foreground truncate">{product.category?.name}</p>
                          <p className="font-medium text-xs sm:text-sm truncate">{product.name || "Deleted"}</p>
                          <p className="text-xs text-primary font-medium">{product.price?.toFixed(2)} DH</p>
                        </div>
                      </div>
                    </td>

                    {/* Quantities */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5 text-xs">
                        <div className="flex gap-2 items-center">
                          <span className="text-muted-foreground w-14">Initial:</span>
                          <span className="font-bold text-foreground">{item.initialQuantity ?? 0}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="text-muted-foreground w-14">Sold:</span>
                          <span className="font-bold text-amber-500">{item.soldQuantity ?? 0}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="text-muted-foreground w-14">Remaining:</span>
                          <span className="font-bold text-emerald-500">{item.quantity ?? 0}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5">
                      <Badge className={cn("text-[10px] px-2 py-0.5 border font-semibold", status.color)}>
                        {status.label}
                      </Badge>
                    </td>

                    {/* Active Toggle */}
                    <td className="px-4 py-3.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => !isDisabledToggle && handleToggleActive(item)}
                            disabled={isDisabledToggle}
                            className={cn(
                              "flex items-center gap-2 rounded-lg px-2 py-1 transition-colors text-xs font-medium",
                              isDisabledToggle && "opacity-40 cursor-not-allowed",
                              !isDisabledToggle && item.isActive && "text-emerald-500 hover:bg-emerald-500/10",
                              !isDisabledToggle && !item.isActive && "text-muted-foreground hover:bg-accent",
                            )}
                          >
                            {item.isActive
                              ? <ToggleRight className="h-5 w-5" />
                              : <ToggleLeft className="h-5 w-5" />}
                            <span>{item.isActive ? "Active" : "Inactive"}</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {isDisabledToggle ? "Initialize stock first" : item.isActive ? "Disable product" : "Enable product"}
                        </TooltipContent>
                      </Tooltip>
                    </td>

                    {/* Performance */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1 min-w-[140px]">
                        <SellRate initial={item.initialQuantity} sold={item.soldQuantity} />
                        <p className="text-[10px] text-muted-foreground">Threshold: {item.alertThreshold}</p>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setActiveModal({ type: "view", item })}
                              className="p-2 rounded-lg bg-muted/50 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">View Details</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setActiveModal({ type: item.isInitialized ? "sales" : "init", item })}
                              className="p-2 rounded-lg bg-muted/50 hover:bg-muted/80 text-muted-foreground hover:text-primary transition-colors"
                            >
                              {item.isInitialized ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <Info className="h-4 w-4" />
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {item.isInitialized ? "Add Sales" : "Initialize Stock"}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {activeModal?.type === "init" && (
        <InitializeModal
          item={activeModal.item}
          onClose={() => setActiveModal(null)}
          onSuccess={(msg, stock) => { handleStockSuccess(msg, stock); fetchStock(); }}
        />
      )}
      {activeModal?.type === "sales" && (
        <AddSalesModal
          item={activeModal.item}
          onClose={() => setActiveModal(null)}
          onSuccess={(msg, stock) => { handleStockSuccess(msg, stock); fetchStock(); }}
        />
      )}
      {activeModal?.type === "view" && (
        <StockDetailModal
          item={activeModal.item}
          onClose={() => setActiveModal(null)}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}