import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStartupDealBySlug } from "@/lib/startupDeals";
import type { StartupDeal } from "@/data/startupDeals";

const StartupDealDetail = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const [deal, setDeal] = useState<StartupDeal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!dealId) return;

    setIsLoading(true);
    getStartupDealBySlug(dealId)
      .then((result) => setDeal(result))
      .finally(() => setIsLoading(false));
  }, [dealId]);

  useEffect(() => {
    if (!deal) return;
    document.title = `${deal.title} Startup Deal | PerksNest`;
  }, [deal]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-28 rounded bg-stone-200" />
            <div className="h-14 w-2/3 rounded bg-stone-200" />
            <div className="h-32 rounded-3xl bg-stone-200" />
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="h-72 rounded-3xl bg-stone-200" />
              <div className="h-72 rounded-3xl bg-stone-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">Deal Not Found</p>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-stone-900">This startup offer isn’t available right now.</h1>
          <p className="mb-8 text-base text-stone-600">The slug didn’t match a seeded startup deal in Supabase or the static fallback list.</p>
          <Button asChild>
            <Link to="/deals">Browse deals</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),_transparent_32%),linear-gradient(180deg,#fafaf9_0%,#f5f5f4_100%)]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/deals" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition-colors hover:text-stone-900">
          <span>Browse all deals</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>

        <section className="mt-6 overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_24px_70px_-40px_rgba(28,25,23,0.45)]">
          <div className="border-b border-stone-200 bg-[linear-gradient(135deg,#111827_0%,#1f2937_52%,#92400e_100%)] px-6 py-10 text-white sm:px-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-200">Startup Deal #{deal.index}</p>
                <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{deal.title}</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-stone-200">{deal.description}</p>
              </div>
              <Badge className="w-fit border-amber-300/40 bg-white/10 px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-white/10">
                {deal.category}
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1.35fr_0.85fr]">
            <div className="space-y-6">
              <Card className="overflow-hidden rounded-[1.6rem] border-stone-200 bg-stone-50 shadow-none">
                <CardContent className="p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">Perks</p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900">What you get</h2>
                  <p className="mt-4 text-lg leading-8 text-stone-700">{deal.perks}</p>
                </CardContent>
              </Card>

              <Card className="rounded-[1.6rem] border-stone-200 shadow-none">
                <CardContent className="p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Redeem Steps</p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900">How to claim this offer</h2>
                  <div className="mt-6 space-y-4">
                    {deal.steps.map((step, index) => (
                      <div key={`${deal.slug}-${index}`} className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white">
                          {index + 1}
                        </div>
                        <p className="pt-1 text-sm leading-7 text-stone-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="rounded-[1.6rem] border-stone-200 bg-white shadow-none">
                <CardContent className="p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Claim Offer</p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900">Go to the official signup page</h2>
                  <p className="mt-4 text-sm leading-7 text-stone-600">
                    PerksNest links directly to the source page so founders can claim the exact startup program listed in the dataset.
                  </p>
                  {deal.website_url ? (
                    <Button asChild className="mt-6 h-12 w-full rounded-xl text-base font-semibold">
                      <a href={deal.website_url} target="_blank" rel="noreferrer noopener">
                        Claim Offer
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button className="mt-6 h-12 w-full rounded-xl text-base font-semibold" disabled>
                      Claim Offer
                    </Button>
                  )}
                  {deal.website_url ? (
                    <p className="mt-4 break-all text-xs leading-6 text-stone-500">{deal.website_url}</p>
                  ) : (
                    <p className="mt-4 text-xs leading-6 text-stone-500">No website URL was provided in the source dataset for this offer.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-[1.6rem] border-stone-200 bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_100%)] shadow-none">
                <CardContent className="p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">Snapshot</p>
                  <dl className="mt-4 space-y-4">
                    <div>
                      <dt className="text-xs uppercase tracking-[0.22em] text-stone-500">Category</dt>
                      <dd className="mt-1 text-sm font-semibold text-stone-900">{deal.category}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.22em] text-stone-500">Slug</dt>
                      <dd className="mt-1 break-all text-sm font-semibold text-stone-900">{deal.slug}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.22em] text-stone-500">Offer Number</dt>
                      <dd className="mt-1 text-sm font-semibold text-stone-900">{deal.index}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StartupDealDetail;
