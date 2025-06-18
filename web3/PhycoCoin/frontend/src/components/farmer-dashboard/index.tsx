import { useEffect, useState } from "react";
import { useSmartContract } from "@/hooks/useSmartContract";
import { PhycoCoin } from "@phyco-types/PhycoCoin";
import { formatEther } from "ethers";
import styles from "./styles.module.css";

interface FarmerDashboardProps {
  walletAddress: string;
}

interface FarmerStats {
  balance: string;
  harvests: number;
  environmentalImpact: {
    carbon: string;
    nitrogen: string;
    phosphorus: string;
  };
}

export default function FarmerDashboard({
  walletAddress,
}: FarmerDashboardProps) {
  const { getSmartContract } = useSmartContract();
  const [stats, setStats] = useState<FarmerStats>({
    balance: "0",
    harvests: 0,
    environmentalImpact: {
      carbon: "0",
      nitrogen: "0",
      phosphorus: "0",
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFarmerStats = async () => {
      if (!walletAddress) return;

      try {
        setIsLoading(true);
        const phycoCoinContract = getSmartContract<PhycoCoin>("PHYCOCOIN");

        if (phycoCoinContract) {
          // Get wallet balance
          const balance = await phycoCoinContract.balanceOf(walletAddress);

          // Fetch all the farmer's harvests and environmental impact
          // This is a placeholder - you would need to implement this logic based on your contract
          // For now, we'll use dummy data

          setStats({
            balance: formatEther(balance),
            harvests: 5, // Dummy data
            environmentalImpact: {
              carbon: "125.5",
              nitrogen: "9.8",
              phosphorus: "1.2",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching farmer stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmerStats();
  }, [walletAddress, getSmartContract]);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.overviewCards}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>💰</div>
          <div className={styles.cardContent}>
            <h3>PhycoCoin Balance</h3>
            <p className={styles.value}>
              {parseFloat(stats.balance).toFixed(2)} PHYC
            </p>
            <p className={styles.subtext}>
              Current Value: ${(parseFloat(stats.balance) * 1.0).toFixed(2)} USD
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>🌱</div>
          <div className={styles.cardContent}>
            <h3>Total Harvests</h3>
            <p className={styles.value}>{stats.harvests}</p>
            <p className={styles.subtext}>Verified seaweed harvests</p>
          </div>
        </div>
      </div>

      <div className={styles.environmentalImpact}>
        <h2>Your Environmental Impact</h2>
        <div className={styles.impactMetrics}>
          <div className={styles.metric}>
            <h4>Carbon Removed</h4>
            <p>{stats.environmentalImpact.carbon} lbs</p>
          </div>
          <div className={styles.metric}>
            <h4>Nitrogen Removed</h4>
            <p>{stats.environmentalImpact.nitrogen} lbs</p>
          </div>
          <div className={styles.metric}>
            <h4>Phosphorus Removed</h4>
            <p>{stats.environmentalImpact.phosphorus} lbs</p>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <h2>Actions</h2>
        <div className={styles.actionButtons}>
          <button
            className={styles.actionButton}
            onClick={() =>
              (window.location.href = `/farmer-harvest-receipt?walletAddress=${walletAddress}&totalCoinsMinted=10.0`)
            }
          >
            Record New Harvest
          </button>
          <button className={styles.actionButton}>Trade PhycoCoins</button>
          <button className={styles.actionButton}>View Certificates</button>
        </div>
      </div>
    </div>
  );
}
