import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { submitContactMessage, type ContactMessagePayload } from "@/lib/api";
import { useSeo } from "@/lib/seo";

type ContactFormState = ContactMessagePayload;
type ContactErrors = Partial<Record<keyof ContactFormState, string>>;

const initialFormState: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

const contactMethods = [
  {
    title: "Email support",
    description: "The fastest way to reach the team for deal, billing, or platform questions.",
    value: "info@perksnest.co",
    href: "mailto:info@perksnest.co",
    icon: Mail,
  },
  {
    title: "Call us",
    description: "For partnership or enterprise conversations during business hours.",
    value: "8100888777",
    href: "tel:8100888777",
    icon: Phone,
  },
  {
    title: "Visit HQ",
    description: "PerksNest by Stirring Minds LLC, serving founders globally from Delhi, India.",
    value: "Delhi, India",
    href: "https://maps.google.com/?q=Delhi,+India",
    icon: MapPin,
  },
];

const socialLinks = [
  { label: "X", href: "https://x.com/perksnest" },
  { label: "LinkedIn", href: "https://linkedin.com/company/perksnest", icon: Linkedin },
  { label: "Instagram", href: "https://instagram.com/perksnest", icon: Instagram },
];

const faqItems = [
  {
    question: "How quickly does the team reply?",
    answer: "Most product and support messages get a response within one business day, and partnership requests are usually routed the same day.",
  },
  {
    question: "Can I contact you about enterprise or white-label needs?",
    answer: "Yes. Use the form with a clear subject line and we will route it directly to the team handling enterprise partnerships and custom onboarding.",
  },
  {
    question: "Need immediate help with a claimed deal?",
    answer: "For active deal issues, include the deal name and the email tied to your account so we can troubleshoot faster.",
  },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const XIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.965 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

const socialIconMap: Record<string, typeof XIcon | typeof Linkedin | typeof Instagram> = {
  X: XIcon,
  LinkedIn: Linkedin,
  Instagram: Instagram,
};

function validateForm(form: ContactFormState) {
  const errors: ContactErrors = {};

  if (!form.name.trim()) errors.name = "Please enter your name.";
  if (!form.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!emailPattern.test(form.email.trim())) {
    errors.email = "Please use a valid email address.";
  }
  if (!form.subject.trim()) errors.subject = "Please add a subject.";
  if (!form.message.trim()) {
    errors.message = "Please tell us how we can help.";
  } else if (form.message.trim().length < 20) {
    errors.message = "A little more detail helps us reply faster.";
  }

  return errors;
}

const Contact = () => {
  useSeo({
    title: "Get in Touch | PerksNest",
    description: "Contact PerksNest for support, partnerships, enterprise questions, and white-label conversations.",
    path: "/contact",
  });

  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isFormDisabled = isSubmitting || hasSubmitted;
  const responseTimeLabel = useMemo(
    () => (hasSubmitted ? "Message received" : "Usually replies within one business day"),
    [hasSubmitted]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name as keyof ContactErrors]) return current;
      return { ...current, [name]: undefined };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        website: formData.website?.trim(),
      });

      if (!response?.success) {
        throw new Error(response?.error || "We couldn't send your message.");
      }

      setHasSubmitted(true);
      setFormData(initialFormState);
      setErrors({});
      toast.success("We’ll get back to you soon.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong while sending your message.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: keyof ContactErrors) =>
    `h-12 rounded-2xl border bg-white/90 px-4 transition-all duration-200 ${
      errors[field]
        ? "border-red-300 focus-visible:ring-red-200"
        : "border-[#e8d9ef] focus-visible:ring-[#caa8d1]"
    }`;

  return (
    <div className="bg-[#fbf8fd] text-slate-900">
      <section className="relative overflow-hidden border-b border-[#eadcf0] bg-[radial-gradient(circle_at_top,rgba(92,33,105,0.16),transparent_48%),linear-gradient(180deg,#ffffff_0%,#f8f2fb_100%)]">
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(90deg,rgba(92,33,105,0.08),rgba(170,118,186,0.04),rgba(92,33,105,0.08))]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center sm:py-24 lg:px-8 lg:py-28">
          <Badge className="mb-6 rounded-full bg-[#5c2169] px-4 py-1.5 text-white shadow-lg shadow-[#5c2169]/15">
            Founder-friendly support
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Questions about deals, memberships, white-label access, or partnerships? Send us a note and we’ll point you to the right team quickly.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#eadcf0] bg-white/80 px-4 py-2 shadow-sm">
              <Clock3 className="h-4 w-4 text-[#5c2169]" />
              {responseTimeLabel}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#eadcf0] bg-white/80 px-4 py-2 shadow-sm">
              <MessageSquareText className="h-4 w-4 text-[#5c2169]" />
              Product, support, and partnership inquiries
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <Card key={method.title} className="rounded-[28px] border-[#eadcf0] bg-white/95 shadow-[0_18px_60px_rgba(92,33,105,0.08)]">
                <CardHeader className="space-y-4 pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5c2169]/10 text-[#5c2169]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-950">{method.title}</CardTitle>
                    <CardDescription className="mt-2 text-sm leading-6 text-slate-600">
                      {method.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <a
                    href={method.href}
                    target={method.href.startsWith("http") ? "_blank" : undefined}
                    rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-2 font-semibold text-[#5c2169] transition-colors hover:text-[#4a1a52]"
                  >
                    {method.value}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 lg:px-8 lg:pb-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden rounded-[32px] border-[#eadcf0] bg-white shadow-[0_26px_80px_rgba(92,33,105,0.10)]">
            <CardHeader className="border-b border-[#f0e5f4] bg-[linear-gradient(180deg,rgba(248,242,251,0.95),rgba(255,255,255,0.95))] pb-6">
              <Badge variant="outline" className="w-fit rounded-full border-[#d9bfdc] bg-white text-[#5c2169]">
                Contact form
              </Badge>
              <CardTitle className="text-3xl text-slate-950">Send us a message</CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
                Share a few details and we’ll route your message to the right person. For the fastest reply, include the deal name or account email if your question is account-specific.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              {hasSubmitted ? (
                <div className="rounded-[28px] border border-emerald-200 bg-emerald-50/80 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold text-slate-950">Message sent successfully</h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
                    We’ll get back to you soon. If your request is urgent, you can also email{" "}
                    <a href="mailto:info@perksnest.co" className="font-semibold text-[#5c2169] hover:underline">
                      info@perksnest.co
                    </a>.
                  </p>
                  <Button
                    type="button"
                    onClick={() => setHasSubmitted(false)}
                    className="mt-6 rounded-full bg-[#5c2169] px-6 hover:bg-[#4a1a52]"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-semibold text-slate-800">
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={inputClass("name")}
                        disabled={isFormDisabled}
                        autoComplete="name"
                      />
                      {errors.name ? <p className="text-sm text-red-600">{errors.name}</p> : null}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-slate-800">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        className={inputClass("email")}
                        disabled={isFormDisabled}
                        autoComplete="email"
                      />
                      {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-semibold text-slate-800">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Partnership inquiry, billing question, deal support..."
                      className={inputClass("subject")}
                      disabled={isFormDisabled}
                    />
                    {errors.subject ? <p className="text-sm text-red-600">{errors.subject}</p> : null}
                  </div>

                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold text-slate-800">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us what you need help with and include any useful context."
                      className={`min-h-[180px] rounded-[24px] bg-white/90 px-4 py-3 ${
                        errors.message
                          ? "border-red-300 focus-visible:ring-red-200"
                          : "border-[#e8d9ef] focus-visible:ring-[#caa8d1]"
                      }`}
                      disabled={isFormDisabled}
                    />
                    <div className="flex items-center justify-between gap-4">
                      {errors.message ? <p className="text-sm text-red-600">{errors.message}</p> : <span className="text-sm text-slate-500">Aim for a few helpful details so we can answer in one pass.</span>}
                      <span className="shrink-0 text-xs text-slate-400">{formData.message.length}/5000</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-[#f0e5f4] pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-6 text-slate-500">
                      By submitting, you agree that we can contact you about your inquiry.
                    </p>
                    <Button
                      type="submit"
                      disabled={isFormDisabled}
                      className="h-12 rounded-full bg-[#5c2169] px-6 text-sm font-semibold shadow-lg shadow-[#5c2169]/20 transition-transform hover:scale-[1.01] hover:bg-[#4a1a52]"
                    >
                      {isSubmitting ? "Sending..." : "Send message"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[32px] border-[#eadcf0] bg-white shadow-[0_18px_60px_rgba(92,33,105,0.08)]">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-950">Connect elsewhere</CardTitle>
                <CardDescription>Prefer social or want to browse answers first?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link
                  to="/help"
                  className="flex items-center justify-between rounded-2xl border border-[#eadcf0] px-4 py-3 transition-colors hover:border-[#caa8d1] hover:bg-[#faf5fc]"
                >
                  <div>
                    <p className="font-semibold text-slate-900">Visit the Help Center</p>
                    <p className="text-sm text-slate-500">FAQs, guidance, and common support flows</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#5c2169]" />
                </Link>
                {socialLinks.map((social) => {
                  const Icon = socialIconMap[social.label];
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-2xl border border-[#eadcf0] px-4 py-3 transition-colors hover:border-[#caa8d1] hover:bg-[#faf5fc]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5c2169]/10 text-[#5c2169]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-slate-900">{social.label}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-[#5c2169]" />
                    </a>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t border-[#eadcf0] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="mb-10">
            <Badge variant="outline" className="rounded-full border-[#d9bfdc] text-[#5c2169]">
              FAQ
            </Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Before you hit send</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              These are the three questions we see most often from founders, operators, and partner teams.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {faqItems.map((item) => (
              <Card key={item.question} className="rounded-[28px] border-[#eadcf0] bg-[#fbf8fd] shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-slate-950">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-600">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
