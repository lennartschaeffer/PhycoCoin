import Link from "next/link";
import ConnectButton from "@/components/common/connect-btn";
import styles from "./styles.module.css";

export default function WalletSection() {
  return (
    <div className={styles.connectWallet}>
      {/** Logo */}

      {/** Heading */}
      <div className={styles.heading}>
        {/** Indicator */}
        <div className={styles.indicator}></div>

        {/** Text */}
        <h1 className={styles.text}>PhycoCoin Payment</h1>
      </div>

      {/** Sub heading */}
      <h2 className={styles.subheading}>
        Effortlessly transfer PhycoCoins with a single click
      </h2>

      {/** Connect button */}
      <div className={styles.btnContainer}>
        <ConnectButton />
      </div>
      
      {/** Farmer portal link */}
      <div className={styles.farmerPortal}>
        <p>Are you a seaweed farmer?</p>
        <Link href="/farmer-connect" className={styles.farmerLink}>
          Go to Farmer Portal →
        </Link>
      </div>
    </div>
  );
}
