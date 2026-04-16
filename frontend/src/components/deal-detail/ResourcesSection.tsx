import React, { useState } from "react";
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

interface ResourceImageProps {
  src?: string;
  alt: string;
  type: string;
}

const ResourceImage: React.FC<ResourceImageProps> = ({ src, alt, type }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="w-32 h-24 rounded-lg flex-shrink-0 overflow-hidden bg-purple-900">
      {src && !imageError ? (
        <img
          src={src}
          alt=""
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-purple-900 flex items-center justify-center">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
            {type === 'video' ? <Video className="w-6 h-6 text-white" /> : <FileText className="w-6 h-6 text-white" />}
          </div>
        </div>
      )}
    </div>
  );
};

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ deal }) => {
  return (
    <section id="resources-section" className="py-20 bg-slate-900 border-b border-slate-700\">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Relevant Resources
          </h2>
          <p className="text-lg text-slate-300">
            Helpful articles, guides, and resources to get the most out of{" "}
            {deal.name}
          </p>
        </div>

        {deal.resources && deal.resources.length > 0 ? (
          <div className="space-y-6">
            {deal.resources.map((resource) => {
              return (
                <a
                  key={resource.id}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-6 p-6 bg-slate-800 rounded-lg border border-slate-700 hover:border-purple-500 hover:bg-slate-700 transition group"
                >
                  {/* Image with fallback handling */}
                  <ResourceImage src={resource.image} alt={resource.title} type={resource.type} />

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="space-y-2">
                        <h3 className="font-bold text-white text-lg group-hover:text-purple-400 transition">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-slate-400 capitalize">
                          {resource.type}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition flex-shrink-0" />
                    </div>

                    <p className="text-slate-300 mb-3">{resource.description}</p>

                    {resource.date && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
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
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <p className="text-slate-300">No resources available yet</p>
          </div>
        )}
      </div>
    </section>
  );
};
