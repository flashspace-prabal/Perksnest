import { useState } from "react";
import { 
  Settings, User, Building, Globe, Bell, Shield, CreditCard, 
  Camera, Save, Key, Mail, Phone, MapPin, Link2, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PartnerSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [newClaimAlerts, setNewClaimAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage your partner account and preferences</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="bg-background border">
          <TabsTrigger value="company" className="gap-2">
            <Building className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <User className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Company Tab */}
        <TabsContent value="company">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>This information will be displayed publicly on your deal listings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center text-4xl">
                    📝
                  </div>
                  <div>
                    <Button variant="outline" className="mb-2">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Logo
                    </Button>
                    <p className="text-sm text-muted-foreground">JPG, PNG or SVG. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="Notion Labs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://notion.so" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      rows={4}
                      defaultValue="Notion is the connected workspace where better, faster work happens. It's a workspace that combines notes, docs, wikis, and project management."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Primary Category</Label>
                    <Select defaultValue="productivity">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="productivity">Productivity</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded Year</Label>
                    <Input id="founded" defaultValue="2016" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Twitter</Label>
                    <Input placeholder="https://twitter.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input placeholder="https://linkedin.com/company/..." />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage who has access to your partner portal</CardDescription>
              </div>
              <Button>
                <User className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Ivan Zhao", email: "ivan@notion.so", role: "Owner", avatar: "IZ" },
                  { name: "Simon Last", email: "simon@notion.so", role: "Admin", avatar: "SL" },
                  { name: "Camille Ricketts", email: "camille@notion.so", role: "Member", avatar: "CR" },
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={member.role === "Owner" ? "default" : "secondary"}>{member.role}</Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Performance Reports</p>
                  <p className="text-sm text-muted-foreground">Get a summary of your deal performance every Monday</p>
                </div>
                <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Claim Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when someone claims your deal</p>
                </div>
                <Switch checked={newClaimAlerts} onCheckedChange={setNewClaimAlerts} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-muted-foreground">Receive tips and promotional content</p>
                </div>
                <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" />
                  </div>
                  <div />
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" />
                  </div>
                </div>
                <Button className="mt-4">Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">2FA is not enabled</p>
                      <p className="text-sm text-muted-foreground">Secure your account with two-factor authentication</p>
                    </div>
                  </div>
                  <Button>Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage API keys for integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Production Key</p>
                      <code className="text-sm text-muted-foreground">pk_live_****************************</code>
                    </div>
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground">Premium Partner</Badge>
                    </div>
                    <p className="text-2xl font-bold mt-2">20% Commission Rate</p>
                    <p className="text-muted-foreground">Priority support, featured listings, analytics dashboard</p>
                  </div>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4532</p>
                      <p className="text-sm text-muted-foreground">Expires 12/26</p>
                    </div>
                  </div>
                  <Button variant="outline">Update</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
