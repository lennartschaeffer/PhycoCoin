import Link from "next/link";
import { useRouter } from "next/router";
import { useWallet } from "@/hooks/useWallet";
import styles from "./styles.module.css";

export default function FarmerHeader() {
  const {
    walletAddress,
    walletConnectionStatus,
    disconnectWallet,
    showConnectDialog,
  } = useWallet();
  const router = useRouter();

  const handleDisconnect = () => {
    disconnectWallet();
    router.push("/farmer-connect");
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logo}>
            <span>PhycoCoin</span>
          </Link>
        </div>

        <div className={styles.rightSection}>
          {walletConnectionStatus === "connected" && walletAddress ? (
            <div className={styles.walletInfo}>
              <span className={styles.walletAddress}>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <button
                onClick={handleDisconnect}
                className={styles.disconnectButton}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => showConnectDialog()}
              className={styles.connectButton}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
