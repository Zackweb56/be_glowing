import { MdInventory2 as Package, MdFolderOpen as FolderOpen, MdShoppingCart as ShoppingCart, MdLayers as Layers, MdTrendingUp as TrendingUp, MdAccessTime as Clock } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const statCards = [
  {
    title: "Total Products",
    value: "—",
    description: "Active listings",
    icon: Package,
    trend: null,
  },
  {
    title: "Categories",
    value: "—",
    description: "Product categories",
    icon: FolderOpen,
    trend: null,
  },
  {
    title: "Total Orders",
    value: "—",
    description: "All time",
    icon: ShoppingCart,
    trend: null,
  },
  {
    title: "Stock Items",
    value: "—",
    description: "In inventory",
    icon: Layers,
    trend: null,
  },
];

const recentOrders = [
  // Placeholder rows — will be replaced with real data
  { id: "#0001", customer: "—", status: "pending", amount: "—", date: "—" },
  { id: "#0002", customer: "—", status: "confirmed", amount: "—", date: "—" },
  { id: "#0003", customer: "—", status: "shipped", amount: "—", date: "—" },
];

const statusVariant = {
  pending: "secondary",
  confirmed: "outline",
  shipped: "default",
  cancelled: "destructive",
};

export const metadata = {
  title: "Dashboard — Be Glowing Admin",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ title, value, description, icon: Icon }) => (
          <Card key={title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
              <CardDescription className="mt-0.5">
                Latest customer orders from your store
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Live
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {/* Table header */}
          <div className="grid grid-cols-4 px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60 border-b border-border">
            <span>Order</span>
            <span>Customer</span>
            <span>Status</span>
            <span className="text-right">Amount</span>
          </div>
          {/* Rows */}
          {recentOrders.map((order, i) => (
            <div
              key={order.id}
              className="grid grid-cols-4 items-center px-4 py-3 text-sm hover:bg-accent/40 transition-colors border-b border-border/50 last:border-0"
            >
              <span className="font-mono text-xs text-muted-foreground">{order.id}</span>
              <span className="text-foreground truncate pr-2">{order.customer}</span>
              <Badge
                variant={statusVariant[order.status] || "secondary"}
                className="w-fit text-[10px] capitalize"
              >
                {order.status}
              </Badge>
              <span className="text-right text-muted-foreground">{order.amount}</span>
            </div>
          ))}
          {/* Empty state hint */}
          <div className="px-4 py-6 text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground/60">
              Orders will appear here once customers start placing them
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
