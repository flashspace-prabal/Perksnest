import { useState, useEffect } from "react";
import { Search, Info, HelpCircle, ArrowRight, MessageCircle, Mail, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-white">

      <main className="container-wide py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Help Center</h1>
          <p className="text-muted-foreground text-lg">
            Get help with your PerksNest account and deals
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Ticketing System Coming Soon!
              </h2>
              <p className="text-muted-foreground mb-6">
                We're building a comprehensive support ticket system to better serve you.
                In the meantime, you can reach us via email.
              </p>
              {/* TODO: Backend API needed - POST /api/tickets - Create support ticket */}
              {/* TODO: Backend API needed - GET /api/tickets/:userId - Fetch user's tickets */}
              {/* TODO: Backend API needed - PUT /api/tickets/:id - Update ticket status/reply */}
            </CardContent>
          </Card>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Get help from our support team via email
              </p>
              <Button
                className="w-full"
                onClick={() => window.location.href = 'mailto:info@perksnest.co?subject=Support Request'}
              >
                Email Us
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with us in real-time (coming soon)
              </p>
              <Button variant="outline" className="w-full" disabled>
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Browse our help articles and guides
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/docs'}
              >
                View Docs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section Placeholder */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                question: "How do I claim a deal?",
                answer: "Browse deals, click 'Get Deal', and follow the redemption instructions."
              },
              {
                question: "What's the difference between Free and Premium?",
                answer: "Free gives you access to 300+ deals. Premium unlocks all 500+ deals for $20/year."
              },
              {
                question: "How do I cancel my subscription?",
                answer: "Go to Settings in your dashboard and click 'Cancel Subscription'."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

    </div>
  );
};

export default HelpCenter;
