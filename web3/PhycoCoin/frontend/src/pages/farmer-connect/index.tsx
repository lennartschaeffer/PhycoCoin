import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import styles from "./styles.module.css";

export default function FarmerConnectPage() {
  const router = useRouter();
  const {
    walletAddress,
    walletConnectionStatus,
    showConnectDialog,
    chainCurrent,
  } = useWallet();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleConnectWallet = async () => {
    showConnectDialog();
  };

  return (
    <div className={styles.connectPageContainer}>
      <div className={styles.contentBox}>
        <h1>PhycoCoin Farmer Portal</h1>

        {walletConnectionStatus !== "connected" && (
          <>
            <p>
              Connect your wallet to access your dashboard, record harvests, and
              view your PhycoCoin earnings from nutrient trading credits.
            </p>
            <button
              className={styles.connectButton}
              onClick={handleConnectWallet}
              disabled={
                walletConnectionStatus === "connecting" || isRedirecting
              }
            >
              Connect Your Wallet
            </button>
            <div className={styles.infoSection}>
              <h2>Why connect your wallet?</h2>
              <ul>
                <li>Record and verify your seaweed harvests</li>
                <li>Earn PhycoCoins based on nutrient removal</li>
                <li>Track your environmental impact</li>
                <li>Participate in the nutrient credit marketplace</li>
              </ul>
            </div>
          </>
        )}

        {walletConnectionStatus === "connected" && walletAddress && (
          <div className={styles.walletInfo}>
            <p>
              Farmer Connected: {walletAddress.slice(0, 6)}...
              {walletAddress.slice(-4)}
            </p>
            <button
              className={styles.connectButton}
              onClick={() =>
                router.push(
                  `http://localhost:3001/farmer?walletAddress=${walletAddress}`
                )
              }
            >
              Proceed to Farmer Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
