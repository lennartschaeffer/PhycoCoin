import { useState, useEffect } from "react";
import React from "react";
import styles from "./styles.module.css";
import { useSmartContract } from "@/hooks/useSmartContract";
import { useWallet } from "@/hooks/useWallet";
import { PhycoCoin } from "@phyco-types/PhycoCoin";
import { parseEther, formatEther } from "ethers";
import { useSearchParams } from "next/navigation";

export default function PhycoCoinMintSection() {
  const { getSmartContract, deployedNetworkData } = useSmartContract();
  const { walletConnectionStatus, switchNetwork, chainCurrent, walletAddress } =
    useWallet();
  const searchParams = useSearchParams();
  const mintAmount = searchParams.get("total");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState<any[]>([]);

  // Fetch user's balance when wallet is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (walletConnectionStatus === "connected" && walletAddress) {
        const phycoCoinContract = getSmartContract<PhycoCoin>("PHYCOCOIN");
        if (phycoCoinContract) {
          try {
            const userBalance = await phycoCoinContract.balanceOf(
              walletAddress
            );
            setBalance(formatEther(userBalance));
          } catch (err) {
            console.error("Error fetching balance:", err);
          }
        }
      }
    };

    fetchBalance();
  }, [walletConnectionStatus, walletAddress, getSmartContract]);

  // Legacy mint function (kept for reference/admin use)
  const onMint = async () => {
    console.log("onMint");
    setError("");
    const phycoCoinContract = getSmartContract<PhycoCoin>("PHYCOCOIN"); // Use getSmartContract
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

        // Check if the connected address is the owner (assuming owner is set on deploy)
        const ownerAddress = await phycoCoinContract.owner();
        if (walletAddress?.toLowerCase() !== ownerAddress.toLowerCase()) {
          setError("Only the contract owner can mint PhycoCoins.");
          return;
        }

        if (!mintAmount) {
          setError("Mint amount is not specified.");
          return;
        }

        const amount = parseEther(mintAmount);

        // Call the mint function using ethers.js directly
        const tx = await phycoCoinContract.mint(walletAddress, amount);
        const receipt = await tx.wait();

        if (receipt) {
          const newBalance = await phycoCoinContract.balanceOf(walletAddress);
          console.log(
            `New balance of ${walletAddress}: ${newBalance.toString()} PHYC`
          );
          console.log(
            "Minting transaction successful! Transaction Hash:",
            receipt.hash
          );

          alert(
            `Successfully sent ${mintAmount} PHYC to ${walletAddress} (Tx: ${receipt.hash.slice(
              0,
              6
            )}...${receipt.hash.slice(-4)})`
          );
        } else {
          throw new Error("Transaction failed to be mined.");
        }
      } else {
        throw new Error("Wallet not connected or network not ready.");
      }
    } catch (e: any) {
      console.error(e);
      if (e.message.includes("Only owner can mint")) {
        setError("Minting failed: Only the contract owner can mint.");
      } else {
        setError("Failed to mint PhycoCoins: " + e.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // New transfer function
  const onTransfer = async () => {
    console.log("onTransfer");
    setError("");
    setSuccess("");

    if (!recipientAddress) {
      setError("Please enter a recipient address.");
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

        if (!mintAmount) {
          setError("Transfer amount is not specified.");
          return;
        }

        const amount = parseEther(mintAmount);

        // Check user balance
        if (!walletAddress) {
          setError("Wallet address not found.");
          return;
        }

        const userBalance = await phycoCoinContract.balanceOf(walletAddress);
        const userBalanceBigInt = BigInt(userBalance.toString());
        const amountBigInt = BigInt(amount.toString());

        if (userBalanceBigInt < amountBigInt) {
          setError(
            `Insufficient balance. You have ${formatEther(userBalance)} PHYC.`
          );
          return;
        }

        // Call the transfer function
        const tx = await phycoCoinContract.transfer(recipientAddress, amount);
        const receipt = await tx.wait();

        if (receipt) {
          // Update balance after transfer
          if (walletAddress) {
            const newBalance = await phycoCoinContract.balanceOf(walletAddress);
            setBalance(formatEther(newBalance));

            console.log(
              `New balance of ${walletAddress}: ${formatEther(newBalance)} PHYC`
            );
          }
          console.log(
            "Transfer transaction successful! Transaction Hash:",
            receipt.hash
          );

          // Add to transaction history
          setTransactions((prev) => [
            {
              hash: receipt.hash,
              recipient: recipientAddress,
              amount: mintAmount,
              timestamp: new Date().toLocaleString(),
            },
            ...prev,
          ]);

          setSuccess(
            `Successfully sent ${mintAmount} PHYC to ${recipientAddress.slice(
              0,
              6
            )}...${recipientAddress.slice(-4)} (Tx: ${receipt.hash.slice(
              0,
              6
            )}...${receipt.hash.slice(-4)})`
          );

          // Clear recipient field
          setRecipientAddress("");
        } else {
          throw new Error("Transaction failed to be mined.");
        }
      } else {
        throw new Error("Wallet not connected or network not ready.");
      }
    } catch (e: any) {
      console.error(e);
      setError("Failed to transfer PhycoCoins: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.mintSection}>
      <div className={styles.mintSectionInner}>
        <h2 className={styles.heading}>Send PhycoCoins</h2>

        <hr className={styles.divider} />

        <form
          className={styles.mintForm}
          onSubmit={(e) => {
            e.preventDefault();
            console.log("form mint");
            onMint();
          }}
        >
          <h4>Payment Amount</h4>
          <p>{mintAmount ? mintAmount : "0"} PHYC</p>
          <br />
          <div className={styles.inputGroup}></div>
          <button
            className={styles.btn}
            disabled={
              !mintAmount ||
              isProcessing ||
              walletConnectionStatus !== "connected"
            }
            type="submit"
          >
            <strong>Send</strong>
          </button>
        </form>

        <div className={styles.transferSection}>
          <h4>Transfer PhycoCoins</h4>
          <input
            type="text"
            className={styles.recipientInput}
            placeholder="Recipient Address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
          <button
            className={styles.btn}
            disabled={
              !recipientAddress ||
              !mintAmount ||
              isProcessing ||
              walletConnectionStatus !== "connected"
            }
            onClick={onTransfer}
          >
            <strong>Transfer</strong>
          </button>
        </div>

        {error && <pre className={styles.error}>{error}</pre>}
        {success && <pre className={styles.success}>{success}</pre>}

        <div className={styles.balanceSection}>
          <h4>Your Balance</h4>
          <p>{balance} PHYC</p>
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
                    Tx: {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)} - Sent{" "}
                    {tx.amount} PHYC to {tx.recipient} on {tx.timestamp}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
