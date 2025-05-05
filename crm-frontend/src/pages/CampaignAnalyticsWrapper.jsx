import { useParams } from "react-router-dom";
import CampaignAnalytics from "./CampaignAnalytics";

const CampaignAnalyticsWrapper = () => {
  const { campaignId } = useParams();
  return <CampaignAnalytics campaignId={campaignId} />;
};

export default CampaignAnalyticsWrapper;
