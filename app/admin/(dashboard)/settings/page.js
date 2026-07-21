"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { MdStore as Store, MdDescription as FileText, MdShare as Share2, MdVpnKey as KeyRound, MdLoop as Loader2, MdSave as Save, MdPersonOutline as User, MdCampaign as Megaphone, MdDeleteOutline as Trash2, MdUpload as Upload, MdClose as X, MdPublic as Globe, MdPalette as Palette } from 'react-icons/md';
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
  const [logoUrl, setLogoUrl] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef(null);
  // SEO
  const [siteTitle, setSiteTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  // Contact
  const [contactEmail, setContactEmail] = useState("contact@beglowing.com");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("Morocco");
  const [currency, setCurrency] = useState("MAD");

  // Policies Form State
  const [shippingPolicy, setShippingPolicy] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");

  // Announcements Form State
  const [announcements, setAnnouncements] = useState([]);

  // Theme & Appearance Form State
  const [themePrimaryColor, setThemePrimaryColor] = useState("#B8963E");
  const [themeSecondaryColor, setThemeSecondaryColor] = useState("#E8E4DF");
  const [themePrimaryFont, setThemePrimaryFont] = useState("Inter");
  const [themeSecondaryFont, setThemeSecondaryFont] = useState("Inter");

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
            setLogoUrl(s.logoUrl || "");
            setSiteTitle(s.siteTitle || "");
            setSeoDescription(s.seoDescription || "");
            setSeoKeywords(s.seoKeywords || "");
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
            setAnnouncements(s.announcements || []);
            setThemePrimaryColor(s.themePrimaryColor || "#B8963E");
            setThemeSecondaryColor(s.themeSecondaryColor || "#E8E4DF");
            setThemePrimaryFont(s.themePrimaryFont || "Inter");
            setThemeSecondaryFont(s.themeSecondaryFont || "Inter");
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

    const body = {
      storeName,
      logoUrl,
      siteTitle,
      seoDescription,
      seoKeywords,
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
      announcements,
      themePrimaryColor,
      themeSecondaryColor,
      themePrimaryFont,
      themeSecondaryFont,
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast("Please select an image file", "error");
      return;
    }
    setLogoUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        setLogoUrl(data.url);
        showToast("Logo uploaded successfully", "success");
      } else {
        showToast(data.message || "Upload failed", "error");
      }
    } catch (err) {
      showToast("An error occurred during upload", "error");
    } finally {
      setLogoUploading(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
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
    { id: "theme", label: "Theme & Appearance", icon: Palette },
    { id: "announcements", label: "Announcements", icon: Megaphone },
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

                  {/* --- LOGO SECTION --- */}
                  <div className="pt-4 border-t border-border/40 space-y-3">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-primary" />
                      <Label className="text-sm font-semibold">Site Logo</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload your brand logo. It will appear in the public storefront navbar and the admin panel. Recommended: transparent PNG, max 400×120px.
                    </p>
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {/* Preview */}
                      <div className="h-20 w-48 rounded-lg border border-border/60 bg-muted/30 flex items-center justify-center overflow-hidden shrink-0">
                        {logoUrl ? (
                          <Image src={logoUrl} alt="Site logo preview" width={180} height={72} className="object-contain max-h-16 max-w-full" />
                        ) : (
                          <span className="text-xs text-muted-foreground">No logo uploaded</span>
                        )}
                      </div>
                      {/* Controls */}
                      <div className="flex flex-col gap-2">
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-file-input"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={logoUploading}
                          onClick={() => logoInputRef.current?.click()}
                          className="flex gap-2"
                        >
                          {logoUploading ? (
                            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading...</>
                          ) : (
                            <><Upload className="h-3.5 w-3.5" /> Choose Image</>
                          )}
                        </Button>
                        {logoUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setLogoUrl("")}
                            className="flex gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-3.5 w-3.5" /> Remove Logo
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* --- SEO SECTION --- */}
                  <div className="pt-4 border-t border-border/40 space-y-4">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <Label className="text-sm font-semibold">SEO & Site Identity</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteTitle">Browser Tab Title</Label>
                      <Input
                        id="siteTitle"
                        value={siteTitle}
                        onChange={(e) => setSiteTitle(e.target.value)}
                        placeholder="e.g. Be Glowing | Premium Jewelry & Accessories"
                        maxLength={70}
                      />
                      <p className="text-[11px] text-muted-foreground">{siteTitle.length}/70 characters — ideal under 60.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoDescription">Meta Description</Label>
                      <textarea
                        id="seoDescription"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder="A compelling 1–2 sentence description of your store for search engines..."
                        rows={3}
                        maxLength={160}
                        className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      />
                      <p className="text-[11px] text-muted-foreground">{seoDescription.length}/160 characters — ideal 120–155.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoKeywords">Keywords (comma-separated)</Label>
                      <Input
                        id="seoKeywords"
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        placeholder="jewelry, necklaces, bracelets, be glowing, morocco"
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

          {/* THEME & APPEARANCE TAB */}
          {activeTab === "theme" && (
            <form onSubmit={handleSaveSettings}>
              <Card className="border border-border bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" /> Theme & Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize the colors and typography of your storefront. We provide a curated selection of elegant fonts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="themePrimaryColor">Primary Color</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="themePrimaryColor"
                          type="color"
                          className="w-12 h-12 p-1 cursor-pointer"
                          value={themePrimaryColor}
                          onChange={(e) => setThemePrimaryColor(e.target.value)}
                        />
                        <Input
                          type="text"
                          value={themePrimaryColor}
                          onChange={(e) => setThemePrimaryColor(e.target.value)}
                          placeholder="#B8963E"
                          className="flex-1 bg-background/50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Used for buttons, highlights, and important accents.</p>
                      {/* Suggested Primary Colors */}
                      <div className="flex gap-2 mt-2">
                        {["#B8963E", "#2A363B", "#8C5E58", "#3E5C76"].map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setThemePrimaryColor(color)}
                            className="w-6 h-6 rounded-full border border-border/50 shadow-sm transition-transform hover:scale-110 focus:outline-none"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="themeSecondaryColor">Secondary Color</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="themeSecondaryColor"
                          type="color"
                          className="w-12 h-12 p-1 cursor-pointer"
                          value={themeSecondaryColor}
                          onChange={(e) => setThemeSecondaryColor(e.target.value)}
                        />
                        <Input
                          type="text"
                          value={themeSecondaryColor}
                          onChange={(e) => setThemeSecondaryColor(e.target.value)}
                          placeholder="#E8E4DF"
                          className="flex-1 bg-background/50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Used for soft backgrounds and subtle borders.</p>
                      {/* Suggested Secondary Colors */}
                      <div className="flex gap-2 mt-2">
                        {["#E8E4DF", "#F5F5F5", "#F7EAE3", "#E3E9F0"].map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setThemeSecondaryColor(color)}
                            className="w-6 h-6 rounded-full border border-border/50 shadow-sm transition-transform hover:scale-110 focus:outline-none"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                    <div className="space-y-2">
                      <Label htmlFor="themePrimaryFont">Primary Font (Headings)</Label>
                      <select
                        id="themePrimaryFont"
                        value={themePrimaryFont}
                        onChange={(e) => setThemePrimaryFont(e.target.value)}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Inter">Inter (Modern, Clean)</option>
                        <option value="Playfair Display">Playfair Display (Elegant, Serif)</option>
                        <option value="Montserrat">Montserrat (Geometric, Bold)</option>
                        <option value="Lora">Lora (Classic, Serif)</option>
                        <option value="Outfit">Outfit (Contemporary, Geometric)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="themeSecondaryFont">Secondary Font (Body Text)</Label>
                      <select
                        id="themeSecondaryFont"
                        value={themeSecondaryFont}
                        onChange={(e) => setThemeSecondaryFont(e.target.value)}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Inter">Inter (Modern, Clean)</option>
                        <option value="Roboto">Roboto (Versatile, Readable)</option>
                        <option value="Open Sans">Open Sans (Friendly, Web-safe)</option>
                        <option value="Lato">Lato (Warm, Structured)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t border-border mt-4 flex justify-end gap-3 p-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="min-w-[120px]"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Theme
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}

          {/* ANNOUNCEMENTS TAB */}
          {activeTab === "announcements" && (
            <form onSubmit={handleSaveSettings}>
              <Card className="border border-border bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-primary" /> Top Bar Announcements
                  </CardTitle>
                  <CardDescription>
                    Manage announcements displayed at the very top of the store. If multiple are active, they will rotate.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {announcements.map((ann, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-background/50 flex flex-col gap-3 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          const newAnn = [...announcements];
                          newAnn.splice(index, 1);
                          setAnnouncements(newAnn);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="space-y-1 pr-8">
                        <Label>Announcement Text</Label>
                        <Input
                          value={ann.text}
                          onChange={(e) => {
                            const newAnn = [...announcements];
                            newAnn[index].text = e.target.value;
                            setAnnouncements(newAnn);
                          }}
                          placeholder="e.g. Free shipping on orders over 500 MAD!"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label>Link URL (Optional)</Label>
                          <Input
                            value={ann.url}
                            onChange={(e) => {
                              const newAnn = [...announcements];
                              newAnn[index].url = e.target.value;
                              setAnnouncements(newAnn);
                            }}
                            placeholder="e.g. /store?category=offers"
                          />
                        </div>
                        <div className="space-y-1 flex items-center pt-6">
                          <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input
                              type="checkbox"
                              checked={ann.isActive !== false} // default to true if undefined
                              onChange={(e) => {
                                const newAnn = [...announcements];
                                newAnn[index].isActive = e.target.checked;
                                setAnnouncements(newAnn);
                              }}
                              className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                            />
                            Active
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex gap-2 border-dashed"
                    onClick={() => setAnnouncements([...announcements, { text: "", url: "", isActive: true }])}
                  >
                    <Plus className="h-4 w-4" /> Add Announcement
                  </Button>
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
