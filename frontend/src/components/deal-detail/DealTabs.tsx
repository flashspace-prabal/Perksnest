import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface SectionTab {
  id: string;
  label: string;
  sectionId: string;
}

interface DealTabsProps {
  tabs: SectionTab[];
  className?: string;
}

export const DealTabs: React.FC<DealTabsProps> = ({ tabs, className }) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || "");
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateUnderline = () => {
      if (activeTabRef.current && tabsContainerRef.current) {
        const activeTabRect = activeTabRef.current.getBoundingClientRect();
        const containerRect = tabsContainerRef.current.getBoundingClientRect();

        setUnderlineStyle({
          left: activeTabRect.left - containerRect.left,
          width: activeTabRect.width,
        });
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = "";

      for (const tab of tabs) {
        const element = document.getElementById(tab.sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            currentSection = tab.id;
          }
        }
      }

      if (currentSection) {
        setActiveTab(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tabs]);

  const handleTabClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={cn(
        "sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={tabsContainerRef}
          className="flex overflow-x-auto scrollbar-hide relative"
        >
          {/* Animated Underline */}
          <div
            className="absolute bottom-0 h-1 bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300 ease-out"
            style={{
              left: `${underlineStyle.left}px`,
              width: `${underlineStyle.width}px`,
            }}
          />

          {tabs.map((tab, index) => (
            <button
              ref={activeTab === tab.id ? activeTabRef : null}
              key={tab.id}
              onClick={() => handleTabClick(tab.sectionId)}
              className={cn(
                "px-4 py-3 font-medium text-sm whitespace-nowrap transition-all duration-200 relative",
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
