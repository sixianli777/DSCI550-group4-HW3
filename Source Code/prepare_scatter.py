import pandas as pd

# Load original dataset
df = pd.read_csv("haunted_places_complete_v2.tsv", sep="\t")

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
# Output TSV for D3 visualization
df_agg.to_csv("scatter.tsv", sep="\t", index=False)
