import pandas as pd

# Load the CSV file (update filename if needed)
input_file = 'nafc_station_27_ctd_profiles_f672_c5bd_0a38.csv'
output_file = 'cleaned_output.csv'

# Read CSV and skip the second row with units
df = pd.read_csv(input_file, header=0, skiprows=[1])

# Drop all rows with any NaN values
df_cleaned = df.dropna()

# Save the cleaned data to a new CSV
df_cleaned.to_csv(output_file, index=False)

print(f"✅ Cleaned file saved as '{output_file}'.")
print(f"Original rows: {len(df)}, Rows after cleaning: {len(df_cleaned)}")
