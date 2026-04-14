import { useParams } from "react-router-dom";

import DealDetail from "@/pages/DealDetail";
import StartupDealDetail from "@/pages/StartupDealDetail";
import { isStartupDealSlug } from "@/lib/startupDeals";

const DealRoute = () => {
  const { dealId } = useParams<{ dealId: string }>();

  if (dealId && isStartupDealSlug(dealId)) {
    return <StartupDealDetail />;
  }

  return <DealDetail />;
};

export default DealRoute;
