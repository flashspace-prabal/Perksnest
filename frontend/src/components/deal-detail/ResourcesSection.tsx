import React from "react";
import { Calendar, ArrowRight, BookOpen, Video, FileText } from "lucide-react";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";

interface ResourcesSectionProps {
  deal: ComprehensiveDealDetail;
}

const RESOURCE_ICONS = {
  blog: BookOpen,
  guide: FileText,
  webinar: Video,
  template: FileText,
  video: Video,
};

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ deal }) => {
  return (
    <section id="resources-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Relevant Resources
          </h2>
          <p className="text-lg text-slate-600">
            Helpful articles, guides, and resources to get the most out of{" "}
            {deal.name}
          </p>
        </div>

        {deal.resources && deal.resources.length > 0 ? (
          <div className="space-y-6">
            {deal.resources.map((resource) => {
              const IconComponent = RESOURCE_ICONS[resource.type];

              return (
                <a
                  key={resource.id}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-6 p-6 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition group"
                >
                  {/* Image or Icon */}
                  {resource.image ? (
                    <img
                      src={resource.image}
                      alt={resource.title}
                      className="w-32 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-32 h-24 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      {IconComponent && (
                        <IconComponent className="w-8 h-8 text-blue-600" />
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="space-y-2">
                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-slate-500 capitalize">
                          {resource.type}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition flex-shrink-0" />
                    </div>

                    <p className="text-slate-600 mb-3">{resource.description}</p>

                    {resource.date && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {resource.date}
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
            <p className="text-slate-600">No resources available yet</p>
          </div>
        )}
      </div>
    </section>
  );
};
