import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DealCard from "@/components/DealCard";
import { getCollections, getDealsByCollection } from "@/data/deals";

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const collections = getCollections();
  const col = collections.find(c => c.id === id) || { id: id || "", name: id || "", description: "", icon: "📦", count: 0 };
  const deals = getDealsByCollection(id || "");

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <Link to="/collections" className="inline-flex items-center gap-1 text-primary-foreground/70 hover:text-white text-sm mb-4">
              <ArrowLeft className="h-4 w-4" /> All Collections
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <span>{col.icon}</span> {col.name}
            </h1>
            <p className="text-primary-foreground/80 mt-2 text-lg">{col.description}</p>
            <p className="text-primary-foreground/60 mt-1 text-sm">{deals.length} deals</p>
          </div>
        </section>
        <div className="max-w-6xl mx-auto px-4 py-10">
          {deals.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No deals in this collection yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deals.map(deal => <DealCard key={deal.id} {...deal} />)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CollectionDetail;
