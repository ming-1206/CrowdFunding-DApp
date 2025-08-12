"use client";
import { client } from "@/app/client";
import { TierCard } from "@/components/TierCard";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getContract, prepareContractCall, ThirdwebContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import {
  darkTheme,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";

export default function CampaignPage() {
  const account = useActiveAccount();
  const { campaignAddress } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: campaignAddress as string,
  });

  const { data: name, isLoading: isLoadingName } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: description } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

  const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
    contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  });
  const deadlineDate = new Date(parseInt(deadline?.toString() || "0") * 1000);
  const hasDeadlinePassed = deadlineDate < new Date();

  const { data: goal } = useReadContract({
    contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  const { data: balance } = useReadContract({
    contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  const totalBalance = parseInt(balance?.toString() || "0");
  const totalGoal = parseInt(goal?.toString() || "1");
  let balancePercentage = (totalBalance / totalGoal) * 100;
  if (balancePercentage >= 100) balancePercentage = 100;

  const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
    contract,
    method:
      "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
    params: [],
  });

  const { data: owner } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  const { data: status } = useReadContract({
    contract,
    method: "function state() view returns (uint8)",
    params: [],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 mt-6 text-purple-200">
      <div className="flex flex-row justify-between items-center border-b border-purple-500/40 pb-4">
        {!isLoadingName && (
          <p className="text-4xl font-bold drop-shadow-[0_0_6px_#a726a9]">
            {name}
          </p>
        )}
        {owner === account?.address && (
          <div className="flex flex-row gap-2">
            {isEditing && (
              <p className="px-4 py-2 bg-purple-800/40 border border-purple-500/50 rounded-md text-purple-200 shadow-[0_0_8px_#a726a9]">
                Status:{" "}
                {status === 0
                  ? "Active"
                  : status === 1
                  ? "Successful"
                  : status === 2
                  ? "Failed"
                  : "Unknown"}
              </p>
            )}
            <button
              className="px-4 py-2 bg-purple-700 hover:bg-purple-600 border border-purple-500 rounded-md text-white shadow-[0_0_8px_#a726a9] transition-all"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Done" : "Edit"}
            </button>
          </div>
        )}
      </div>

      <div className="my-6">
        <p className="text-lg font-semibold text-purple-300">Description:</p>
        <p className="text-purple-200">{description}</p>
      </div>

      <div className="mb-6">
        <p className="text-lg font-semibold text-purple-300">Deadline</p>
        {!isLoadingDeadline && (
          <p className={hasDeadlinePassed ? "text-red-400" : ""}>
            {deadlineDate.toDateString()}
          </p>
        )}
      </div>

      <div className="mb-6">
        <p className="text-lg font-semibold text-purple-300">
          Campaign Goal: ${goal?.toString()}
        </p>
        <div className="relative w-full h-6 bg-purple-900/40 border border-purple-500/50 rounded-full">
          <div
            className="h-6 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full text-right shadow-[0_0_8px_#a726a9]"
            style={{ width: `${balancePercentage}%` }}
          >
            <p className="text-white text-xs p-1">${balance?.toString()}</p>
          </div>
          <p className="absolute top-0 right-0 text-purple-200 text-xs p-1">
            {balancePercentage >= 100 ? "" : `${balancePercentage.toFixed(1)}%`}
          </p>
        </div>
      </div>

      <div>
        <p className="text-lg font-semibold text-purple-300">Tiers:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {isLoadingTiers ? (
            <p>Loading...</p>
          ) : tiers && tiers.length > 0 ? (
            tiers.map((tier, index) => (
              <TierCard
                key={index}
                tier={tier}
                index={index}
                contract={contract}
                isEditing={isEditing}
              />
            ))
          ) : (
            !isEditing && <p>No tiers available</p>
          )}
          {isEditing && (
            <button
              className="flex flex-col justify-center items-center font-semibold p-6 bg-purple-800/40 border border-purple-500/50 rounded-lg shadow-[0_0_8px_#a726a9] text-purple-200 hover:bg-purple-700/50 transition-all"
              onClick={() => setIsModalOpen(true)}
            >
              + Add Tier
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <CreateTierModal setIsModalOpen={setIsModalOpen} contract={contract} />
      )}
    </div>
  );
}

type CreateTierModalProps = {
  setIsModalOpen: (value: boolean) => void;
  contract: ThirdwebContract;
};

const CreateTierModal = ({
  setIsModalOpen,
  contract,
}: CreateTierModalProps) => {
  const [tierName, setTierName] = useState("");
  const [tierAmount, setTierAmount] = useState<bigint>(1n);

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center backdrop-blur-md z-50">
      <div className="w-full max-w-lg bg-purple-900/90 border border-purple-500/50 p-6 rounded-lg shadow-[0_0_12px_#a726a9] text-purple-200">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-bold text-purple-300">
            Create a Funding Tier
          </p>
          <button
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-md text-white shadow-[0_0_8px_#a726a9] transition-all"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-purple-300">Tier Name:</label>
          <input
            type="text"
            value={tierName}
            onChange={(e) => setTierName(e.target.value)}
            placeholder="Tier Name"
            className="mb-4 px-4 py-2 bg-purple-800/50 border border-purple-500/50 rounded-md text-purple-200 placeholder-purple-400 focus:outline-none focus:border-pink-500"
          />
          <label className="mb-1 text-purple-300">Tier Cost:</label>
          <input
            type="number"
            value={parseInt(tierAmount.toString())}
            onChange={(e) => setTierAmount(BigInt(e.target.value))}
            className="mb-4 px-4 py-2 bg-purple-800/50 border border-purple-500/50 rounded-md text-purple-200 placeholder-purple-400 focus:outline-none focus:border-pink-500"
          />
          <TransactionButton
            transaction={() =>
              prepareContractCall({
                contract: contract,
                method: "function addTier(string _name, uint256 _amount)",
                params: [tierName, tierAmount],
              })
            }
            onTransactionConfirmed={() => {
              alert("Tier added successfully!");
              setIsModalOpen(false);
            }}
            onError={(error) => alert(`Error: ${error.message}`)}
            theme={darkTheme({
              colors: {
                primaryButtonBg: "#a726a9",
                primaryButtonText: "#fff",
              },
            })}
          >
            Add Tier
          </TransactionButton>
        </div>
      </div>
    </div>
  );
};
