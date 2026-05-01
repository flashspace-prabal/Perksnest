import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Download, Home, ReceiptText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";

type InvoiceDetails = {
  invoiceId: string;
  orderId: string;
  paymentId: string;
  issuedAt: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  billingPeriod: string;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: string;
};

const createFallbackInvoice = (name?: string, email?: string): InvoiceDetails => {
  const issuedAt = new Date();

  return {
    invoiceId: `PN-${issuedAt.getFullYear()}-${String(issuedAt.getTime()).slice(-6)}`,
    orderId: `PN-${issuedAt.getTime()}`,
    paymentId: "payment_confirmed",
    issuedAt: issuedAt.toISOString(),
    customerName: name || "PerksNest Member",
    customerEmail: email || "",
    planName: "PerksNest Premium Membership",
    billingPeriod: "1 year",
    paymentMethod: "Confirmed payment",
    subtotal: 20,
    tax: 0,
    total: 20,
    currency: "USD",
    status: "Paid",
  };
};

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

const PaymentConfirmation = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Payment Confirmed | PerksNest";
  }, []);

  const invoice = useMemo(() => {
    try {
      const rawInvoice = sessionStorage.getItem("perksnest_last_invoice");
      if (rawInvoice) return JSON.parse(rawInvoice) as InvoiceDetails;
    } catch {
      // Fall back to a display-only invoice if browser storage is unavailable.
    }

    return createFallbackInvoice(user?.name, user?.email);
  }, [user?.email, user?.name]);

  const issuedAt = new Date(invoice.issuedAt);
  const nextRenewal = new Date(issuedAt);
  nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);

  const invoiceRows = [
    { label: "Invoice number", value: invoice.invoiceId },
    { label: "Order ID", value: invoice.orderId },
    { label: "Payment ID", value: invoice.paymentId },
    { label: "Payment method", value: invoice.paymentMethod },
    { label: "Invoice date", value: issuedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b bg-white">
        <div className="container-wide px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <CheckCircle2 className="h-7 w-7" />
                  </span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {invoice.status}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-950 md:text-5xl">
                  You're subscribed to PerksNest Premium.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
                  Your membership is active. Premium deals, priority support, and member-only savings are unlocked for this account.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <Link to="/">
                  <Button size="lg" className="w-full gap-2 sm:w-auto md:w-full">
                    <Home className="h-4 w-4" />
                    Back to home
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto md:w-full" onClick={() => window.print()}>
                  <Download className="h-4 w-4" />
                  Print invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide px-6 py-10">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_360px]">
          <Card className="overflow-hidden border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <div className="flex flex-col gap-5 border-b bg-white p-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-950">
                    <ReceiptText className="h-5 w-5 text-primary" />
                    PerksNest
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Premium membership invoice</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm font-semibold text-gray-950">Invoice</p>
                  <p className="mt-1 text-sm text-gray-500">{invoice.invoiceId}</p>
                </div>
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Billed to</p>
                  <p className="mt-2 font-semibold text-gray-950">{invoice.customerName}</p>
                  {invoice.customerEmail && <p className="mt-1 text-sm text-gray-600">{invoice.customerEmail}</p>}
                </div>
                <div className="md:text-right">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Membership</p>
                  <p className="mt-2 font-semibold text-gray-950">Active through {nextRenewal.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                  <p className="mt-1 text-sm text-gray-600">Annual Premium access</p>
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="grid grid-cols-[minmax(0,1fr)_56px_92px] bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:grid-cols-[minmax(0,1fr)_90px_120px]">
                    <span>Description</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Amount</span>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_56px_92px] px-4 py-5 text-sm sm:grid-cols-[minmax(0,1fr)_90px_120px]">
                    <div>
                      <p className="font-semibold text-gray-950">{invoice.planName}</p>
                      <p className="mt-1 text-gray-500">{invoice.billingPeriod} access to premium deals and member benefits</p>
                    </div>
                    <span className="text-right text-gray-700">1</span>
                    <span className="text-right font-medium text-gray-950">{formatMoney(invoice.subtotal, invoice.currency)}</span>
                  </div>
                </div>

                <div className="ml-auto mt-6 max-w-sm space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatMoney(invoice.subtotal, invoice.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatMoney(invoice.tax, invoice.currency)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-lg font-bold text-gray-950">
                    <span>Total paid</span>
                    <span>{formatMoney(invoice.total, invoice.currency)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-700" />
                  <h2 className="font-semibold text-gray-950">Payment details</h2>
                </div>
                <div className="space-y-4">
                  {invoiceRows.map((row) => (
                    <div key={row.label} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{row.label}</p>
                      <p className="mt-1 break-words text-sm font-medium text-gray-950">{row.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5 shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-semibold text-gray-950">What's unlocked</h2>
                <ul className="mt-4 space-y-3 text-sm text-gray-700">
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-green-700" /> Access to all premium deals</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-green-700" /> New premium deals every week</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-green-700" /> Priority support for deal redemption</li>
                </ul>
                <Link to="/deals" className="mt-5 block">
                  <Button variant="outline" className="w-full">
                    Explore premium deals
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentConfirmation;
