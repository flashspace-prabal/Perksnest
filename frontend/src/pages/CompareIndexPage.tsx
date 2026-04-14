import Breadcrumbs from "@/components/shared/Breadcrumbs";
import AlternativesGrid from "@/components/comparison/AlternativesGrid";
import { comparisonData } from "@/data/comparisonPages";

const CompareIndexPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),_transparent_24%),linear-gradient(180deg,#fafaf9_0%,#ffffff_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />

        <section className="mt-6 rounded-[2rem] border border-stone-200 bg-white px-6 py-10 shadow-[0_28px_80px_-48px_rgba(28,25,23,0.4)] sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Comparison Pages</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">Choose the right tool with less guesswork</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-stone-700">
            Explore SaaS-style head-to-head pages covering strengths, tradeoffs, feature ratings, verdicts, and alternative comparisons.
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
