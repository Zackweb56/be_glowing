"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Layers, Search, Edit2, Loader2, Image as ImageIcon, AlertCircle, CheckCircle2, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

function Req({ children }) {
  return (
    <span className="flex items-center gap-1">
      {children}<span className="text-red-500 text-sm leading-none">*</span>
    </span>
  );
}

function AlertBanner({ type, message }) {
  if (!message) return null;
  const isError = type === "error";
  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 rounded-md text-sm border ${
      isError ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    }`}>
      {isError ? <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> : <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />}
      <span>{message}</span>
    </div>
  );
}

function StockStatus({ qty, threshold }) {
  if (qty === 0) return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
      <AlertTriangle className="h-4 w-4" /> Out of Stock
    </div>
  );
  if (qty <= threshold) return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
      <AlertCircle className="h-4 w-4" /> Low Stock
    </div>
  );
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
      <CheckCircle2 className="h-4 w-4" /> In Stock
    </div>
  );
}

export default function StockPage() {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [quantity, setQuantity] = useState("0");
  const [alertThreshold, setAlertThreshold] = useState("5");

  // Feedback
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleOpenEdit = (item) => {
    setEditingStock(item);
    setQuantity(item.quantity.toString());
    setAlertThreshold(item.alertThreshold.toString());
    setErrorMsg(""); setSuccessMsg("");
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity === "" || isNaN(quantity) || parseInt(quantity) < 0) {
      setErrorMsg("Quantity must be 0 or greater"); return;
    }
    if (alertThreshold === "" || isNaN(alertThreshold) || parseInt(alertThreshold) < 0) {
      setErrorMsg("Alert threshold must be 0 or greater"); return;
    }
    setSubmitting(true); setErrorMsg(""); setSuccessMsg("");
    try {
      const res = await fetch(`/api/admin/stock/${editingStock._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: parseInt(quantity), alertThreshold: parseInt(alertThreshold) }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Stock updated successfully!");
        fetchStock();
        setTimeout(() => setDialogOpen(false), 900);
      } else {
        setErrorMsg(data.message || "Failed to update stock");
      }
    } catch { setErrorMsg("Server error. Please try again."); }
    finally { setSubmitting(false); }
  };

  const filtered = stockItems.filter((item) => {
    const product = item.product || {};
    const matchSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const isOut = item.quantity === 0;
    const isLow = item.quantity <= item.alertThreshold && !isOut;
    const matchStatus = statusFilter === "all" || (statusFilter === "out" && isOut) || (statusFilter === "low" && isLow);
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Stock Management</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Track inventory levels and replenishment alerts.</p>
      </div>

      <Separator />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by product or SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 bg-card border-border" />
        </div>
        <div className="flex bg-muted/60 p-0.5 rounded-lg border border-border/80 w-fit self-start sm:self-auto gap-0.5">
          {["all", "low", "out"].map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              statusFilter === f
                ? f === "all" ? "bg-card text-foreground shadow-sm" : f === "low" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"
                : "text-muted-foreground hover:text-foreground"
            }`}>
              {f === "all" ? "All Stock" : f === "low" ? "Low Stock" : "Out of Stock"}
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
            <Layers className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium">No inventory found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchTerm || statusFilter !== "all" ? "Try adjusting your filters." : "Products will appear here once added."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Alert At</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const product = item.product || {};
                return (
                  <tr key={item._id} className="border-b border-border/40 hover:bg-accent/20 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 rounded-md bg-accent/20 border border-border overflow-hidden flex items-center justify-center">
                          {product.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                          )}
                        </div>
                        <span className="font-medium truncate max-w-[180px]">{product.name || "Deleted"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{product.sku || "—"}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{product.category?.name || "—"}</td>
                    <td className="px-4 py-3.5"><StockStatus qty={item.quantity} threshold={item.alertThreshold} /></td>
                    <td className="px-4 py-3.5 font-medium">{item.quantity} units</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{item.alertThreshold}</td>
                    <td className="px-4 py-3.5 text-right">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)} className="h-8 gap-1.5">
                        <Edit2 className="h-3 w-3" /> Update
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Stock Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Inventory</DialogTitle>
            <DialogDescription>
              Adjust stock for{" "}
              <strong>{editingStock?.product?.name || "this product"}</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {/* Alert banners above form */}
            <AlertBanner type="error" message={errorMsg} />
            <AlertBanner type="success" message={successMsg} />

            {/* Product preview */}
            {editingStock?.product && (
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border/80">
                <div className="h-12 w-12 shrink-0 rounded-md bg-accent/20 border border-border overflow-hidden flex items-center justify-center">
                  {editingStock.product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={editingStock.product.images[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">{editingStock.product.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">SKU: {editingStock.product.sku || "—"}</p>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-1.5">
              <Label htmlFor="stock-qty"><Req>Available Quantity</Req></Label>
              <Input id="stock-qty" type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="bg-background border-border" disabled={submitting} />
            </div>

            {/* Alert Threshold */}
            <div className="space-y-1.5">
              <Label htmlFor="stock-alert"><Req>Low Stock Alert Limit</Req></Label>
              <Input id="stock-alert" type="number" min="0" value={alertThreshold} onChange={(e) => setAlertThreshold(e.target.value)} className="bg-background border-border" disabled={submitting} />
              <p className="text-[10px] text-muted-foreground">Shows a warning when stock reaches this number.</p>
            </div>
          </form>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Update Stock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
