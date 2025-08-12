import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type CampaignCardProps = {
  campaignAddress: string;
};

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaignAddress,
}) => {
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: campaignAddress,
  });

  // Get Campaign Name
  const { data: campaignName } = useReadContract({
    contract: contract,
    method: "function name() view returns (string)",
    params: [],
  });

  // Get Campaign Description
  const { data: campaignDescription } = useReadContract({
    contract: contract,
    method: "function description() view returns (string)",
    params: [],
  });

  // Goal amount of the campaign
  const { data: goal, isLoading: isLoadingGoal } = useReadContract({
    contract: contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  // Total funded balance of the campaign
  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    contract: contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  // Calculate the total funded balance percentage
  const totalBalance = balance?.toString();
  const totalGoal = goal?.toString();
  let balancePercentage =
    (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

  if (balancePercentage >= 100) {
    balancePercentage = 100;
  }

  return (
    <div className="flex flex-col justify-between max-w-sm p-6 rounded-xl bg-black/60 backdrop-blur-lg border border-purple-500/40 shadow-[0_0_15px_rgba(167,38,169,0.3)] hover:shadow-[0_0_25px_rgba(167,38,169,0.6)] transition-all duration-300">
      <div>
        {/* Progress Bar */}
        {!isLoadingBalance && (
          <div className="mb-4">
            <div className="relative w-full h-6 bg-gray-800 rounded-full overflow-hidden">
              {/* Filled gradient */}
              <div
                className="absolute top-0 left-0 h-6 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${balancePercentage?.toString()}%` }}
              ></div>

              {/* Text labels (above the fill) */}
              <div className="relative z-10 flex justify-between items-center px-2 h-full text-xs font-medium">
                <span className="text-white">${balance?.toString()}</span>
                <span className="text-purple-200">
                  {balancePercentage?.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Campaign Name */}
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          {campaignName}
        </h5>

        {/* Campaign Description */}
        <p className="mb-3 font-normal text-purple-200 opacity-80">
          {campaignDescription}
        </p>
      </div>

      {/* View Campaign Button */}
      <Link href={`/campaign/${campaignAddress}`} passHref={true}>
        <p className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 hover:shadow-[0_0_15px_rgba(167,38,169,0.8)] focus:ring-2 focus:outline-none focus:ring-purple-400 transition-all duration-300">
          View Campaign
          <svg
            className="w-3.5 h-3.5 ml-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </p>
      </Link>
    </div>
  );
};
