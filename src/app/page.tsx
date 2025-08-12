"use client";
import { useReadContract } from "thirdweb/react";
import { client } from "./client";
import { baseSepolia } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { CampaignCard } from "../components/CampaignCard";
import { CROWDFUNDING_FACTORY } from "@/app/constants/contracts";

export default function Home() {
  // Get CrowdfundingFactory contract
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: CROWDFUNDING_FACTORY,
  });

  // Get all campaigns deployed with CrowdfundingFactory
  const { data: campaigns, isLoading: isLoadingCampaigns } = useReadContract({
    contract: contract,
    method:
      "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name)[])",
    params: [],
  });

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8 text-purple-200">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_12px_#a726a9]">
          Campaigns
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!isLoadingCampaigns && campaigns && campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <div
                key={campaign.campaignAddress}
                className="p-4 rounded-xl bg-black/60 backdrop-blur-lg border border-purple-500/40 shadow-[0_0_15px_rgba(167,38,169,0.3)] hover:shadow-[0_0_25px_rgba(167,38,169,0.6)] transition-all duration-300"
              >
                <CampaignCard campaignAddress={campaign.campaignAddress} />
              </div>
            ))
          ) : !isLoadingCampaigns ? (
            <p className="text-purple-300 italic">No Campaigns found.</p>
          ) : (
            <p className="text-purple-300">Loading campaigns...</p>
          )}
        </div>
      </div>
    </main>
  );
}
