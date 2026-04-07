import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { getAdminSettings, saveAdminSettings } from "@/lib/store";

export const AdminSettings = () => {
  const [form, setForm] = useState({ siteName: "", siteDescription: "", contactEmail: "", supportEmail: "", twitter: "", linkedin: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load settings from API with localStorage fallback
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const session = JSON.parse(localStorage.getItem('pn_session') || '{}');
        const response = await fetch('https://api.perksnest.co/api/admin/settings', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setForm(data.settings || getAdminSettings());
        } else {
          // Fallback to localStorage
          setForm(getAdminSettings());
        }
      } catch (error) {
        console.warn('Settings API not available, using localStorage:', error);
        // Fallback to localStorage
        setForm(getAdminSettings());
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const session = JSON.parse(localStorage.getItem('pn_session') || '{}');
      
      // Try to save to API first
      const response = await fetch('https://api.perksnest.co/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        toast.success("Settings saved to server!");
      } else {
        // Fallback: save to localStorage
        saveAdminSettings(form);
        toast.success("Settings saved locally (server unavailable)");
      }
    } catch (error) {
      console.warn('API save failed, saving to localStorage:', error);
      // Fallback: save to localStorage
      saveAdminSettings(form);
      toast.success("Settings saved locally");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">
          <p>Loading settings...</p>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle>Site Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><Label>Site Name</Label><Input value={form.siteName} onChange={e => set("siteName", e.target.value)} className="mt-1" /></div>
                <div className="col-span-2"><Label>Site Description</Label><Textarea value={form.siteDescription} onChange={e => set("siteDescription", e.target.value)} className="mt-1" rows={2} /></div>
                <div><Label>Contact Email</Label><Input type="email" value={form.contactEmail} onChange={e => set("contactEmail", e.target.value)} className="mt-1" /></div>
                <div><Label>Support Email</Label><Input type="email" value={form.supportEmail} onChange={e => set("supportEmail", e.target.value)} className="mt-1" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Twitter / X</Label><Input value={form.twitter} onChange={e => set("twitter", e.target.value)} placeholder="https://twitter.com/perksnest" className="mt-1" /></div>
                <div><Label>LinkedIn</Label><Input value={form.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="https://linkedin.com/company/perksnest" className="mt-1" /></div>
              </div>
            </CardContent>
          </Card>
          <Button type="submit" className="gap-2" disabled={saving}><Save className="h-4 w-4" />{saving ? "Saving..." : "Save Settings"}</Button>
        </>
      )}
    </form>
  );
};
