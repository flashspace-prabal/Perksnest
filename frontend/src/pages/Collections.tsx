import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import DealCard from "@/components/DealCard";
import { getCollections, getDealsByCollection } from "@/data/deals";

const Collections = () => {
  const collections = getCollections();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-1.5 rounded-full mb-4">
              <Sparkles className="h-4 w-4" /> Curated Collections
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Hand-picked deal bundles</h1>
            <p className="text-primary-foreground/80 text-lg">
              Curated stacks for every stage — from founding to scaling.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">
          {collections.map(col => {
            const deals = getDealsByCollection(col.id);
            return (
              <section key={col.id}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      <span>{col.icon}</span> {col.name}
                      <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{col.count} deals</span>
                    </h2>
                    <p className="text-muted-foreground mt-1">{col.description}</p>
                  </div>
                  <Link
                    to={`/collections/${col.id}`}
                    className="hidden sm:flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deals.slice(0, 3).map(deal => (
                    <DealCard key={deal.id} {...deal} />
                  ))}
                </div>
                <Link
                  to={`/collections/${col.id}`}
                  className="flex sm:hidden items-center gap-1 text-sm text-primary hover:underline mt-4"
                >
                  View all {col.name} deals <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Collections;
