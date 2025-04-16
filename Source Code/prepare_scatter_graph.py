import pandas as pd

# Load the scatter data
scatter_df = pd.read_csv("../Data/scatter.tsv", sep="\t")

# Load population Excel (skip header rows)
pop_df = pd.read_excel("../Data/census.xlsx", skiprows=3)

# Clean and filter to states only
pop_states = pop_df.iloc[5:56].copy()
pop_states = pop_states.rename(columns={"Unnamed: 0": "state", 2023: "population_2023"})
pop_states["state"] = pop_states["state"].str.replace("^\.", "", regex=True).str.strip()
pop_states = pop_states[["state", "population_2023"]]

# Manual mapping from abbreviations to full names
abbrev_to_state = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
}

# Map full state names
scatter_df["state"] = scatter_df["state_abbrev"].map(abbrev_to_state)

# Merge datasets
merged_df = scatter_df.merge(pop_states, on="state", how="left")

# Add DC's population manually
merged_df.loc[merged_df["state_abbrev"] == "DC", "population_2023"] = 671803

# Calculate sightings per 100k population
merged_df["sightings"] = (merged_df["sightings"] / merged_df["population_2023"]) * 100000
merged_df["sightings"] = merged_df["sightings"].round(1)

# Save output
final_df = merged_df[["state_abbrev", "sightings", "pc_adult_drink_monthly"]]
final_df.to_csv("../Data/scatter_final.tsv", sep="\t", index=False)
