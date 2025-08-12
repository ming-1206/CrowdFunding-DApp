import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type MyCampaignCardProps = {
  contractAddress: string;
};

export const MyCampaignCard: React.FC<MyCampaignCardProps> = ({
  contractAddress,
}) => {
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: contractAddress,
  });

  // Get Campaign Name
  const { data: name } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });

  // Get Campaign Description
  const { data: description } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

  return (
    <div className="flex flex-col justify-between max-w-sm p-6 rounded-xl bg-black/60 backdrop-blur-lg border border-purple-500/40 shadow-[0_0_15px_rgba(167,38,169,0.3)] hover:shadow-[0_0_25px_rgba(167,38,169,0.6)] transition-all duration-300">
      <div>
        {/* Campaign Name */}
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          {name}
        </h5>

        {/* Campaign Description */}
        <p className="mb-3 font-normal text-purple-200 opacity-80">
          {description}
        </p>
      </div>

      {/* View Campaign Button */}
      <Link href={`/campaign/${contractAddress}`} passHref={true}>
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
