import pandas as pd

# Output 2: Grouped bar chart - apparition type by time of day
df = pd.read_csv("Data/haunted_places_complete_v2.tsv", sep="\t")
# Drop rows with missing values in relevant columns
df = df.dropna(subset=["time_of_day", "apparition_type"])

# Split apparition_type on comma, strip spaces, and explode into separate rows
df["apparition_type"] = df["apparition_type"].str.split(",")
df = df.explode("apparition_type")
df["apparition_type"] = df["apparition_type"].str.strip()

# Remove rows where either value is 'Unknown' (case-insensitive)
df = df[~df["apparition_type"].str.lower().eq("unknown")]
df = df[~df["time_of_day"].str.lower().eq("unknown")]

# Group by time_of_day and apparition_type
grouped = df.groupby(["time_of_day", "apparition_type"]).size().reset_index(name="sightings_count")

# Save to TSV
grouped.to_csv("grouped_bar_chart.tsv", sep="\t", index=False)
