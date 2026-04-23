import React from "react";
import {
  ArrowRight,
  BookOpen,
  CirclePlay,
  Compass,
  FileText,
  GraduationCap,
  LayoutTemplate,
  Lock,
  ShieldCheck,
  Users,
  Video,
  FlaskConical,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ComprehensiveDealDetail, Resource } from "@/data/deal-details-schema";

interface ResourcesSectionProps {
  deal: ComprehensiveDealDetail;
  isLocked?: boolean;
  isPremiumDeal?: boolean;
  unlockLabel?: string;
  onUnlock?: () => void;
}

const RESOURCE_PRIORITY: Record<string, number> = {
  "get-started": 1,
  documentation: 2,
  docs: 2,
  tutorial: 3,
  guide: 3,
  academy: 4,
  course: 4,
  video: 5,
  webinar: 5,
  template: 6,
  templates: 6,
  "hands-on lab": 7,
  community: 8,
};

const RESOURCE_META: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    iconClassName: string;
    badgeClassName: string;
  }
> = {
  "get-started": {
    icon: Compass,
    label: "Get Started",
    iconClassName: "bg-[#5c2169] text-white shadow-[0_18px_30px_-20px_rgba(92,33,105,0.75)]",
    badgeClassName: "border-[#5c2169]/15 bg-[#5c2169]/8 text-[#5c2169]",
  },
  guide: {
    icon: BookOpen,
    label: "Guide",
    iconClassName: "bg-violet-50 text-violet-700",
    badgeClassName: "border-violet-200 bg-violet-50 text-violet-700",
  },
  tutorial: {
    icon: BookOpen,
    label: "Tutorial",
    iconClassName: "bg-fuchsia-50 text-fuchsia-700",
    badgeClassName: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  },
  documentation: {
    icon: FileText,
    label: "Docs",
    iconClassName: "bg-slate-100 text-slate-700",
    badgeClassName: "border-slate-200 bg-slate-100 text-slate-700",
  },
  docs: {
    icon: FileText,
    label: "Docs",
    iconClassName: "bg-slate-100 text-slate-700",
    badgeClassName: "border-slate-200 bg-slate-100 text-slate-700",
  },
  academy: {
    icon: GraduationCap,
    label: "Academy",
    iconClassName: "bg-emerald-50 text-emerald-700",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  course: {
    icon: GraduationCap,
    label: "Course",
    iconClassName: "bg-emerald-50 text-emerald-700",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  template: {
    icon: LayoutTemplate,
    label: "Template",
    iconClassName: "bg-amber-50 text-amber-700",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
  },
  templates: {
    icon: LayoutTemplate,
    label: "Template",
    iconClassName: "bg-amber-50 text-amber-700",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
  },
  community: {
    icon: Users,
    label: "Community",
    iconClassName: "bg-cyan-50 text-cyan-700",
    badgeClassName: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  video: {
    icon: CirclePlay,
    label: "Video",
    iconClassName: "bg-rose-50 text-rose-700",
    badgeClassName: "border-rose-200 bg-rose-50 text-rose-700",
  },
  webinar: {
    icon: CirclePlay,
    label: "Video",
    iconClassName: "bg-rose-50 text-rose-700",
    badgeClassName: "border-rose-200 bg-rose-50 text-rose-700",
  },
  "hands-on lab": {
    icon: FlaskConical,
    label: "Lab",
    iconClassName: "bg-sky-50 text-sky-700",
    badgeClassName: "border-sky-200 bg-sky-50 text-sky-700",
  },
};

const getResourceMeta = (type: string) =>
  RESOURCE_META[type] || {
    icon: FileText,
    label: "Resource",
    iconClassName: "bg-slate-100 text-slate-700",
    badgeClassName: "border-slate-200 bg-slate-100 text-slate-700",
  };

const getResourceLink = (resource: Resource) => resource.link || resource.url || "";

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  deal,
  isLocked = false,
  isPremiumDeal = false,
  unlockLabel = "Unlock resources",
  onUnlock,
}) => {
  const resources = Array.isArray(deal.resources)
    ? [...deal.resources]
        .sort((left, right) => {
          const leftPriority = RESOURCE_PRIORITY[left.type] ?? 99;
          const rightPriority = RESOURCE_PRIORITY[right.type] ?? 99;
          return leftPriority - rightPriority;
        })
        .slice(0, 3)
    : [];

  return (
    <section id="resources-section" className="border-b border-gray-200 bg-[linear-gradient(180deg,#ffffff_0%,#fcf8fd_100%)] py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">Resources for this deal</h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Actionable onboarding, docs, and walkthroughs from the {deal.name} team.
            </p>
          </div>

          {isPremiumDeal && (
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                isLocked
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {isLocked ? <Lock className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
              {isLocked ? "Premium resources locked" : "Premium resources unlocked"}
            </div>
          )}
        </div>

        {resources.length > 0 ? (
          <div className="space-y-3">
            {resources.map((resource) => {
              const resourceMeta = getResourceMeta(resource.type);
              const Icon = resourceMeta.icon;
              const resourceLink = getResourceLink(resource);
              const cardClassName =
                "group relative block overflow-hidden rounded-[28px] border border-gray-200/90 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#5c2169]/30 hover:shadow-[0_24px_55px_-34px_rgba(92,33,105,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5c2169]/30";
              const content = (
                <>
                  <div className="absolute inset-y-4 left-0 w-1.5 rounded-full bg-gradient-to-b from-[#5c2169] via-[#7a2f8f] to-[#d4a0de]" />
                  <div className={`relative z-10 flex items-center gap-4 ${isLocked ? "blur-[2px] opacity-55" : ""}`}>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${resourceMeta.iconClassName}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${resourceMeta.badgeClassName}`}>
                          {resourceMeta.label}
                        </span>
                        {resource.date && <span className="text-xs font-medium text-gray-500">{resource.date}</span>}
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-[#5c2169]">
                            {resource.title}
                          </h3>
                          <p className="mt-1 line-clamp-1 text-sm text-gray-600">
                            {resource.description || `Official ${resourceMeta.label.toLowerCase()} resource for ${deal.name}.`}
                          </p>
                        </div>

                        <div className="hidden shrink-0 items-center gap-2 rounded-full border border-[#5c2169]/15 bg-[#5c2169]/5 px-3 py-2 text-sm font-semibold text-[#5c2169] transition-all duration-200 group-hover:border-[#5c2169]/30 group-hover:bg-[#5c2169] group-hover:text-white sm:inline-flex">
                          <span>{resource.ctaLabel || "Open"}</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {isLocked && (
                    <div className="absolute inset-0 z-20 flex items-center justify-between gap-3 rounded-[28px] bg-white/70 px-5 backdrop-blur-[1px]">
                      <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">
                        <Lock className="h-3.5 w-3.5" />
                        Unlock to access
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onUnlock}
                        className="h-10 rounded-xl border-[#5c2169]/20 bg-white px-4 font-semibold text-[#5c2169] hover:bg-[#f8eefb] hover:text-[#4c1b57]"
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        {unlockLabel}
                      </Button>
                    </div>
                  )}
                </>
              );

              return (
                <article key={resource.id}>
                  {isLocked || !resourceLink ? (
                    <div className={cardClassName}>{content}</div>
                  ) : (
                    <a href={resourceLink} target="_blank" rel="noreferrer noopener" className={cardClassName}>
                      {content}
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-[32px] border border-dashed border-[#5c2169]/18 bg-white/90 p-8 shadow-[0_24px_60px_-42px_rgba(92,33,105,0.28)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5c2169]/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5c2169]/8 text-[#5c2169]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="mt-5 text-lg font-semibold text-gray-900">Resources are being reviewed</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-600">
                We only publish verified docs, guides, and walkthroughs once they meet our review bar. This section will fill in once vetted resources are added for {deal.name}.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
