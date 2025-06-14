### Pages & Components

## FARMER VIEW

1. **HarvestForm**  
   - **Inputs**:  
     • Harvest ID (text)  
     • Wet Biomass (kg) (number)  
     • Harvest Date (date)  
     • Latitude & Longitude (number, this should come from location API)  
     - Optional manual input for sensor data ('light', 'water_temperature', 'inorganic_nitrogen',
        'total_phosphorus', 'secchi_depth')
   - **Buttons**:  
     • “Fetch Sensor Data” → calls `POST /api/fetchSensors {}` 
     • “Validate Harvest” (disabled until sensorData arrives) → calls `POST /api/validateHarvest { harvestId, W_kg, sensorData }`

2. **SensorDataDisplay**  
   - Shows the five fetched values:  
     • water_temperature, light_PAR, inorganic_nitrogen, total_phosphorus, secchi_depth  
   - Render as labeled cards in a responsive grid.

3. **ValidationResult**  
   - After `/validateHarvest`, display:  
     • “✅ Plausible harvest” or “🚩 Suspicious harvest”  
     • If plausible, show computed nutrient removals: N_kg, P_kg, C_kg.  
     • Button “Mint KelpCoins” → calls `POST /api/mintCoins { harvestId }`

4. **MintResult**  
   - After `/mintCoins`, show:  
     • “You’ve minted X KelpCoins!”  
     • Display breakdown: coins from Nitrogen, coins from Phosphorus, coins from Carbon.  
     • Button “List for Sale” → opens a modal to set reserve price per coin.

5. **OrderBook**  
   - Below the mint flow, show a table of active listings:  
     • Columns: Farmer, harvestId, coinsAvailable, pricePerCoin, “Buy” button.  
     • “Buy” calls `POST /api/executeTrade { batchId, coins, pricePerCoin }`

6. **Global Layout**  
   - Simple header with site title and nav (“My Harvests” / “Marketplace”).  
   - Use shadcn/ui `<Card>`, `<Button>`, `<Input>`, `<Table>` components.

---

### UX Details & State Flow

- Clicking “Fetch Sensor Data”:  
  • Show spinner on button, then populate SensorDataDisplay.  
- Only when sensor data arrives, enable “Validate Harvest.”  
- Validation triggers show/hide of ValidationResult.  
- Only when harvest is validated, enable “Mint…”  
- After minting, update OrderBook so newly listed coins appear.  

---