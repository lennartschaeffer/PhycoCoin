import pandas as pd
import numpy as np
import re

def clean_algae_data():
    df = pd.read_csv('ML/data/algae_alberta.csv')
    
    available_characteristics = df['CharacteristicName'].unique()
    print(f"Available characteristics: {available_characteristics}")
    
    characteristic_mapping = {
        'Temperature, water': 'water_temperature',
        'Chlorophyll a, corrected for pheophytin': 'chlorophyll', 
        'Light, photosynthetic active radiation (PAR)': 'light',
        'Light intensity': 'light',
        'Inorganic nitrogen (nitrate and nitrite)': 'inorganic_nitrogen',
        'Nitrogen, inorganic': 'inorganic_nitrogen',
        'Nitrate': 'inorganic_nitrogen',
        'Total Phosphorus, mixed forms': 'total_phosphorus',
        'Phosphorus': 'total_phosphorus',
        'Depth, Secchi disk depth': 'secchi_depth',
        'Secchi disk depth': 'secchi_depth',
        'Depth, secchi disk': 'secchi_depth',
        'Transparency, Secchi disc': 'secchi_depth',
    }
    
    mask = df['CharacteristicName'].isin(characteristic_mapping.keys())
    filtered_df = df[mask]
    
    found_characteristics = filtered_df['CharacteristicName'].unique()
    print(f"Found relevant characteristics: {found_characteristics}")
    
    if len(found_characteristics) == 0:
        print("No relevant characteristics found in the dataset.")
        return None
    
    # Extract relevant columns
    selected_cols = ['MonitoringLocationID', 'MonitoringLocationName', 
                     'MonitoringLocationLatitude', 'MonitoringLocationLongitude',
                     'ActivityStartDate', 'CharacteristicName', 'ResultValue', 'ResultUnit']
    filtered_df = filtered_df[selected_cols].copy()
    
    filtered_df['StandardizedCharacteristic'] = filtered_df['CharacteristicName'].map(characteristic_mapping)
    
    pivot_df = filtered_df.pivot_table(
        index=['MonitoringLocationID', 'MonitoringLocationName', 
               'MonitoringLocationLatitude', 'MonitoringLocationLongitude', 'ActivityStartDate'],
        columns='StandardizedCharacteristic',
        values='ResultValue',
        aggfunc='first'
    ).reset_index()
    
    pivot_df.columns.name = None
    
    expected_columns = ['water_temperature', 'chlorophyll', 'light', 'inorganic_nitrogen', 
                       'total_phosphorus', 'secchi_depth']
    
    for col in expected_columns:
        if col not in pivot_df.columns:
            pivot_df[col] = None
    
    # Filter out rows where chlorophyll is missing (since it's our target variable)
    print(f"Total rows before filtering: {len(pivot_df)}")
    chlorophyll_df = pivot_df.dropna(subset=['chlorophyll'])
    print(f"Rows with chlorophyll measurements: {len(chlorophyll_df)}")
    
  
    location_info = chlorophyll_df[['MonitoringLocationID', 'MonitoringLocationName', 
                               'MonitoringLocationLatitude', 'MonitoringLocationLongitude', 
                               'ActivityStartDate']]
    
    # combine the location info with the feature data
    final_df = chlorophyll_df.copy()
    
    
    # Create a complete dataset by dropping any rows that still have missing values
    complete_df = final_df.dropna()
    print(f"Rows with complete data (no missing values): {len(complete_df)}")
    
    # Save the complete dataset (no missing values)
    output_path_complete = 'ML/data/cleaned_algae_data_complete.csv'
    complete_df.to_csv(output_path_complete, index=False)
    print(f"Complete data (no missing values) saved to {output_path_complete}")
    
    return final_df

if __name__ == "__main__":
    clean_algae_data()