"use client";
import { client } from "@/app/client";
import Link from "next/link";
import { ConnectButton, darkTheme, useActiveAccount } from "thirdweb/react";
import Image from "next/image";
import mingIcon from "@public/m_logo(neonblue).png";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const account = useActiveAccount();
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ${
      pathname === path
        ? "text-purple-300 font-bold shadow-[0_0_10px_#a726a9]" // Active
        : "text-purple-400 hover:text-purple-200"
    }`;

  return (
    <nav className="bg-black/80 backdrop-blur-lg border-b border-purple-500/40 shadow-lg">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Image
                src={mingIcon}
                alt="logo"
                width={50}
                height={50}
                className="rounded-md p-1 bg-black" // padding + background so it stands out
                style={{
                  border: "2px solid #a726a9", // neon purple border
                  boxShadow: "0 0 10px #a726a9, 0 0 20px #a726a9", // outer glow
                  borderRadius: "8px",
                }}
              />
            </div>
            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex items-center text-xl mt-2 space-x-4">
                <Link href="/" className={linkClasses("/")}>
                  Campaigns
                </Link>
                {account && (
                  <Link
                    href={`/dashboard/${account?.address}`}
                    className={linkClasses(`/dashboard/${account?.address}`)}
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Connect Button */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <ConnectButton
              client={client}
              theme={darkTheme({
                colors: {
                  primaryButtonBg: "#a726a9",
                  primaryButtonText: "#ffffff", // Main button text color
                },
              })}
              connectButton={{
                style: {
                  color: "#fff", // Text color when not connected
                  fontWeight: "600",
                },
              }}
              detailsButton={{
                style: {
                  maxHeight: "50px",
                  borderRadius: "10px",
                  backgroundColor: "#a726a9",
                  color: "#fff", // Text color after connecting
                  fontWeight: "600",
                  boxShadow: "0px 0px 12px rgba(167, 38, 169, 0.6)",
                },
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
