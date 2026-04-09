import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { getPartnerSettings, savePartnerSettings } from "@/lib/store";
import { useAuth } from "@/lib/auth";

export const PartnerSettingsTab = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    companyName: "", website: "", contactEmail: "", description: "", twitter: "", linkedin: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const saved = getPartnerSettings(user.id);
      setForm({
        companyName: saved.companyName || user.name,
        website: saved.website || "",
        contactEmail: saved.contactEmail || user.email,
        description: saved.description || "",
        twitter: saved.twitter || "",
        linkedin: saved.linkedin || "",
      });
    }
  }, [user]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    savePartnerSettings(user.id, form);
    setSaving(false);
    toast.success("Settings saved!");
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader><CardTitle>Company Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input value={form.companyName} onChange={e => set("companyName", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Website</Label>
              <Input value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://yourcompany.com" className="mt-1" />
            </div>
            <div>
              <Label>Contact Email</Label>
              <Input type="email" value={form.contactEmail} onChange={e => set("contactEmail", e.target.value)} className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Tell startups about your product..." className="mt-1" rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Twitter / X</Label>
              <Input value={form.twitter} onChange={e => set("twitter", e.target.value)} placeholder="https://twitter.com/yourcompany" className="mt-1" />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <Input value={form.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="https://linkedin.com/company/..." className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="gap-2" disabled={saving}>
        <Save className="h-4 w-4" />{saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
