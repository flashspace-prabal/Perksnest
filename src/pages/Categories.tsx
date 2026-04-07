import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllCategories } from "./Category";
import { ArrowRight } from "lucide-react";

const Categories = () => {
  useEffect(() => {
    document.title = "All Categories | PerksNest";
  }, []);

  const categories = getAllCategories();
  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Browse by Category</h1>
            <p className="text-primary-foreground/80 text-lg">Find the right tools for every part of your stack.</p>
          </div>
        </section>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</h2>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{cat.description}</p>
                <p className="text-xs text-primary font-medium mt-3">{cat.count} deal{cat.count !== 1 ? "s" : ""}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Categories;
