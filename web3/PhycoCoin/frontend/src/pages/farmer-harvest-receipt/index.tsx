import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useSmartContract } from "@/hooks/useSmartContract";
import { PhycoCoin } from "@phyco-types/PhycoCoin";
import { parseEther, formatEther } from "ethers";
import FarmerHeader from "@/components/farmer-header";
import styles from "./styles.module.css";
import dynamic from "next/dynamic";

export default function FarmerHarvestReceiptPage() {
  const router = useRouter();
  const {
    walletAddress: queryWalletAddress,
    totalCoinsMinted,
    carbon_lb,
    nitrogen_lb,
    phosphorus_lb,
  } = router.query;
  const { walletAddress, walletConnectionStatus, switchNetwork, chainCurrent } =
    useWallet();
  const { getSmartContract, deployedNetworkData } = useSmartContract();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mintStatus, setMintStatus] = useState<
    "initial" | "processing" | "success" | "error"
  >("initial");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [newBalance, setNewBalance] = useState("");
  const [showConnectButton, setShowConnectButton] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState({
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    harvestId: "",
    location: "Coastal Maine Region",
  });

  // Generate a unique harvest ID
  useEffect(() => {
    const generateHarvestId = () => {
      const randomPart = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      const datePart = new Date().getTime().toString().substring(9);
      setReceiptDetails((prev) => ({
        ...prev,
        harvestId: `HRVST-${randomPart}-${datePart}`,
      }));
    };

    generateHarvestId();
  }, []);

  // Check if the connected wallet matches the wallet in the URL
  useEffect(() => {
    console.log(walletAddress, queryWalletAddress, walletConnectionStatus);
    if (
      walletConnectionStatus === "connected" &&
      walletAddress &&
      queryWalletAddress
    ) {
      if (
        walletAddress.toLowerCase() === String(queryWalletAddress).toLowerCase()
      ) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } else if (!walletAddress || walletConnectionStatus !== "connected") {
      setShowConnectButton(true);
      // If wallet is not connected, redirect to the farmer connection page
      //   if (router.isReady) {
      //     router.push('/farmer-connect');
      //   }
    }
  }, [
    walletAddress,
    queryWalletAddress,
    walletConnectionStatus,
    router,
    router.isReady,
  ]);

  const handleMintCoins = async () => {
    if (!totalCoinsMinted || !queryWalletAddress) {
      setErrorMessage(
        "Missing required parameters: wallet address or mint amount"
      );
      setMintStatus("error");
      return;
    }

    const phycoCoinContract = getSmartContract<PhycoCoin>("PHYCOCOIN");
    if (!phycoCoinContract) {
      setErrorMessage("PhycoCoin contract not found or not connected");
      setMintStatus("error");
      return;
    }

    try {
      setMintStatus("processing");

      // Ensure wallet is on the correct network
      if (switchNetwork && deployedNetworkData) {
        if (chainCurrent?.id !== deployedNetworkData.chainId) {
          await switchNetwork(deployedNetworkData.chainId);
        }
      }

      // Parse the amount to be minted
      const amount = parseEther(totalCoinsMinted as string);

      // Call the mint function
      const tx = await phycoCoinContract.mint(
        queryWalletAddress as string,
        amount
      );
      const receipt = await tx.wait();

      if (receipt) {
        setTransactionHash(receipt.hash);

        // Get updated balance
        const updatedBalance = await phycoCoinContract.balanceOf(
          queryWalletAddress as string
        );
        setNewBalance(formatEther(updatedBalance));

        setMintStatus("success");
      } else {
        throw new Error("Transaction failed to be mined");
      }
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || "An error occurred during minting");
      setMintStatus("error");
    }
  };

  const renderContent = () => {
    // if (!isAuthorized && walletAddress) {
    //   return (
    //     <div className={styles.unauthorizedContainer}>
    //       <h1>Unauthorized Access</h1>
    //       <p>
    //         The connected wallet does not match the wallet address in the URL.
    //       </p>
    //       <button
    //         className={styles.primaryButton}
    //         onClick={() =>
    //           router.push(`/farmer?walletAddress=${walletAddress}`)
    //         }
    //       >
    //         Go to your Dashboard
    //       </button>
    //     </div>
    //   );
    // }

    if (mintStatus === "initial") {
      return (
        <div className={styles.confirmationContainer}>
          <h2>Harvest Verification Complete</h2>
          <div className={styles.confirmationDetails}>
            <p>
              Your seaweed harvest has been verified and is eligible for
              PhycoCoin minting!
            </p>
            <div className={styles.detailsCard}>
              <div className={styles.detailRow}>
                <span>Wallet Address:</span>
                <span>
                  {String(queryWalletAddress).slice(0, 6)}...
                  {String(queryWalletAddress).slice(-4)}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span>PhycoCoins to Mint:</span>
                <span className={styles.highlightValue}>
                  {totalCoinsMinted} PHYC
                </span>
              </div>
            </div>
          </div>
          <button
            className={styles.mintButton}
            onClick={handleMintCoins}
            disabled={mintStatus === ("processing" as any)}
          >
            Receive PhycoCoins
          </button>
          <p className={styles.note}>
            By minting, you confirm that this harvest was conducted sustainably
            and the data provided is accurate.
          </p>
        </div>
      );
    }

    if (mintStatus === "processing") {
      return (
        <div className={styles.processingContainer}>
          <div className={styles.spinner}></div>
          <h2>Processing Your PhycoCoins</h2>
          <p>Please wait while we mint your coins to your wallet...</p>
          <p>Do not close this page.</p>
        </div>
      );
    }

    if (mintStatus === "success") {
      return (
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>✅</div>
          <h2>Minting Successful!</h2>
          <div className={styles.receiptCard}>
            <h3>Harvest Receipt</h3>
            <div className={styles.receiptHeader}>
              <div>
                <p className={styles.receiptTitle}>
                  PhycoCoin Official Receipt
                </p>
                <p className={styles.receiptId}>
                  ID: {receiptDetails.harvestId}
                </p>
              </div>
              <div className={styles.receiptDate}>
                <p>Date: {receiptDetails.date}</p>
                <p>Time: {receiptDetails.time}</p>
              </div>
            </div>
            <div className={styles.receiptDivider}></div>
            <div className={styles.receiptBody}>
              <div className={styles.receiptRow}>
                <span>Wallet Address:</span>
                <span>
                  {String(queryWalletAddress).slice(0, 6)}...
                  {String(queryWalletAddress).slice(-4)}
                </span>
              </div>
              <div className={styles.receiptRow}>
                <span>Minted Amount:</span>
                <span>{totalCoinsMinted} PHYC</span>
              </div>
              <div className={styles.receiptRow}>
                <span>Transaction Hash:</span>
                <span className={styles.hash}>
                  {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
                </span>
              </div>
              <div className={styles.receiptRow}>
                <span>New Balance:</span>
                <span className={styles.highlightValue}>{newBalance} PHYC</span>
              </div>
              <div className={styles.receiptDivider}></div>
              <div className={styles.environmentalImpactSection}>
                <h4>Environmental Impact</h4>
                <div className={styles.impactGrid}>
                  <div className={styles.impactItem}>
                    <span>Carbon Removed</span>
                    <span>{carbon_lb} lb</span>
                  </div>
                  <div className={styles.impactItem}>
                    <span>Nitrogen Removed</span>
                    <span>{nitrogen_lb} lb</span>
                  </div>
                  <div className={styles.impactItem}>
                    <span>Phosphorus Removed</span>
                    <span>{phosphorus_lb} lb</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.receiptFooter}>
              <p>Thank you for contributing to a cleaner ocean ecosystem!</p>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={styles.primaryButton}
              onClick={() =>
                router.push(`/farmer?walletAddress=${queryWalletAddress}`)
              }
            >
              Return to Dashboard
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => window.print()}
            >
              Print Receipt
            </button>
          </div>
        </div>
      );
    }

    if (mintStatus === "error") {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Minting Failed</h2>
          <p className={styles.errorMessage}>{errorMessage}</p>
          <p>Please try again or contact support if the problem persists.</p>
          <button
            className={styles.retryButton}
            onClick={() => setMintStatus("initial")}
          >
            Try Again
          </button>
          <button
            className={styles.secondaryButton}
            onClick={() =>
              router.push(`/farmer?walletAddress=${queryWalletAddress}`)
            }
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.receiptPageContainer}>
      <FarmerHeader />
      {isAuthorized && (
        <main className={styles.mainContent}>
          <h1 style={{ color: "black", marginBottom: 10 }}>
            Receive Your PhycoCoins
          </h1>
          {renderContent()}
        </main>
      )}

      {/* <main className={styles.mainContent}>{renderContent()}</main> */}
    </div>
  );
}
