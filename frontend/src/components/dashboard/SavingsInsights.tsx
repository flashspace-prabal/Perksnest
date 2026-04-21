import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { TrendingUp, DollarSign, Gift, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClaimedDeal {
  id: string;
  vendor: string;
  claimedDate: string;
  savings: number;
}

interface SavingsInsightsProps {
  deals: ClaimedDeal[];
}

const SavingsInsights: React.FC<SavingsInsightsProps> = ({ deals }) => {
  // Calculate total savings
  const totalSavings = useMemo(() => 
    deals.reduce((acc, deal) => acc + deal.savings, 0), 
  [deals]);

  // Prepare chart data (cumulative savings over time)
  const chartData = useMemo(() => {
    if (deals.length === 0) return [];

    // Sort deals by date
    const sortedDeals = [...deals].sort(
      (a, b) => new Date(a.claimedDate).getTime() - new Date(b.claimedDate).getTime()
    );

    let cumulative = 0;
    const data = sortedDeals.map((deal) => {
      cumulative += deal.savings;
      return {
        date: new Date(deal.claimedDate).toLocaleDateString(undefined, { 
          month: 'short', 
          day: 'numeric' 
        }),
        savings: cumulative,
        dealName: deal.vendor
      };
    });

    // Add a starting point if there's only one deal
    if (data.length === 1) {
      return [
        { date: "Start", savings: 0, dealName: "None" },
        ...data
      ];
    }

    return data;
  }, [deals]);

  if (deals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200"
      >
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-8 w-8 text-primary" />
        </div>
        <p className="text-lg font-medium text-gray-900">No savings yet — start claiming deals 🚀</p>
        <p className="text-gray-500 max-w-xs mx-auto mt-2">
          Claim deals to see your revenue saved grow over time.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 mt-8"
    >
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-gray-900">Savings Insights</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Savings Card */}
        <Card className="md:col-span-1 overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary/10 to-purple-500/10">
          <CardContent className="p-8 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign className="h-24 w-24 text-primary" />
            </div>
            <div className="relative z-10">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-1">
                Total Savings
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-900">$</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-5xl font-black text-gray-900"
                >
                  <AnimatedCounter value={totalSavings} />
                </motion.span>
              </div>
              <p className="text-gray-600 mt-4 flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                Across {deals.length} deals claimed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Savings Graph */}
        <Card className="md:col-span-2 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Revenue Saved Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5c2169" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#5c2169" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 12 }}
                    tickFormatter={(value) => `$${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ stroke: '#5c2169', strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="savings"
                    stroke="#5c2169"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSavings)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

// Helper component for count-up animation
const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000; // 2 seconds
    const increment = end / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-lg">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black text-primary">
          ${payload[0].value.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Last deal: <span className="font-semibold text-gray-700">{payload[0].payload.dealName}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Sub-component for individual deal savings
export const DealSavingsIndicator = ({ savings }: { savings: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-xs font-bold"
    >
      <div className="bg-emerald-500 rounded-full p-0.5">
        <ChevronUp className="h-2.5 w-2.5 text-white" />
      </div>
      <span>You saved <AnimatedCounter value={savings} /> from this deal</span>
    </motion.div>
  );
};

export default SavingsInsights;
