import { Link } from "react-router-dom";

import { comparisonData } from "@/data/comparisonPages";
import { dealsData } from "@/data/deals";

const CompareToolsSection = () => {
  // Get all deal IDs for validation
  const dealIds = new Set(dealsData.map(d => d.id));

  // Filter comparisons to only include deals that exist in our 69 deals
  const validComparisons = comparisonData.filter(comparison => {
    const toolAId = comparison.toolA.href
      .replace("/deals/", "")
      .replace("-startup", "")
      .toLowerCase();
    const toolBId = comparison.toolB.href
      .replace("/deals/", "")
      .replace("-startup", "")
      .toLowerCase();
    
    return dealIds.has(toolAId) && dealIds.has(toolBId);
  });

  return (
    <section className="py-16 bg-primary/90">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
            Compare tools to make the right choice
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-3xl">
            Explore side-by-side comparisons of tools with live deals in PerksNest. {validComparisons.length} comparisons available.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {validComparisons.map((comparison) => {
            // Convert tool names to deal IDs
            const toolAId = comparison.toolA.href
              .replace("/deals/", "")
              .replace("-startup", "")
              .toLowerCase();
            const toolBId = comparison.toolB.href
              .replace("/deals/", "")
              .replace("-startup", "")
              .toLowerCase();
            
            return (
            <Link
              key={comparison.slug}
              to={`/compare/${toolAId}/vs/${toolBId}`}
              className="flex items-center gap-4 p-4 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all duration-200 hover:border-primary-foreground/30"
            >
              {/* Tool logos */}
              <div className="flex items-center -space-x-2">
                <div className="w-10 h-10 rounded-lg bg-white p-1.5 flex items-center justify-center border border-border/20">
                  <img 
                    src={comparison.toolA.logo} 
                    alt={comparison.toolA.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${comparison.toolA.name.charAt(0)}&background=random`;
                    }}
                  />
                </div>
                <div className="w-10 h-10 rounded-lg bg-white p-1.5 flex items-center justify-center border border-border/20">
                  <img 
                    src={comparison.toolB.logo} 
                    alt={comparison.toolB.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${comparison.toolB.name.charAt(0)}&background=random`;
                    }}
                  />
                </div>
              </div>

              {/* Comparison title */}
              <span className="text-primary-foreground font-medium text-sm">
                {comparison.toolA.name} vs {comparison.toolB.name}
              </span>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CompareToolsSection;
