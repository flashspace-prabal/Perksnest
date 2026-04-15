import { useParams } from "react-router-dom";

import ComprehensiveDealDetailPage from "@/pages/ComprehensiveDealDetail";

const DealRoute = () => {
  const { dealId } = useParams<{ dealId: string }>();

  // Use the new comprehensive deal detail page with all sections and animations
  return <ComprehensiveDealDetailPage />;
};

export default DealRoute;
