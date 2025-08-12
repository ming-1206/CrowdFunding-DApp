import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-black/60 backdrop-blur-lg border-t border-purple-500/40 shadow-[0_-0_15px_rgba(167,38,169,0.3)]">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-purple-200">
        {/* Brand & Description */}
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Ming Campaigns
          </h2>
          <p className="mt-2 text-sm opacity-80">
            Empowering creators and communities through transparent blockchain
            campaigns.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-pink-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="hover:text-pink-400 transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/campaigns"
                className="hover:text-pink-400 transition-colors"
              >
                Campaigns
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect</h3>
          <ul className="space-y-2 text-sm">
            <li>
              Email:{" "}
              <a
                href="mailto:jackyngziming12@gmail.com"
                className="hover:text-pink-400"
              >
                jackyngziming12@gmail.com
              </a>
            </li>
            <li>
              Twitter:{" "}
              <a
                href="https://x.com/minggz_02"
                target="_blank"
                className="hover:text-pink-400"
              >
                @minggz_02
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a
                href="https://github.com/ming-1206"
                target="_blank"
                className="hover:text-pink-400"
              >
                GitHub Repo
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-500/30 mt-8 py-4 text-center text-xs text-purple-300 opacity-70">
        © {new Date().getFullYear()} Ming Campaigns. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
