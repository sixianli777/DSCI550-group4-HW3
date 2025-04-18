import os
import pandas as pd
base_dir = os.path.dirname(__file__)  # folder of current .py file
tsv_path = os.path.join(base_dir, "..", "Data", "haunted_places_hw2_complete.tsv")
df = pd.read_csv(tsv_path, sep="\t")

# Output 1: Scatter plot: correlation between alcohol rate and sightings by states
# Keep relevant columns
cols_to_keep = ["state_abbrev", "pc_adult_drink_monthly"]
df = df[cols_to_keep].copy()
df = df.dropna()

# Clean percentage values and convert to float
df["pc_adult_drink_monthly"] = df["pc_adult_drink_monthly"].str.replace('%', '', regex=False)
df["pc_adult_drink_monthly"] = pd.to_numeric(df["pc_adult_drink_monthly"], errors="coerce")

# Drop rows with any remaining NaNs
df = df.dropna()

# Group by state and count sightings
df_agg = df.groupby("state_abbrev").agg(
    sightings=("state_abbrev", "count"),
    pc_adult_drink_monthly=("pc_adult_drink_monthly", "mean")
).reset_index()

df_agg["pc_adult_drink_monthly"] = df_agg["pc_adult_drink_monthly"].round(1)

output_path = os.path.join(base_dir, "..", "Data", "scatter.tsv")
df_agg.to_csv(output_path, sep="\t", index=False)
