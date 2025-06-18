# PhycoCoin

PhycoCoin is an AI & blockchain-based platform for rewarding seaweed farmers for verified nutrient removal. It connects farmers with local businesses and enables transparent, tokenized incentives for environmental impact.

Pitch Video: https://www.youtube.com/watch?v=uU3OWYv-kEY 

## Features

- **Model & Data**
- `quantile_regressor_model.pkl`: AI Model to validate biomass claims using sensor data and environmental context (light, water temperature, nutrients), then calculate nutrient offsets using real market values. 
- **Backend** (Flask API)
- The backend provides machine learning-powered validation and valuation of seaweed harvests. It exposes a REST API for the frontend to submit harvest data and receive validation, nutrient removal, and credit calculations.
- **Smart Contract (Solidity):**
  - ERC20 token (PHYC) for nutrient removal credits
  - ETH-based swap: buyers can purchase PhycoCoins from farmers using ETH
  - Harvest tracking and environmental logic
- **Farmer Portal (Next.js):**
  - Wallet connection and dashboard
  - Submit harvests for validation
  - View and receive tokens for approved harvests
  - Transaction and earnings overview
- **Frontend Marketplace:**
  - Buy PhycoCoins from farmers
  - Transfer and swap tokens


## Project Structure

```
web3/PhycoCoin/
├── frontend/         # Next.js frontend for PhycoCoin
├── smart-contracts/  # Solidity contracts, Hardhat scripts
│   ├── contracts/    # PhycoCoin.sol, Wall.sol
│   ├── scripts/      # Deployment scripts
│   └── ...
└── ...
```

## Getting Started

### 1. Install Dependencies

```bash
cd web3/PhycoCoin/smart-contracts
npm install
cd ../frontend
npm install
```

### 2. Deploy the Smart Contract

- Configure your `.env` with your deployer private key in `smart-contracts`.
- Deploy to local or testnet:

```bash
# Local
npx hardhat run scripts/deploy_localhost.ts --network hardhat
# Testnet (e.g., Sepolia)
npx hardhat run scripts/deploy_prod.ts --network sepolia
```

### 3. Run the Frontend

```bash
cd web3/PhycoCoin/frontend
npm run dev
```

### 4. Farmer Portal

- Go to `/farmer-connect` to connect your wallet
- Access `/farmer` dashboard for harvests and earnings
- Submit new harvests and receive tokens

## Environment Variables

- `smart-contracts/.env`: `PRIVATE_KEY_DEPLOYER=...`
- `frontend/.env.local`: Set contract address and RPC if needed

## Technologies Used

- Solidity, Hardhat, Ethers.js
- Next.js, React, Tailwind CSS
- OpenZeppelin Contracts

## License

MIT

## Acknowledgements

- OpenSeaweed, OpenZeppelin, and the Ethereum community
