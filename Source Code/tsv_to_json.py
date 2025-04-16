import pandas as pd
import json

# Input and output file paths
input_tsv = "../Data/scatter_final.tsv"
output_json = "../Data/scatter_final.json"
input_tsv2 = "../Data/grouped_bar_chart.tsv"
output_json2 = "../Data/grouped_bar_chart.json"

# Read the TSV file
df = pd.read_csv(input_tsv, sep="\t")
df2 = pd.read_csv(input_tsv2, sep="\t")

# Convert DataFrame to list of dictionaries
data = df.to_dict(orient="records")
data2 = df2.to_dict(orient="records")

# Write to a single JSON file
with open(output_json, "w") as f:
    json.dump(data, f, indent=2)
with open(output_json2, "w") as f:
    json.dump(data2, f, indent=2)

print(f"✅ Successfully converted TSV to JSON: {output_json}")
