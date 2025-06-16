import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import styles from './styles.module.css';
import FarmerDashboard from '@/components/farmer-dashboard';
import FarmerHeader from '@/components/farmer-header';

export default function FarmerPage() {
  const router = useRouter();
  const { walletAddress, walletConnectionStatus } = useWallet();
  const { walletAddress: queryWalletAddress } = router.query;
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Verify that the connected wallet matches the wallet in the URL
    if (walletConnectionStatus === 'connected' && walletAddress && queryWalletAddress) {
      // Case insensitive comparison of wallet addresses
      if (walletAddress.toLowerCase() === String(queryWalletAddress).toLowerCase()) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } else if (!walletAddress || walletConnectionStatus !== 'connected') {
      // If wallet is not connected, redirect to the farmer connection page
      router.push('/farmer-connect');
    }
  }, [walletAddress, queryWalletAddress, walletConnectionStatus, router]);

  if (!isAuthorized && walletAddress) {
    return (
      <div className={styles.unauthorizedContainer}>
        <h1>Unauthorized Access</h1>
        <p>The connected wallet does not match the wallet address in the URL.</p>
        <button 
          className={styles.connectButton}
          onClick={() => router.push(`/farmer?walletAddress=${walletAddress}`)}
        >
          Go to your Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={styles.farmerPageContainer}>
      <FarmerHeader />
      <main className={styles.mainContent}>
        <h1>Seaweed Farmer Dashboard</h1>
        <p>Welcome, Farmer! Your wallet: {walletAddress}</p>
        
        <FarmerDashboard walletAddress={walletAddress || ''} />
      </main>
    </div>
  );
}
