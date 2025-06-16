import { useState, useEffect } from "react";
import React from "react";
import styles from "./styles.module.css";
import { useSmartContract } from "@/hooks/useSmartContract";
import { useWallet } from "@/hooks/useWallet";
import { PhycoCoin } from "@phyco-types/PhycoCoin";
import {
  parseEther,
  formatEther,
  parseUnits,
  formatUnits,
  Contract,
  ethers,
} from "ethers";
import { useRouter } from "next/router";

export default function PhycoCoinBuySection() {
  const { getSmartContract, deployedNetworkData } = useSmartContract();
  const {
    walletConnectionStatus,
    switchNetwork,
    chainCurrent,
    walletAddress,
    disconnectWallet,
  } = useWallet();
  const router = useRouter();
  const { walletAddress: receiverWalletAddress, buyAmount } = router.query;
  const [recipientAddress, setRecipientAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [balance, setBalance] = useState("0");
  const [ethBalance, setEthBalance] = useState("0");
  const [transactions, setTransactions] = useState<any[]>([]);

  // Fetch user's balances when wallet is connected
  useEffect(() => {
    const fetchBalances = async () => {
      if (walletConnectionStatus === "connected" && walletAddress) {
        // Fetch PhycoCoin balance
        const phycoCoinContract = getSmartContract<PhycoCoin>("PHYCOCOIN");
        if (phycoCoinContract) {
          try {
            const userBalance = await phycoCoinContract.balanceOf(
              walletAddress
            );
            setBalance(formatEther(userBalance));
          } catch (err) {
            console.error("Error fetching PhycoCoin balance:", err);
          }
        }

        // Fetch ETH balance
        try {
          if (!window.ethereum) return;

          const provider = new ethers.BrowserProvider(window.ethereum as any);
          const ethUserBalance = await provider.getBalance(walletAddress);

          // Format ETH balance
          setEthBalance(formatEther(ethUserBalance));
        } catch (err) {
          console.error("Error fetching ETH balance:", err);
        }
      }
    };

    fetchBalances();
  }, [walletConnectionStatus, walletAddress, getSmartContract]);

  const handleDisconnect = () => {
    disconnectWallet();
  };

  // Swap ETH for PhycoCoins function
  const swapETHForPhycoCoins = async () => {
    console.log("swapETHForPhycoCoins");
    setError("");
    setSuccess("");

    if (!receiverWalletAddress) {
      setError("Please enter a farmer's wallet address.");
      return;
    }

    if (!buyAmount || parseFloat(buyAmount as string) <= 0) {
      setError("Please enter a valid amount of PhycoCoins to receive.");
      return;
    }

    const phycoCoinContract = getSmartContract<PhycoCoin>("PHYCOCOIN");
    if (!phycoCoinContract) {
      setError("PhycoCoin contract not found or not connected.");
      return;
    }

    try {
      setIsProcessing(true);

      // Ensure wallet is connected and on the correct network
      if (
        walletConnectionStatus === "connected" &&
        switchNetwork &&
        deployedNetworkData
      ) {
        if (chainCurrent?.id !== deployedNetworkData.chainId) {
          await switchNetwork(deployedNetworkData.chainId);
        }

        if (!walletAddress) {
          setError("Wallet address not found.");
          return;
        }

        // Check farmer's PhycoCoin balance
        const farmerPhycoCoinBalance = await phycoCoinContract.balanceOf(
          receiverWalletAddress as string
        );
        const phycoCoinAmount = parseEther(buyAmount as string);

        if (farmerPhycoCoinBalance < phycoCoinAmount) {
          setError(
            `Farmer doesn't have enough PhycoCoins. Their balance: ${formatEther(
              farmerPhycoCoinBalance
            )} PHYC`
          );
          return;
        }

        // Get ETH amount needed (this calculates it on the frontend, but actual price will be determined by the contract)
        const phycoCoinPrice = await phycoCoinContract.phycoCoinPrice();
        const ethAmount =
          (BigInt(phycoCoinAmount.toString()) *
            BigInt(phycoCoinPrice.toString())) /
          BigInt(10 ** 18);

        // Check ETH balance
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const userEthBalance = await provider.getBalance(walletAddress);

        if (userEthBalance < ethAmount) {
          setError(
            `Insufficient ETH balance. You need ${formatEther(ethAmount)} ETH`
          );
          return;
        }

        const tx = await phycoCoinContract.swapETHForPhycoCoins(
          receiverWalletAddress as string,
          phycoCoinAmount,
          { value: ethAmount }
        );
        const receipt = await tx.wait();

        if (receipt) {
          // Update balances
          const newPhycoCoinBalance = await phycoCoinContract.balanceOf(
            walletAddress
          );
          setBalance(formatEther(newPhycoCoinBalance));

          const newEthBalance = await provider.getBalance(walletAddress);
          setEthBalance(formatEther(newEthBalance));

          // Add to transaction history
          setTransactions((prev) => [
            {
              hash: receipt.hash,
              type: "swap",
              farmerId: receiverWalletAddress,
              amount: buyAmount,
              ethAmount: formatEther(ethAmount),
              timestamp: new Date().toLocaleString(),
            },
            ...prev,
          ]);

          setSuccess(
            `Successfully swapped ${formatEther(
              ethAmount
            )} ETH for ${buyAmount} PHYC from farmer ${receiverWalletAddress.slice(
              0,
              6
            )}...${receiverWalletAddress.slice(-4)} (Tx: ${receipt.hash.slice(
              0,
              6
            )}...${receipt.hash.slice(-4)})`
          );

          // Clear inputs
        } else {
          throw new Error("Transaction failed to be mined.");
        }
      } else {
        throw new Error("Wallet not connected or network not ready.");
      }
    } catch (e: any) {
      console.error(e);
      setError("Failed to swap ETH for PhycoCoins: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className={styles.mintSection}>
        <div className={styles.mintSectionInner}>
          <div className={styles.swapSection}>
            <h4>Buy PhycoCoins with ETH</h4>
            <div className={styles.inputGroup}>
              <label>Farmer Wallet Address</label>
              <input
                type="text"
                className={styles.farmerInput}
                placeholder="Authorized Farmer Address"
                value={receiverWalletAddress}
                disabled={true}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>PhycoCoin Amount to Buy</label>
              <input
                type="text"
                className={styles.amountInput}
                placeholder="Amount of PhycoCoins"
                disabled={true}
                value={buyAmount as string}
              />
            </div>
            <button
              className={styles.btn}
              disabled={
                !receiverWalletAddress ||
                !buyAmount ||
                isProcessing ||
                walletConnectionStatus !== "connected"
              }
              onClick={swapETHForPhycoCoins}
            >
              <strong>Buy PhycoCoins</strong>
            </button>
            <p className={styles.rateInfo}>Rate: 1 PHYC = 0.001 ETH</p>
          </div>

          {error && <pre className={styles.error}>{error}</pre>}
          {success && <pre className={styles.success}>{success}</pre>}

          <div className={styles.balanceSection}>
            <h4>Your Balances</h4>
            <div className={styles.balanceGrid}>
              <div className={styles.balanceItem}>
                <span className={styles.balanceLabel}>PhycoCoin:</span>
                <span className={styles.balanceAmount}>
                  {Number(balance).toFixed(2)} PHYC
                </span>
              </div>
              <div className={styles.balanceItem}>
                <span className={styles.balanceLabel}>ETH:</span>
                <span className={styles.balanceAmount}>
                  {Number(ethBalance).toFixed(4)} ETH
                </span>
              </div>
            </div>
          </div>

          <div className={styles.transactionsSection}>
            <h4>Transaction History</h4>
            {transactions.length === 0 ? (
              <p>No transactions found.</p>
            ) : (
              <ul>
                {transactions.map((tx, index) => (
                  <li key={index} className={styles.transactionItem}>
                    <a
                      href={`https://explorer.phyco.finance/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tx.type === "swap" ? (
                        <>
                          Tx: {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)} -
                          Bought {tx.amount} PHYC for {tx.ethAmount || "?"} ETH
                          from farmer {tx.farmerId.slice(0, 6)}...
                          {tx.farmerId.slice(-4)} on {tx.timestamp}
                        </>
                      ) : (
                        <>
                          Tx: {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)} - Sent{" "}
                          {tx.amount} PHYC to {tx.recipient} on {tx.timestamp}
                        </>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className={styles.disconnectButtonContainer}>
          <button className={styles.btn} onClick={handleDisconnect}>
            Disconnect Wallet
          </button>
        </div>
      </div>
    </>
  );
}
