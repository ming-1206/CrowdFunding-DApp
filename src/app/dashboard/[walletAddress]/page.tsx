"use client";
import { client } from "@/app/client";
import { CROWDFUNDING_FACTORY } from "@/app/constants/contracts";
import { MyCampaignCard } from "../../../components/MyCampaignCard";
import { useState } from "react";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { deployPublishedContract } from "thirdweb/deploys";
import { useActiveAccount, useReadContract } from "thirdweb/react";

export default function DashboardPage() {
  const account = useActiveAccount();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: CROWDFUNDING_FACTORY,
  });

  const {
    data: myCampaigns,
    isLoading: isLoadingMyCampaigns,
    refetch,
  } = useReadContract({
    contract: contract,
    method:
      "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: [account?.address as string],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between items-center mb-8">
        <p className="text-4xl font-bold text-purple-300 drop-shadow-[0_0_8px_#a726a9]">
          Dashboard
        </p>
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-[0_0_10px_#a726a9] hover:bg-purple-500 transition-all duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          Create Campaign
        </button>
      </div>
      <p className="text-2xl font-semibold mb-4 text-purple-200">
        My Campaigns:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {!isLoadingMyCampaigns &&
          (myCampaigns && myCampaigns.length > 0 ? (
            myCampaigns.map((campaign, index) => (
              <MyCampaignCard
                key={index}
                contractAddress={campaign.campaignAddress}
              />
            ))
          ) : (
            <p className="text-purple-400 italic">No campaigns yet.</p>
          ))}
      </div>

      {isModalOpen && (
        <CreateCampaignModal
          setIsModalOpen={setIsModalOpen}
          refetch={refetch}
        />
      )}
    </div>
  );
}

type CreateCampaignModalProps = {
  setIsModalOpen: (value: boolean) => void;
  refetch: () => void;
};

const CreateCampaignModal = ({
  setIsModalOpen,
  refetch,
}: CreateCampaignModalProps) => {
  const account = useActiveAccount();
  const [isDeployingContract, setIsDeployingContract] =
    useState<boolean>(false);
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setCampaignDescription] = useState<string>("");
  const [campaignGoal, setCampaignGoal] = useState<number>(1);
  const [campaignDeadline, setCampaignDeadline] = useState<number>(1);

  const handleDeployContract = async () => {
    setIsDeployingContract(true);
    try {
      const contractAddress = await deployPublishedContract({
        client: client,
        chain: baseSepolia,
        account: account!,
        contractId: "Crowdfunding",
        contractParams: {
          campaignName,
          campaignDescription,
          campaignGoal,
          campaignDeadline,
        },
        publisher: "0x855eaE827799E1C7ADf6ef457007718E7C7508c6",
        version: "1.0.0",
      });
      alert("Contract deployed successfully!");
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeployingContract(false);
      setIsModalOpen(false);
    }
  };

  const handleCampaignGoal = (value: number) =>
    setCampaignGoal(Math.max(1, value));
  const handleCampaignLengthChange = (value: number) =>
    setCampaignDeadline(Math.max(1, value));

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center backdrop-blur-md z-50">
      <div className="w-full max-w-lg bg-slate-900 border border-purple-500/50 rounded-xl shadow-[0_0_20px_#a726a9] p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-bold text-purple-300">Create a Campaign</p>
          <button
            className="text-sm px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-all"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col space-y-4">
          <label className="text-purple-200">Campaign Name:</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="Campaign Name"
            className="px-4 py-2 bg-black/40 text-white border border-purple-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <label className="text-purple-200">Campaign Description:</label>
          <textarea
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
            placeholder="Campaign Description"
            className="px-4 py-2 bg-black/40 text-white border border-purple-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          ></textarea>
          <label className="text-purple-200">Campaign Goal:</label>
          <input
            type="number"
            value={campaignGoal}
            onChange={(e) => handleCampaignGoal(parseInt(e.target.value))}
            className="px-4 py-2 bg-black/40 text-white border border-purple-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <label className="text-purple-200">Campaign Length (Days):</label>
          <input
            type="number"
            value={campaignDeadline}
            onChange={(e) =>
              handleCampaignLengthChange(parseInt(e.target.value))
            }
            className="px-4 py-2 bg-black/40 text-white border border-purple-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md shadow-[0_0_10px_#a726a9] hover:bg-purple-500 transition-all duration-300"
            onClick={handleDeployContract}
          >
            {isDeployingContract ? "Creating Campaign..." : "Create Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
};
