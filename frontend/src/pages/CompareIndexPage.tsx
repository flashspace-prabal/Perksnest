import Breadcrumbs from "@/components/shared/Breadcrumbs";
import AlternativesGrid from "@/components/comparison/AlternativesGrid";
import { comparisonData } from "@/data/comparisonPages";

const CompareIndexPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(92,33,105,0.10),_transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8f5fa_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />

        <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-[#eadcf0] bg-white px-6 py-12 shadow-[0_30px_90px_rgba(92,33,105,0.12)] sm:px-8 lg:px-10">
          <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_18%_0%,rgba(92,33,105,0.16),transparent_30%),linear-gradient(135deg,rgba(92,33,105,0.08),rgba(245,158,11,0.08))]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5c2169]">Comparison Pages</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Choose the right tool with less guesswork</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
              Compare startup software side by side with deal values, practical tradeoffs, founder reviews, and clear “choose this if” guidance.
            </p>
          </div>
          <p className="relative mt-8 inline-flex rounded-full border border-[#eadcf0] bg-[#fbf7fd] px-4 py-2 text-sm font-semibold text-[#5c2169]">
            Premium head-to-head guides built for faster buying decisions
          </p>
        </section>

        <section className="mt-8">
          <AlternativesGrid items={comparisonData} />
        </section>
      </div>
    </div>
  );
};

export default CompareIndexPage;
