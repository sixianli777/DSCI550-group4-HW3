import os
import pandas as pd

# --- 1. Define file paths ---
base_dir = os.path.dirname(__file__)
tsv_path = os.path.join(base_dir, "..", "Data", "haunted_places_hw2_complete.tsv")
json_output_path = os.path.join(base_dir, "..", "Data", "violin_cleaned.json")

# --- 2. Load and keep only relevant columns ---
columns = [
    'haunted_places_witness_count',
    'rel_humidity_avg',
    'cloud_cover_avg',
    'precipitation_sum',
    'wind_gusts_max'
]

df = pd.read_csv(tsv_path, sep='\t')
df = df[columns].copy()
df = df.apply(pd.to_numeric, errors='coerce')  # force all to numeric
df.dropna(inplace=True)

# --- 3. Outlier removal using IQR ---
def remove_outliers(df, column):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    return df[(df[column] >= lower) & (df[column] <= upper)]

for col in columns[1:]:  # skip witness count
    df = remove_outliers(df, col)

# --- 4. Convert to long-form for D3 (weather type and value) ---
long_dfs = []
for weather_var in columns[1:]:
    temp = df[[weather_var, 'haunted_places_witness_count']].copy()
    temp.columns = ['weather_value', 'witness_count']
    temp['weather_type'] = weather_var
    long_dfs.append(temp)

df_long = pd.concat(long_dfs)

# --- 5. Export to JSON ---
df_long.to_json(json_output_path, orient='records', lines=False)
