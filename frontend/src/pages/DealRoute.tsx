import { useParams } from "react-router-dom";

import DealDetail from "@/pages/DealDetail";

const DealRoute = () => {
  const { dealId } = useParams<{ dealId: string }>();

  // Use the unified DealDetail layout for all deals (merged system)
  return <DealDetail />;
};

export default DealRoute;
