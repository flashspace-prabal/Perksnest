const fs = require('fs');
const path = 'src/pages/portal/CustomerPortal.tsx';
let c = fs.readFileSync(path, 'utf8');

// 1. Fix Imports
if (!c.includes('Sparkles')) {
    c = c.replace('MessageSquare, Send', 'MessageSquare, Send, X, Sparkles, Award, CheckCircle');
}

// 2. Fix the unclosed Link tag for tickets mapping
// Check for the specific pattern we created that was broken
const brokenTicketBlockRegex = /<Link to=\{\`\/customer\/tickets\/\$\{ticket\.id\}\`\}\s*key=\{ticket\.id\}\s*className=\"block p-4 bg-muted\/50 rounded-lg hover:bg-border transition-colors group\">([\s\S]*?)<p className=\"text-sm text-muted-foreground\">\{ticket\.message\}<\/p>\s*<\/div>/g;

c = c.replace(brokenTicketBlockRegex, (match, inner) => {
    return `<Link to={\`/customer/tickets/\${ticket.id}\`} key={ticket.id} className="block p-4 bg-muted/50 rounded-lg hover:bg-border transition-colors group">
                          ${inner}<p className="text-sm text-muted-foreground line-clamp-2">{ticket.message}</p>
                        </Link>`;
});

// 3. Update Pricing
c = c.replace(/Upgrade to Premium — \$2\/mo/g, 'Upgrade to Premium — $20/mo');

// 4. Upgrade Billing UI (The entire Billing tab content)
// Let's find the billing tab content and replace it with something more beautiful
const billingTabRegex = /<TabsContent value=\"billing\">[\s\S]*?<\/TabsContent>/;
const newBillingTab = `
          <TabsContent value="billing" className="space-y-6">
            <div className="grid gap-6">
              {/* Premium Hero Card */}
              <Card className="overflow-hidden border-2 border-primary/10 shadow-xl">
                <div className="bg-gradient-to-br from-[#5c2169] to-[#3d1645] p-8 text-white relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Award className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 mb-4 px-3 py-1">
                      {user.plan === 'premium' ? 'Current Plan: Premium' : 'Limited Access: Free'}
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2">
                       {user.plan === 'premium' ? 'You are a PerksNest Pro' : 'Unlock Everything'}
                    </h2>
                    <p className="text-purple-100 max-w-md mb-8">
                      {user.plan === 'premium' 
                        ? 'Enjoy unlimited access to all 563+ exclusive SaaS deals and priority founder support.' 
                        : 'Get access to our full database of 563+ curated perks and save thousands on your tech stack.'}
                    </p>
                    
                    {user.plan !== 'premium' && (
                      <Button 
                        size="lg"
                        className="bg-white text-[#5c2169] hover:bg-gray-100 font-bold px-8 shadow-2xl hover:scale-105 transition-all"
                        onClick={async () => {
                          try {
                            const res = await fetch(\`\${API_BASE_URL}/api/checkout\`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ userId: user.id, email: user.email, name: user.name, period: 'annual' }),
                            });
                            const data = await res.json();
                            if (data.url) window.location.href = data.url;
                            else toast.error('Could not start checkout');
                          } catch { toast.error('Checkout unavailable'); }
                        }}
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Upgrade to Premium — $20/mo
                      </Button>
                    )}
                  </div>
                </div>
                {user.plan === 'premium' && (
                   <CardContent className="bg-white py-4 flex justify-between items-center px-8 border-t">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Next billing date: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}
                      </div>
                      <Button variant="ghost" size="sm" onClick={async () => {
                         try {
                            const res = await fetch(\`\${API_BASE_URL}/api/billing/portal\`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ userId: user.id, email: user.email }),
                            });
                            const data = await res.json();
                            if (data.url) window.location.href = data.url;
                            else toast.error('Could not open billing portal');
                          } catch { toast.error('Billing portal unavailable'); }
                      }}>
                        Manage Subscription
                      </Button>
                   </CardContent>
                )}
              </Card>

              {/* Perks Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Member Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { text: 'All 563+ deals unlocked', included: true },
                      { text: 'New premium deals weekly', included: true },
                      { text: 'Priority founder support', included: user.plan === 'premium' },
                      { text: 'Private Slack community', included: user.plan === 'premium' },
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {benefit.included ? (
                          <div className="bg-green-100 p-1 rounded-full"><CheckCircle className="h-4 w-4 text-green-600" /></div>
                        ) : (
                          <div className="bg-gray-100 p-1 rounded-full"><Clock className="h-4 w-4 text-gray-400" /></div>
                        )}
                        <span className={\`text-sm \${benefit.included ? 'text-foreground' : 'text-muted-foreground'}\`}>{benefit.text}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Account Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={user.plan === 'premium' ? 'default' : 'secondary'} className={user.plan === 'premium' ? 'bg-green-500 hover:bg-green-600' : ''}>
                        {user.plan === 'premium' ? 'Active' : 'Free Tier'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-sm text-muted-foreground">Member Since</span>
                      <span className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                       <span className="text-sm text-muted-foreground">Billing Period</span>
                       <span className="text-sm font-medium">Monthly</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
`;

c = c.replace(billingTabRegex, newBillingTab);

fs.writeFileSync(path, c);
console.log('Successfully fixed CustomerPortal side-effects and upgraded Billing UI');
