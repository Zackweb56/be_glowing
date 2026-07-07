"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Store,
  FileText,
  Share2,
  KeyRound,
  Loader2,
  Save,
  User,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Toast } from "@/components/admin/Toast";

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [activeTab, setActiveTab] = useState("store");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Store Settings Form State
  const [storeName, setStoreName] = useState("Be Glowing");
  const [contactEmail, setContactEmail] = useState("contact@beglowing.com");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("Morocco");
  const [currency, setCurrency] = useState("MAD");

  // Policies Form State
  const [shippingPolicy, setShippingPolicy] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");

  // Social Links Form State
  const [whatsapp, setWhatsapp] = useState("+212");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");

  // Admin Profile Form State
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [securitySaving, setSecuritySaving] = useState(false);

  // Fetch all settings and user details on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch Store Settings
        const settingsRes = await fetch("/api/admin/settings");
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.success && settingsData.settings) {
            const s = settingsData.settings;
            setStoreName(s.storeName || "Be Glowing");
            setContactEmail(s.contactEmail || "contact@beglowing.com");
            setContactPhone(s.contactPhone || "");
            setAddress(s.address || "Morocco");
            setCurrency(s.currency || "MAD");
            setShippingPolicy(s.shippingPolicy || "");
            setPrivacyPolicy(s.privacyPolicy || "");
            setReturnPolicy(s.returnPolicy || "");
            setWhatsapp(s.whatsapp || "+212");
            setInstagram(s.instagram || "");
            setFacebook(s.facebook || "");
            setTiktok(s.tiktok || "");
          }
        }

        // Fetch User Profile details
        const profileRes = await fetch("/api/admin/profile");
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.success && profileData.user) {
            setAdminName(profileData.user.name || "");
            setAdminEmail(profileData.user.email || "");
          }
        }
      } catch (err) {
        console.error("Error loading settings:", err);
        showToast("Failed to load settings data", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          contactEmail,
          contactPhone,
          address,
          currency,
          shippingPolicy,
          privacyPolicy,
          returnPolicy,
          whatsapp,
          instagram,
          facebook,
          tiktok,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || "Settings updated successfully", "success");
      } else {
        showToast(data.message || "Failed to update settings", "error");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      showToast("An error occurred while saving settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-profile",
          name: adminName,
          email: adminEmail,
          currentPassword: currentPassword, // needed if email is changed
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Profile details updated successfully", "success");
        setCurrentPassword(""); // clear password field
        // Trigger session update if details changed
        if (updateSession) {
          await updateSession({
            ...session,
            user: {
              ...session?.user,
              name: adminName,
              email: adminEmail,
            },
          });
        }
      } else {
        showToast(data.message || "Failed to update profile", "error");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast("An error occurred while updating profile", "error");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters long", "error");
      return;
    }

    setSecuritySaving(true);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change-password",
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Password changed successfully", "success");
        // Reset password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        showToast(data.message || "Failed to update password", "error");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      showToast("An error occurred while changing password", "error");
    } finally {
      setSecuritySaving(false);
    }
  };

  const tabs = [
    { id: "store", label: "Store Details", icon: Store },
    { id: "policies", label: "Store Policies", icon: FileText },
    { id: "social", label: "Social Links", icon: Share2 },
    { id: "security", label: "Security & Profile", icon: KeyRound },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading settings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your storefront configuration, localized policies, social handles, and administrator security profile.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Navigation Tabs */}
        <div className="flex flex-row overflow-x-auto gap-1 pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap lg:whitespace-normal ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="lg:col-span-3">
          {/* STORE DETAILS TAB */}
          {activeTab === "store" && (
            <form onSubmit={handleSaveSettings}>
              <Card className="border border-border bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Store className="h-4 w-4 text-primary" /> General Store Details
                  </CardTitle>
                  <CardDescription>
                    Configure the display name, contact coordinates, and default pricing currency.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="e.g. Be Glowing"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="h-8 w-full min-w-0 rounded-lg border border-input bg-background/50 px-2.5 py-1 text-sm text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <option value="MAD">MAD (Moroccan Dirham)</option>
                        <option value="EUR">EUR (Euro)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Customer Support Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="support@beglowing.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Support Phone Number</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="e.g. +212 600-000000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Physical Store Address</Label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 123 Rue de la Liberté, Casablanca, Morocco"
                      rows={3}
                      className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t border-border/40 pt-4">
                  <Button type="submit" disabled={saving} size="sm">
                    {saving ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-1.5 h-3.5 w-3.5" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}

          {/* STORE POLICIES TAB */}
          {activeTab === "policies" && (
            <form onSubmit={handleSaveSettings}>
              <Card className="border border-border bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" /> Store Policies
                  </CardTitle>
                  <CardDescription>
                    Configure the legal policies of the store. These will be displayed on their respective public frontend pages.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Policy */}
                  <div className="space-y-2">
                    <Label htmlFor="shippingPolicy" className="text-sm font-semibold">
                      Politique d’expédition (Shipping Policy)
                    </Label>
                    <textarea
                      id="shippingPolicy"
                      value={shippingPolicy}
                      onChange={(e) => setShippingPolicy(e.target.value)}
                      placeholder="Explain shipping methods, times, fees, and rules..."
                      rows={6}
                      className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </div>

                  {/* Return Policy */}
                  <div className="space-y-2">
                    <Label htmlFor="returnPolicy" className="text-sm font-semibold">
                      Politique de retour (Return Policy)
                    </Label>
                    <textarea
                      id="returnPolicy"
                      value={returnPolicy}
                      onChange={(e) => setReturnPolicy(e.target.value)}
                      placeholder="Explain return windows, refund methods, conditions, and processes..."
                      rows={6}
                      className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </div>

                  {/* Privacy Policy */}
                  <div className="space-y-2">
                    <Label htmlFor="privacyPolicy" className="text-sm font-semibold">
                      Politique de confidentialité (Privacy Policy)
                    </Label>
                    <textarea
                      id="privacyPolicy"
                      value={privacyPolicy}
                      onChange={(e) => setPrivacyPolicy(e.target.value)}
                      placeholder="Explain user data collection, cookies, analytics, and terms..."
                      rows={6}
                      className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t border-border/40 pt-4">
                  <Button type="submit" disabled={saving} size="sm">
                    {saving ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-1.5 h-3.5 w-3.5" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}

          {/* SOCIAL LINKS TAB */}
          {activeTab === "social" && (
            <form onSubmit={handleSaveSettings}>
              <Card className="border border-border bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-primary" /> Social Channels & Links
                  </CardTitle>
                  <CardDescription>
                    Provide links to your social media presence. These links will appear on your storefront.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Connection (Number with country code)</Label>
                      <div className="relative">
                        <Input
                          id="whatsapp"
                          type="text"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="e.g. +212600000000"
                          required
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Ensure you write the country code (default Moroccan code: <strong>+212</strong>) followed by the number.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram Account URL</Label>
                      <Input
                        id="instagram"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="https://instagram.com/yourprofile"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook Page URL</Label>
                      <Input
                        id="facebook"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tiktok">TikTok Username/Link</Label>
                      <Input
                        id="tiktok"
                        value={tiktok}
                        onChange={(e) => setTiktok(e.target.value)}
                        placeholder="https://tiktok.com/@yourprofile"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t border-border/40 pt-4">
                  <Button type="submit" disabled={saving} size="sm">
                    {saving ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-1.5 h-3.5 w-3.5" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}

          {/* SECURITY & PROFILE TAB */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* ADMIN PROFILE */}
              <form onSubmit={handleUpdateProfile}>
                <Card className="border border-border bg-card/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" /> Admin User Profile
                    </CardTitle>
                    <CardDescription>
                      Update display name and administrator login email credentials.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="adminName">Display Name</Label>
                        <Input
                          id="adminName"
                          value={adminName}
                          onChange={(e) => setAdminName(e.target.value)}
                          placeholder="Admin Name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adminEmail">Login Email Address</Label>
                        <Input
                          id="adminEmail"
                          type="email"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          placeholder="admin@beglowing.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Require password confirmation if email changes */}
                    {adminEmail !== (session?.user?.email || "") && (
                      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-lg space-y-2">
                        <p className="text-xs font-semibold">
                          Security Note: You are changing the administrator email. Please confirm your current password to proceed.
                        </p>
                        <div className="max-w-xs space-y-1.5">
                          <Label htmlFor="confirmProfilePassword">Current Password</Label>
                          <Input
                            id="confirmProfilePassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 border-t border-border/40 pt-4">
                    <Button type="submit" disabled={profileSaving} size="sm">
                      {profileSaving ? (
                        <>
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-1.5 h-3.5 w-3.5" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>

              {/* ADMIN PASSWORD CHANGE */}
              <form onSubmit={handleChangePassword}>
                <Card className="border border-border bg-card/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-primary" /> Update Password
                    </CardTitle>
                    <CardDescription>
                      Change the secure password used to access the administrator panel.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 max-w-sm">
                      <Label htmlFor="securityCurrentPassword">Current Password</Label>
                      <Input
                        id="securityCurrentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min. 8 characters"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                        <Input
                          id="confirmNewPassword"
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="Confirm new password"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 border-t border-border/40 pt-4">
                    <Button type="submit" disabled={securitySaving} size="sm" variant="default">
                      {securitySaving ? (
                        <>
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Success/Error Toast notification */}
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
