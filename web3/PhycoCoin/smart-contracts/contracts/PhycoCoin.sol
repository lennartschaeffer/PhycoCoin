// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PhycoCoin is ERC20, Ownable {
    // Price in ETH per PhycoCoin (fixed rate)
    // For demo purposes: 0.001 ETH = 1 PHYC
    uint256 public phycoCoinPrice = 1000000000000000; // 0.001 ETH in wei

    // Events
    event PhycoCoinsSwapped(
        address buyer,
        address seller,
        uint256 ethAmount,
        uint256 phycoCoinAmount
    );
    event PhycoCoinPriceUpdated(uint256 newPrice);

    constructor() ERC20("PhycoCoin", "PHYC") Ownable(msg.sender) {}

    // Allow the owner to mint PhycoCoins
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Update the PhycoCoin price
    function updatePhycoCoinPrice(uint256 newPrice) public onlyOwner {
        phycoCoinPrice = newPrice;
        emit PhycoCoinPriceUpdated(newPrice);
    }

    // Swap ETH for PhycoCoins
    function swapETHForPhycoCoins(
        address farmerAddress,
        uint256 phycoCoinAmount
    ) public payable {
        // Calculate ETH amount needed
        uint256 ethNeeded = (phycoCoinAmount * phycoCoinPrice) / 10 ** 18;

        // Check that sent ETH matches required amount
        require(
            msg.value == ethNeeded,
            "Sent ETH amount doesn't match the required price"
        );

        // Check that farmer has enough PhycoCoins
        require(
            balanceOf(farmerAddress) >= phycoCoinAmount,
            "Farmer doesn't have enough PhycoCoins"
        );

        // Transfer PhycoCoins from farmer to buyer
        _transfer(farmerAddress, msg.sender, phycoCoinAmount);

        // Transfer ETH to farmer
        (bool success, ) = payable(farmerAddress).call{value: msg.value}("");
        require(success, "ETH transfer to farmer failed");

        // Emit event
        emit PhycoCoinsSwapped(
            msg.sender,
            farmerAddress,
            msg.value,
            phycoCoinAmount
        );
    }

    // For demo purposes, all farmers are considered authorized
    function isFarmerAuthorized(address) public pure returns (bool) {
        return true;
    }

    // Allow the contract to receive ETH
    receive() external payable {}
}
