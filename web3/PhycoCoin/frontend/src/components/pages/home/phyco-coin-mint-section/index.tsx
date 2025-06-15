import { useState } from "react";
import React from "react";
import styles from "./styles.module.css";
import { useSmartContract } from "@/hooks/useSmartContract";
import { useWallet } from "@/hooks/useWallet";
import { PhycoCoin } from "@phyco-types/PhycoCoin";
import { parseEther } from "ethers";
import { useSearchParams } from "next/navigation";

export default function PhycoCoinMintSection() {
  const { getSmartContract, deployedNetworkData } = useSmartContract();
  const { walletConnectionStatus, switchNetwork, chainCurrent, walletAddress } =
    useWallet();
  const searchParams = useSearchParams();
  const mintAmount = searchParams.get("total");
  const [error, setError] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  console.log("mintAmount", mintAmount);

  const onMint = async () => {
    console.log("onMint");
    setError("");
    const phycoCoinContract = getSmartContract<PhycoCoin>("PHYCOCOIN"); // Use getSmartContract
    if (!phycoCoinContract) {
      setError("PhycoCoin contract not found or not connected.");
      return;
    }

    try {
      setIsMinting(true);

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
      setIsMinting(false);
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
              !mintAmount || isMinting || walletConnectionStatus !== "connected"
            }
            type="submit"
          >
            <strong>Send</strong>
          </button>
        </form>

        {error && <pre className={styles.error}>{error}</pre>}
      </div>
    </div>
  );
}
