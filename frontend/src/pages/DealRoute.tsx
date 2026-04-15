import { useParams } from "react-router-dom";

import StartupDealDetail from "@/pages/StartupDealDetail";

const DealRoute = () => {
  const { dealId } = useParams<{ dealId: string }>();

  // Use the StartupDealDetail layout for all deals, as requested
  return <StartupDealDetail />;
};

export default DealRoute;
